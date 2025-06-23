// src/app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const postId = Number(req.nextUrl.searchParams.get("postId"));

  if (isNaN(postId)) {
    return NextResponse.json(
      { message: "postId가 필요합니다." },
      { status: 400 }
    );
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: { profile: true },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const { postId, content } = await req.json();

  const profile = await prisma.profile.findFirst(); // 테스트용 임시 사용자

  if (!profile) {
    return NextResponse.json({ message: "사용자 없음" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      profileId: profile.profileId,
      nickName: profile.nickName,
      content,
    },
    include: { profile: true },
  });

  return NextResponse.json(comment, { status: 201 });
}
