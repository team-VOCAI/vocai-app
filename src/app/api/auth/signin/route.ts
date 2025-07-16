import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Profile에서 email로 찾기
  const profile = await prisma.profile.findFirst({ where: { email } });
  if (!profile) {
    return NextResponse.json({ error: '존재하지 않는 계정입니다.' }, { status: 401 });
  }

  // User에서 userId로 찾기
  const user = await prisma.user.findUnique({ where: { userId: profile.userId } });
  if (!user) {
    return NextResponse.json({ error: '존재하지 않는 계정입니다.' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password ?? '');
  if (!isValid) {
    return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
  }

  // JWT 토큰 발급
  const token = jwt.sign(
    { userId: user.userId},
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // 토큰을 쿠키에 저장 (HttpOnly)
  const response = NextResponse.json({ message: '로그인 성공', token });
  response.cookies.set('token', token, { httpOnly: true, path: '/' });

  return response;
}