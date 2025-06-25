// src/app/api/comments/[commentId]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await context.params;

  const comment = await prisma.comment.findUnique({
    where: { commentId: Number(commentId) },
    include: { profile: true, post: true },
  });

  if (!comment || comment.deletedAt) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(comment);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await context.params;
  const { content } = await req.json();

  const updated = await prisma.comment.update({
    where: { commentId: Number(commentId) },
    data: { content },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await context.params;

  const deleted = await prisma.comment.update({
    where: { commentId: Number(commentId) },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({
    success: true,
    deletedCommentId: deleted.commentId,
  });
}
