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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("file") as Blob | null;

    if (!audio) {
      return NextResponse.json(
        { error: "audio 파일이 필요합니다." },
        { status: 400 }
      );
    }

    const text = await transcribeAudio(audio);

    // 전사된 텍스트만 반환하고 답변 저장과 다음 질문 생성은 클라이언트에서 처리
    return NextResponse.json({ transcribedText: text }, { status: 200 });
  } catch (error: unknown) {
    console.error("record 에러:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
