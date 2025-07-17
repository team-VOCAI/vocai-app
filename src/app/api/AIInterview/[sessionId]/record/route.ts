import { NextRequest, NextResponse } from "next/server";
import { POST as answerPost } from "../answer/route";
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

    const answerReq = new NextRequest("http://internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answerText: text }),
    });

    const res = await answerPost(answerReq, {
      params: Promise.resolve({ sessionId }),
    });
    const data = await res.json();

    return NextResponse.json(
      { ...data, transcribedText: text },
      { status: res.status }
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
