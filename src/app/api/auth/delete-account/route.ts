import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { auth, authOptions } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function DELETE(req: Request) {
  const { password } = await req.json();
  if (typeof password === 'string') {

  // 1. Authorization 헤더에서 토큰 시도
  let token = req.headers.get('authorization')?.replace('Bearer ', '');

  // 2. 없으면 쿠키에서 시도
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;
  }

  if (!token) {
    return NextResponse.json({ error: '토큰이 필요합니다.' }, { status: 401 });
  }

  let userId;
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    userId = decoded.userId;
  } catch (err) {
    return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 });
  }

  // loginId로 User 조회
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) {
    return NextResponse.json({ error: '존재하지 않는 유저입니다.' }, { status: 404 });
  }

  // 비밀번호 확인
  const isValid = await bcrypt.compare(password, user.password ?? '');
  if (!isValid) {
    return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
  }

  // soft delete
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { userId },
        data: { deletedAt: new Date() },
      });
      await tx.profile.updateMany({
        where: { userId: user.userId },
        data: { deletedAt: new Date() },
      });
    });

    return NextResponse.json({ message: '회원탈퇴가 완료되었습니다.' });
  } catch (error) {
    console.error('회원탈퇴 오류:', error);
    return NextResponse.json({ error: '회원탈퇴 중 오류가 발생했습니다.' }, { status: 500 });
  }
} else {
  // 소셜(구글) 회원 탈퇴 로직
  // 1. next-auth 세션에서 email 추출
  let email = null;
  try {
    const session = await auth();
    console.log('🔥 세션 정보:', session);
    if(!session) {
      return NextResponse.json({error: '인증이 필요합니다.'}, {status: 401});
    }
    if (session && session.user?.email) {
      console.log('✅ 세션에서 이메일:', session.user.email);
      email = session.user.email;
    }
  } catch (err) {
    return NextResponse.json({ error: '세션 인증에 실패했습니다.' }, { status: 401 });
  }
  if (!email) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }
  // 2. email로 User 찾기
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: '존재하지 않는 유저입니다.' }, { status: 404 });
  }
  // 3. soft delete
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { userId: user.userId },
        data: { deletedAt: new Date() },
      });
      await tx.profile.updateMany({
        where: { userId: user.userId },
        data: { deletedAt: new Date() },
      });
    });
    return NextResponse.json({ message: '구글 회원탈퇴가 완료되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '구글 회원탈퇴 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
}