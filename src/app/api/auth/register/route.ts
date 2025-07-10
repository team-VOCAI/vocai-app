import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { email, password, nickname, phone } = await req.json();

  // 이메일 중복 체크 (Profile의 email)
  const existingProfile = await prisma.profile.findFirst({ where: { email } });
  if (existingProfile) {
    return NextResponse.json({ error: '이미 가입된 이메일입니다.' }, { status: 400 });
  }

  // 닉네임 중복 체크 (Profile의 nickName)
  const existingNickname = await prisma.profile.findFirst({ where: { nickName: nickname } });
  if (existingNickname) {
    return NextResponse.json({ error: '이미 사용 중인 닉네임입니다.' }, { status: 400 });
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // 트랜잭션으로 User와 Profile 생성 및 양방향 연결
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. User 생성
      const user = await tx.user.create({
        data: {
          loginId: email,
          password: hashedPassword,
        },
      });
      // 2. Profile 생성
      const profile = await tx.profile.create({
        data: {
          userId: user.userId,
          nickName: nickname,
          name: '',
          phoneNum: phone,
          email: email,
        },
      });
      // 3. User에 profileId 입력
      await tx.user.update({
        where: { userId: user.userId },
        data: { profile: { connect: { profileId: profile.profileId } } },
      });
      return { user, profile };
    });
    return NextResponse.json({ message: '회원가입 성공', user: { email: result.profile.email, nickname: result.profile.nickName } });
  } catch (error) {
    return NextResponse.json({ error: '회원가입 중 오류가 발생했습니다.' }, { status: 500 });
  }
}