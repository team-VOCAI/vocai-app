import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params; 

  const post = await prisma.post.findUnique({
    where: { postId: Number(postId) },
    include: { profile: true, board: true },
  });

  if (!post || post.deletedAt) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  
  await prisma.post.update({
    where: { postId: Number(postId) },
    data: { view: post.view + 1 },
  });

  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params; 

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
  const { postId } = await context.params; 

  const deleted = await prisma.post.update({
    where: { postId: Number(postId) },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true, deletedPostId: deleted.postId });
}
