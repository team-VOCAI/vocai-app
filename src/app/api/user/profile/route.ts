import { NextRequest, NextResponse } from 'next/server';
import { getProfileFromRequest } from '@/lib/getProfile';

export async function GET(req: NextRequest) {
  try {
    const profile = await getProfileFromRequest(req);

    if (!profile) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    // 민감한 정보는 제외하고 필요한 정보만 반환
    const safeProfile = {
      profileId: profile.profileId,
      userId: profile.userId,
      nickName: profile.nickName,
      name: profile.name,
      email: profile.email,
      // phoneNum은 보안상 제외
    };

    return NextResponse.json(safeProfile);
  } catch (error) {
    console.error('프로필 조회 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
