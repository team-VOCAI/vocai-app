import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSessionSummary } from "@/lib/interview/generateSessionSummary";
import { getProfileFromRequest } from "@/lib/getProfile";

export async function POST(req: NextRequest) {
  try {
    const profile = await getProfileFromRequest(req);
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();

    const numSessionId = Number(sessionId);
    if (!sessionId || isNaN(numSessionId)) {
      return NextResponse.json(
        { error: "올바른 sessionId가 필요합니다." },
        { status: 400 }
      );
    }

    const session = await prisma.mockInterviewSession.findUnique({
      where: { sessionId: numSessionId },
      include: { records: true },
    });

    if (!session || session.profileId !== profile.profileId) {
      return NextResponse.json(
        { error: "세션이 없거나 권한이 없습니다." },
        { status: 403 }
      );
    }

    const { summary, feedback } = await generateSessionSummary(
      session.persona,
      session.records
    );

    await prisma.mockInterviewSession.update({
      where: { sessionId: numSessionId },
      data: { summary, feedback },
    });

    return NextResponse.json({ summary, feedback });
  } catch (error: any) {
    console.error("세션 종료 오류:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
