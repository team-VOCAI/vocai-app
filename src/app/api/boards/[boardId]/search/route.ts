import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await context.params;
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword")?.trim() || "";

  if (!keyword) {
    return NextResponse.json({ posts: [] });
  }

  const posts = await prisma.post.findMany({
    where: {
      boardId: Number(boardId),
      deletedAt: null,
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ posts });
}
