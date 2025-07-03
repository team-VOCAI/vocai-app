import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileFromRequest } from "@/lib/getProfile";


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
  const profile = await getProfileFromRequest(req);

  if (!profile) {
    return NextResponse.json(
      { message: "인증되지 않았거나 프로필을 찾을 수 없습니다." },
      { status: 401 }
    );
  }

  const { title, content } = await req.json();
  const { boardId } = await context.params;
  const numBoardId = Number(boardId);

  const board = await prisma.board.findUnique({
    where: { boardId: numBoardId },
  });

  if (!board) {
    return NextResponse.json(
      { message: "게시판이 존재하지 않습니다." },
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