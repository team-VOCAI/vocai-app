import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nickname = searchParams.get('nickname');

    if (!nickname) {
      return NextResponse.json(
        { error: '닉네임이 필요합니다.' },
        { status: 400 }
      );
    }

    // 닉네임 중복 체크 (Profile의 nickName)
    const existingNickname = await prisma.profile.findFirst({
      where: { nickName: nickname },
    });

    if (existingNickname) {
      return NextResponse.json(
        {
          available: false,
          message: '이미 사용 중인 닉네임입니다.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        available: true,
        message: '사용 가능한 닉네임입니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('닉네임 중복 확인 중 오류 발생:', error);
    return NextResponse.json(
      { error: '닉네임 중복 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
