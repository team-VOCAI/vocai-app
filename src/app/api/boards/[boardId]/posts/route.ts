import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await context.params;
  const numBoardId = Number(boardId);
  if (isNaN(numBoardId)) {
    return NextResponse.json(
      { message: "boardId가 필요합니다" },
      { status: 400 }
    );
  }

  const posts = await prisma.post.findMany({
    where: {
      boardId: numBoardId,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
    include: { profile: true, board: true },
  });

  return NextResponse.json({ posts });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ boardId: string }> }
) {
  const { title, content } = await req.json();
  const { boardId } = await context.params;
  const numBoardId = Number(boardId);

  const profile = await prisma.profile.findFirst(); // 테스트용 임시 사용자 나중에 JWT에서 추출
  const board = await prisma.board.findUnique({
    where: { boardId: numBoardId },
  });

  if (!profile || !board) {
    return NextResponse.json(
      { message: "profile 또는 board가 존재하지 않습니다." },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      boardId: numBoardId,
      profileId: profile.profileId,
      nickName: profile.nickName,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
