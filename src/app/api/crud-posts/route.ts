import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { profile: true, board: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();

  // 임시값 - 나중에 로그인 사용자에서 추출
  const profileId = 1;
  const boardId = 1;
  const nickName = "테스트닉";

  const post = await prisma.post.create({
    data: {
      profileId,
      boardId,
      nickName,
      title,
      content,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
