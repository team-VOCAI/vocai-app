import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileFromRequest } from "@/lib/getProfile";

// GET: 게시글 상세
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;
  const numericPostId = Number(postId);

  const post = await prisma.post.findUnique({
    where: { postId: numericPostId },
    include: { profile: true, board: true },
  });

  if (!post || post.deletedAt) {
    return NextResponse.json(
      { message: "게시글을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(post);
}

// PUT: 게시글 수정
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const profile = await getProfileFromRequest(req);
  if (!profile) {
    return NextResponse.json(
      { error: "인증되지 않았습니다." },
      { status: 401 }
    );
  }

  const { postId } = await context.params;
  const numericPostId = Number(postId);

  const post = await prisma.post.findUnique({
    where: { postId: numericPostId },
  });

  if (!post) {
    return NextResponse.json(
      { error: "게시글이 존재하지 않습니다." },
      { status: 404 }
    );
  }

  if (post.profileId !== profile.profileId) {
    return NextResponse.json(
      { error: "수정 권한이 없습니다." },
      { status: 403 }
    );
  }

  const { title, content } = await req.json();
  if (!title || !content || title.trim() === "" || content.trim() === "") {
    return NextResponse.json(
      { error: "제목과 내용을 입력해 주세요." },
      { status: 400 }
    );
  }

  const updated = await prisma.post.update({
    where: { postId: numericPostId },
    data: { title, content },
  });

  return NextResponse.json(updated);
}

// DELETE: 게시글 삭제 (soft delete)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const profile = await getProfileFromRequest(req);
  if (!profile) {
    return NextResponse.json(
      { error: "인증되지 않았습니다." },
      { status: 401 }
    );
  }

  const { postId } = await context.params;
  const numericPostId = Number(postId);

  const post = await prisma.post.findUnique({
    where: { postId: numericPostId },
  });

  if (!post) {
    return NextResponse.json(
      { error: "게시글이 존재하지 않습니다." },
      { status: 404 }
    );
  }

  if (post.profileId !== profile.profileId) {
    return NextResponse.json(
      { error: "삭제 권한이 없습니다." },
      { status: 403 }
    );
  }

  await prisma.post.update({
    where: { postId: numericPostId },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true, deletedPostId: numericPostId });
}
