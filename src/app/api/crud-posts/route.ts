// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // 게시글 목록 반환
  return NextResponse.json([{ id: 1, title: "Hello" }]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // 게시글 저장 로직
  return NextResponse.json({ success: true });
}
