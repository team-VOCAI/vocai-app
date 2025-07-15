import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: '이메일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 체크 (Profile의 email)
    const existingProfile = await prisma.profile.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existingProfile) {
      return NextResponse.json(
        {
          available: false,
          message: '이미 가입된 이메일입니다.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        available: true,
        message: '사용 가능한 이메일입니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('이메일 중복 확인 중 오류 발생:', error);
    return NextResponse.json(
      { error: '이메일 중복 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
