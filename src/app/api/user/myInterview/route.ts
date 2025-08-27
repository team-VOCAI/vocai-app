import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProfileFromRequest } from '@/lib/getProfile';

export async function GET(req: NextRequest) {
  try {
    const profile = await getProfileFromRequest(req);
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await prisma.mockInterviewSession.findMany({
      where: { profileId: profile.profileId, deletedAt: null },
      select: { sessionId: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('내 면접 조회 오류:', error);
    return NextResponse.json(
      { error: '면접 기록을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}
