import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { email, password, nickname, phone } = await req.json();

  // 이메일 중복 체크
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: '이미 가입된 이메일입니다.' }, { status: 400 });
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // 유저 생성
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nickname,
      phone,
    },
  });

  return NextResponse.json({ message: '회원가입 성공', user: { id: user.id, email: user.email } });
}