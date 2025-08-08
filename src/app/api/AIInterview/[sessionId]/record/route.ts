// src/app/api/AIInterview/[sessionId]/record/route.ts
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

async function transcribeAudio(file: Blob): Promise<string> {
  const fd = new FormData();
  fd.append("file", file, "audio.webm");

  const url =
    process.env.WHISPER_URL ?? "http://localhost:8000/transcribe";
  const res = await fetch(url, { method: "POST", body: fd });

  if (!res.ok) {
    throw new Error("Transcription failed");
  }

  const data = (await res.json()) as { text?: string };
  if (!data.text) {
    throw new Error("Transcription failed");
  }

  return data.text.trim();
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;
    const formData = await req.formData();
    const audio = formData.get("file") as Blob | null;

    if (!audio) {
      return NextResponse.json(
        { error: "audio 파일이 필요합니다." },
        { status: 400 }
      );
    }

    const text = await transcribeAudio(audio);

    // 답변 저장 후 다음 질문 생성
    const answerRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/AIInterview/${sessionId}/answer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answerText: text }),
      }
    );

    if (!answerRes.ok) {
      const err = await answerRes.json();
      return NextResponse.json(err, { status: answerRes.status });
    }

    const questionRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/AIInterview/${sessionId}/question`,
      { method: "POST" }
    );

    if (!questionRes.ok) {
      const err = await questionRes.json();
      return NextResponse.json(err, { status: questionRes.status });
    }

    const answerData = await answerRes.json();
    const questionData = await questionRes.json();

    return NextResponse.json(
      { ...answerData, question: questionData.question, transcribedText: text },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("record 에러:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
