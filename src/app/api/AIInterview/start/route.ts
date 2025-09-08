import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileFromRequest } from "@/lib/getProfile";
import { generateQuestion } from "@/lib/interview/generateQuestion";

export async function POST(req: NextRequest) {
  try {
    const profile = await getProfileFromRequest(req);

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!profile.persona) {
      return NextResponse.json(
        { error: "페르소나가 설정되지 않았습니다." },
        { status: 400 }
      );
    }

    const session = await prisma.mockInterviewSession.create({
      data: {
        profileId: profile.profileId,
        persona: profile.persona,
      },
    });

    // 기본 세션 제목 설정 (예: "세션1")
    await prisma.mockInterviewSession.update({
      where: { sessionId: session.sessionId },
      data: { title: `세션${session.sessionId}` },
    });

    const question = await generateQuestion(session.sessionId);

    // 첫 질문 저장 (answerText는 null)
    await prisma.mockInterviewRecord.create({
      data: {
        sessionId: session.sessionId,
        question,
      },
    });
    
    return NextResponse.json(
      { sessionId: session.sessionId, question },
      { status: 201 }
    );

  } catch (error) {
    console.error("세션 생성 오류:", error);
    return NextResponse.json(
      { error: "서버 오류로 세션을 생성할 수 없습니다." },
      { status: 500 }
    );
  }
}
