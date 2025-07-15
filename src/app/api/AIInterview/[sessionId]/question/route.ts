import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQuestion } from "@/lib/interview/generateQuestion";

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

    const question = await generateQuestion(numSessionId);

    const record = await prisma.mockInterviewRecord.create({
      data: {
        sessionId: numSessionId,
        question,
        answerText: null,
        summary: null,
        feedback: null,
      },
    });

    return NextResponse.json({ question, recordId: record.interviewId });
  } catch (error: any) {
    console.error("question API 오류:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
