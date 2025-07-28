// src/app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProfileFromRequest } from '@/lib/getProfile';

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

  // 실제 로그인한 사용자 확인
  const profile = await getProfileFromRequest(req);

  if (!profile) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 });
  }

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
