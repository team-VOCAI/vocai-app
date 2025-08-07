// src/app/api/AIInterview/[sessionId]/record/route.ts
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";

async function transcribeAudio(file: Blob): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "audio/webm",
              data: base64,
            },
          },
          { text: "위 음성을 한국어 텍스트로 전사해줘." },
        ],
      },
    ],
  });

  const text = result.text;
  if (!text) throw new Error("Transcription failed");

  return text.trim();
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

    // 이제 텍스트로 answer API를 호출함
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/AIInterview/${sessionId}/answer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answerText: text }),
      }
    );

    const data = await res.json();

    return NextResponse.json(
      { ...data, transcribedText: text },
      { status: res.status }
    );
  } catch (error: unknown) {
    console.error("record 에러:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
