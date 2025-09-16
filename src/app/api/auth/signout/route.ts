import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 토큰 쿠키 삭제
    const response = NextResponse.json({
      message: '로그아웃이 완료되었습니다.',
    });

    response.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0), // 즉시 만료
    });

    return response;
  } catch (error) {
    console.error('로그아웃 중 오류:', error);
    return NextResponse.json(
      { error: '로그아웃 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
