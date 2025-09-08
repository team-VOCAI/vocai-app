import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileFromRequest } from "@/lib/getProfile";

interface Attachment {
  name: string;
  size: number;
  type: string;
  data: string; // base64
}

// GET: 게시글 상세
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;
  const numericPostId = Number(postId);

  const post = await prisma.post.findUnique({
    where: { postId: numericPostId },
    include: {
      profile: true,
      board: true,
      comments: {
        where: { deletedAt: null }, // 삭제되지 않은 댓글만 카운트
      },
      attachments: true, // 첨부파일 포함
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

// PUT: 게시글 수정
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
  const numericPostId = Number(postId);

  const post = await prisma.post.findUnique({
    where: { postId: numericPostId },
    include: { attachments: true }, // 기존 첨부파일도 조회
  });

  if (!post) {
    return NextResponse.json(
      { error: "게시글이 존재하지 않습니다." },
      { status: 404 }
    );
  }

  if (post.profileId !== profile.profileId) {
    return NextResponse.json(
      { error: '게시글이 없거나 권한이 없습니다.' },
      { status: 403 }
    );
  }

  const requestData = await req.json();
  const {
    title,
    content,
    attachments,
    deleteAttachmentIndexes,
    company,
    jobCategory,
    tags,
  } = requestData;

  if (!title || !content || title.trim() === "" || content.trim() === "") {
    return NextResponse.json(
      { error: "제목과 내용을 입력해 주세요." },
      { status: 400 }
    );
  }

  // 1. 게시글 정보 수정
  const updatedPost = await prisma.post.update({
    where: { postId: numericPostId },
    data: {
      title,
      content,
      company: company || null,
      jobCategory: jobCategory || null,
      tags: tags && tags.length > 0 ? tags.join(",") : null,
    },
  });

  // 2. 삭제할 첨부파일이 있는 경우, 인덱스로 처리
  if (
    Array.isArray(deleteAttachmentIndexes) &&
    deleteAttachmentIndexes.length > 0
  ) {
    const attachmentsToDelete = deleteAttachmentIndexes
      .map((index: number) => post.attachments[index])
      .filter(Boolean); // 존재하는 첨부파일만

    const idsToDelete = attachmentsToDelete.map((a) => a.attachmentId);

    if (idsToDelete.length > 0) {
      await prisma.attachment.deleteMany({
        where: { attachmentId: { in: idsToDelete } },
      });
    }
  }

  // 3. 새 첨부파일 추가
  if (attachments && attachments.length > 0) {
    for (const file of attachments as Attachment[]) {
      const base64Data = file.data.split(",")[1] || file.data;
      const fileBuffer = Buffer.from(base64Data, "base64");

      await prisma.attachment.create({
        data: {
          postId: numericPostId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileData: fileBuffer,
        },
      });
    }
  }

  return NextResponse.json({
    message: "게시글이 성공적으로 수정되었습니다.",
    post: updatedPost,
    deletedCount: deleteAttachmentIndexes?.length || 0,
    addedCount: attachments?.length || 0,
  });
}

// DELETE: 게시글 삭제 (soft delete)
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
      { error: '게시글이 없거나 권한이 없습니다.' },
      { status: 403 }
    );
  }

  await prisma.post.update({
    where: { postId: numericPostId },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true, deletedPostId: numericPostId });
}
