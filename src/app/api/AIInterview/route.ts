import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileFromRequest } from "@/lib/getProfile";

export async function GET(req: NextRequest) {
  try {
    const profile = await getProfileFromRequest(req);
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.mockInterviewSession.findMany({
      where: { profileId: profile.profileId },
      select: { sessionId: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("세션 목록 조회 오류:", error);
    return NextResponse.json(
      { error: "세션 목록을 가져오지 못했습니다." },
      { status: 500 }
    );
  }
}
