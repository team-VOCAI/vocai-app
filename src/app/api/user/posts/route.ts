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

  // 2. userId로 profileId 조회
  const profile = await prisma.profile.findUnique({
    where: { userId: Number(userId) },
    select: { profileId: true },
  });

  if (!profile) {
    return NextResponse.json({ error: '프로필 없음' }, { status: 404 });
  }

  // 3. profileId로 posts의 모든 정보 조회
  const posts = await prisma.post.findMany({
    where: { profileId: profile.profileId },
    orderBy: { createdAt: 'desc' },
    // select를 제거하면 모든 컬럼이 반환됩니다
  });

  return NextResponse.json({ posts });
}