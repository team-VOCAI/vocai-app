// src/app/api/AIInterview/[sessionId]/record/route.ts
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

async function transcribeAudio(file: Blob): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ElevenLabs API key");
  }

  const form = new FormData();
  form.append("file", file, "audio.webm");

  const sttRes = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
    },
    body: form,
  });

  if (!sttRes.ok) {
    const errorText = await sttRes.text();
    console.error("STT request failed", errorText);
    throw new Error("Transcription request failed");
  }

  const data = await sttRes.json();
  const text = data.text as string | undefined;
  if (!text) throw new Error("Transcription failed");

  return text.trim();
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
