import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const { postId } = await context.params;

  if (!postId || isNaN(Number(postId))) {
    return NextResponse.json({ message: "Invalid postId" }, { status: 400 });
  }

  await prisma.post.update({
    where: { postId: Number(postId) },
    data: { view: { increment: 1 } },
  });

  return NextResponse.json({ message: "View incremented" });
}
