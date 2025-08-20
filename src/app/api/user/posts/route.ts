import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  // 1. 토큰에서 userId 추출
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: '토큰 필요' }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: '유효하지 않은 토큰' }, { status: 401 });
  }

  const userId = decoded.userId;
  if (!userId) {
    return NextResponse.json({ error: '토큰에 userId 없음' }, { status: 401 });
  }

  // 2. userId로 nickname 조회
  const user = await prisma.user.findUnique({
    where: { userId: Number(userId) },
    include: { profile: true },
  });

  const nickname = user?.profile?.nickName;
  if (!nickname) {
    return NextResponse.json({ error: '닉네임 없음' }, { status: 404 });
  }

  // 3. nickname으로 post 조회
  const posts = await prisma.post.findMany({
    where: { nickName: nickname },
    select: {
      title: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ posts });
}