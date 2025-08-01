import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
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

    // 3. userId 검색
    let userId;
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
        return NextResponse.json({ error: '유효하지 않은 토큰입니다.'}, { status: 401 });
    }
    // 4. 데이터 조회
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        loginId: true,
        profile: {
          select: {
            nickName: true,
            name: true,
            phoneNum: true,
            email: true,
            posts: true
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 5. 데이터 출력
    return NextResponse.json({
      loginId: user.loginId,
      nickName: user.profile?.nickName ?? null,
      name: user.profile?.name ?? null,
      phoneNum: user.profile?.phoneNum ?? null,
      email: user.profile?.email ?? null,
      posts: user.profile?.posts ?? null,
    });
  } catch (error) {
    return NextResponse.json({ error: '인증 실패 또는 서버 오류' }, { status: 401 });
  }
}
