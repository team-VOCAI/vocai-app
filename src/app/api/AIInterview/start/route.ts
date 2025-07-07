import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileFromRequest } from "@/lib/getProfile";
import { generateQuestion } from "@/lib/interview/generateQuestion";

export async function POST(req: NextRequest) {
  try {
    // const profile = await getProfileFromRequest(req);

    // if (!profile) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    const profile = { profileId: 1 };
    const { persona } = await req.json();

    if (!persona) {
      return NextResponse.json(
        { error: "persona는 필수입니다." },
        { status: 400 }
      );
    }

    const session = await prisma.mockInterviewSession.create({
      data: {
        profileId: profile.profileId,
        persona,
      },
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
