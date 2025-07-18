import { NextRequest, NextResponse } from "next/server";
import { getProfileFromRequest } from "@/lib/getProfile";
import { generateQuestion } from "@/lib/interview/generateQuestion";
import { generateFeedback } from "@/lib/interview/generateFeedback";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const profile = await getProfileFromRequest(req);

    if (!profile) {
      return NextResponse.json(
        { error: "profile이 없습니다." },
        { status: 400 }
      );
    }

    const { answerText } = await req.json();
    const { sessionId } = await context.params;
    const numSessionId = Number(sessionId);

    if (isNaN(numSessionId)) {
      return NextResponse.json(
        { error: "올바른 sessionId가 필요합니다." },
        { status: 400 }
      );
    }

    const session = await prisma.mockInterviewSession.findUnique({
      where: { sessionId: numSessionId },
    });

    if (!session || session.profileId !== profile.profileId) {
      return NextResponse.json(
        { error: "세션이 없거나 권한이 없습니다." },
        { status: 403 }
      );
    }

    if (!answerText) {
      const question = await generateQuestion(numSessionId);
      if (!question) {
        return NextResponse.json({ error: "질문 생성 실패" }, { status: 500 });
      }
      return NextResponse.json({ question }, { status: 200 });
    }

    const question = await generateQuestion(numSessionId);
    if (!question) {
      return NextResponse.json({ error: "질문 생성 실패" }, { status: 500 });
    }

    const { summary, feedback } = await generateFeedback(question, answerText);

    const record = await prisma.mockInterviewRecord.create({
      data: {
        sessionId: numSessionId,
        question,
        answerText,
        summary,
        feedback,
      },
    });

    return NextResponse.json(
      { question, summary, feedback, record },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("세션 종료 오류:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
