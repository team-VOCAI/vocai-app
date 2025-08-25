import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQuestion } from "@/lib/interview/generateQuestion";
import { generateSecondQuestion } from "@/lib/interview/generateSecondQuestion";
import {
  getCachedQuestion,
  setCachedQuestion,
  clearCachedQuestion,
} from "@/lib/interview/questionCache";

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

    // 캐시에 미리 생성된 질문이 있는지 확인
    let question = getCachedQuestion(numSessionId);
    if (question) {
      clearCachedQuestion(numSessionId);
    } else {
      // 답변이 완료된 기록 수 확인
      const answeredCount = await prisma.mockInterviewRecord.count({
        where: { sessionId: numSessionId, answerText: { not: null } },
      });

      if (answeredCount === 1) {
        // 두 번째 질문은 사전 정의된 후보 중 선택
        question = await generateSecondQuestion(numSessionId);
      } else {
        question = await generateQuestion(numSessionId);
      }
    }

    const record = await prisma.mockInterviewRecord.create({
      data: {
        sessionId: numSessionId,
        question,
        answerText: null,
        summary: null,
        feedback: null,
      },
    });

    // 다음 질문을 미리 생성하여 캐시에 저장
    (async () => {
      try {
        const next = await generateQuestion(numSessionId);
        setCachedQuestion(numSessionId, next);
      } catch (e) {
        console.error("pre-generate question error", e);
      }
    })();

    return NextResponse.json({ question, recordId: record.interviewId });
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
