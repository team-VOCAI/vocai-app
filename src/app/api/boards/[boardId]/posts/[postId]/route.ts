import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProfileFromRequest } from '@/lib/getProfile';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;

  const post = await prisma.post.findUnique({
    where: { postId: Number(postId) },
    include: {
      profile: true,
      board: true,
      comments: {
        where: { deletedAt: null }, // 삭제되지 않은 댓글만 카운트
      },
    },
  });

  if (!post || post.deletedAt) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  // 댓글 수 계산
  const postWithCommentCount = {
    ...post,
    commentCount: post.comments.length,
  };

  return NextResponse.json(postWithCommentCount);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const profile = await getProfileFromRequest(req);
  if (!profile) {
    return NextResponse.json(
      { error: '인증되지 않았거나 프로필을 찾을 수 없습니다.' },
      { status: 401 }
    );
  }

  const { postId } = await context.params;
  const post = await prisma.post.findUnique({
    where: { postId: Number(postId) },
  });

  if (!post || post.profileId !== profile.profileId) {
    return NextResponse.json(
      { error: '게시글이 없거나 권한이 없습니다.' },
      { status: 403 }
    );
  }

  const { title, content } = await req.json();

  const updated = await prisma.post.update({
    where: { postId: Number(postId) },
    data: { title, content },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const profile = await getProfileFromRequest(req);
  if (!profile) {
    return NextResponse.json(
      { error: '인증되지 않았거나 프로필을 찾을 수 없습니다.' },
      { status: 401 }
    );
  }

  const { postId } = await context.params;
  const post = await prisma.post.findUnique({
    where: { postId: Number(postId) },
  });

  if (!post || post.profileId !== profile.profileId) {
    return NextResponse.json(
      { error: '게시글이 없거나 권한이 없습니다.' },
      { status: 403 }
    );
  }

  const deleted = await prisma.post.update({
    where: { postId: Number(postId) },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true, deletedPostId: deleted.postId });
}
