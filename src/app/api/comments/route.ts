import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const postId = Number(req.nextUrl.searchParams.get('postId'));

  if (isNaN(postId)) {
    return NextResponse.json(
      { message: 'postId가 필요합니다.' },
      { status: 400 }
    );
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId,
      deletedAt: null, // 삭제되지 않은 댓글만 조회
    },
    orderBy: { createdAt: 'asc' },
    include: { profile: true },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const { postId, content } = await req.json();

  // 미들웨어에서 전달된 사용자 프로필 정보를 헤더에서 가져옵니다.
  const profileHeader = req.headers.get('x-user-profile');
  if (!profileHeader) {
    // 미들웨어가 정상적으로 실행되었다면 이 경우는 거의 발생하지 않습니다.
    return NextResponse.json({ error: '인증 정보가 없습니다.' }, { status: 401 });
  }

  const profile = JSON.parse(profileHeader);

  const comment = await prisma.comment.create({
    data: {
      postId,
      profileId: profile.profileId,
      nickName: profile.nickName,
      content,
    },
    include: { profile: true },
  });

  return NextResponse.json(comment, { status: 201 });
}

