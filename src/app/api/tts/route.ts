import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing TTS API key" }, { status: 500 });
    }
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
    const ttsRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );
    if (!ttsRes.ok) {
      const errorText = await ttsRes.text();
      console.error("TTS request failed", errorText);
      return NextResponse.json({ error: "TTS request failed" }, { status: 500 });
    }
    const audioBuffer = await ttsRes.arrayBuffer();
    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("TTS route error", error);
    return NextResponse.json({ error: "TTS route error" }, { status: 500 });
  }
}
