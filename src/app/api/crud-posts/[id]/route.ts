import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { postId: Number(params.id) },
    include: { profile: true, board: true },
  });

  if (!post || post.deletedAt) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { title, content } = await req.json();

  const updated = await prisma.post.update({
    where: { postId: Number(params.id) },
    data: { title, content },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = await prisma.post.update({
    where: { postId: Number(params.id) },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true, deletedPostId: deleted.postId });
}
