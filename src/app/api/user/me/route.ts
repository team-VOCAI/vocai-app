import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  // 1. 쿠키에서 token 읽기
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

  // 2. user + profile 조인해서 정보 반환
  const user = await prisma.user.findUnique({
    where: { userId: Number(userId) },
    select: {
      userId: true,
      email: true,
      createdAt: true,
      profile: {
        select: {
          profileId: true,
          name: true,
          nickName: true,
          phoneNum: true,
          persona: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: '유저 없음' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
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

  const body = await req.json();
  const { name, nickName, phone, persona } = body;

  try {
    await prisma.user.update({
      where: { userId: Number(userId) },
      data: {
        profile: {
          update: {
            name: name,
            nickName: nickName,
            phoneNum: phone,
            persona: persona,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: '업데이트 실패' }, { status: 500 });
  }
}
