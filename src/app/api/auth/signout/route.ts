import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: '로그아웃 되었습니다.' });

  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });

  return response;
}
