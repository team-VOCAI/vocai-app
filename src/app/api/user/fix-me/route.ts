import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(req: Request) {
  try {
    // 1. 토큰 확인 (헤더 → 쿠키 순서)
    let token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    }

    if (!token) {
      return NextResponse.json({ error: '토큰이 필요합니다.' }, { status: 401 });
    }

    // 2. 토큰 디코딩 → userId 추출
    let userId;
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    // 3. 요청에서 수정할 정보 및 비밀번호 추출
    const { nickName, phoneNum, email, password, confirmPassword } = await req.json();

    if (!password || !confirmPassword) {
      return NextResponse.json({ error: '비밀번호가 필요합니다.' }, { status: 400 });
    }

    // 4. 비밀번호 확인
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: '사용자 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: '비밀번호 재확인이 일치하지 않습니다.' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    // 5. 정보 수정
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        nickName: nickName ?? undefined,
        phoneNum: phoneNum ?? undefined,
        email: email ?? undefined,
      },
    });

    return NextResponse.json({
      message: '프로필이 성공적으로 수정되었습니다.',
      profile: {
        nickName: updatedProfile.nickName,
        phoneNum: updatedProfile.phoneNum,
        email: updatedProfile.email,
      },
    });
  } catch (error) {
    console.error('마이페이지 수정 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
