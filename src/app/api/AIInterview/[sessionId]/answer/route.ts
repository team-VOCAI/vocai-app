import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateFeedback } from "@/lib/interview/generateFeedback";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;
    const numSessionId = Number(sessionId);
    const { answerText } = await req.json();

    if (!answerText || isNaN(numSessionId)) {
      return NextResponse.json({ error: "입력값 오류" }, { status: 400 });
    }

    // 가장 최근 unanswered 질문 찾기
    const record = await prisma.mockInterviewRecord.findFirst({
      where: { sessionId: numSessionId, answerText: null },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { error: "답변할 질문이 없습니다." },
        { status: 404 }
      );
    }

    const { summary, feedback } = await generateFeedback(
      record.question,
      answerText
    );

    const updated = await prisma.mockInterviewRecord.update({
      where: { interviewId: record.interviewId },
      data: {
        answerText,
        summary,
        feedback,
      },
    });

    return NextResponse.json({ summary, feedback, record: updated });
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
