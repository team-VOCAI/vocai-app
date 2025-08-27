import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQuestion } from "@/lib/interview/generateQuestion";
import { generateSecondQuestion } from "@/lib/interview/generateSecondQuestion";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;
    const numSessionId = Number(sessionId);

    if (isNaN(numSessionId)) {
      return NextResponse.json({ error: "sessionId 오류" }, { status: 400 });
    }

    // 이미 생성되어 답변이 없는 질문이 있는지 확인
    let record = await prisma.mockInterviewRecord.findFirst({
      where: { sessionId: numSessionId, answerText: null },
      orderBy: { createdAt: "asc" },
    });

    // 없다면 새 질문 생성
    if (!record) {
      const answeredCount = await prisma.mockInterviewRecord.count({
        where: { sessionId: numSessionId, answerText: { not: null } },
      });

      const question =
        answeredCount === 1
          ? await generateSecondQuestion(numSessionId)
          : await generateQuestion(numSessionId);

      record = await prisma.mockInterviewRecord.create({
        data: {
          sessionId: numSessionId,
          question,
          answerText: null,
          summary: null,
          feedback: null,
        },
      });
    }

    // 다음 질문을 미리 생성하여 저장
    (async () => {
      try {
        const next = await generateQuestion(numSessionId);
        await prisma.mockInterviewRecord.create({
          data: {
            sessionId: numSessionId,
            question: next,
            answerText: null,
            summary: null,
            feedback: null,
          },
        });
      } catch (e) {
        console.error("pre-generate question error", e);
      }
    })();

    return NextResponse.json({
      question: record.question,
      recordId: record.interviewId,
    });
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
