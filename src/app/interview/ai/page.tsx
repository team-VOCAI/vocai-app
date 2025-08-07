"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Recorder from "@/components/interview/Recorder";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function AIInterviewPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/AIInterview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: "기본 면접관" }),
      });
      const data = await res.json();
      if (res.ok) {
        setSessionId(data.sessionId);
        setMessages([{ role: "assistant", content: data.question }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAudioComplete = async (audio: Blob) => {
    if (!sessionId) return;
    const form = new FormData();
    form.append("file", audio, "audio.webm");
    const res = await fetch(`/api/AIInterview/${sessionId}/record`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (res.ok) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: data.transcribedText },
        { role: "assistant", content: data.question },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <button
                  onClick={startSession}
                  disabled={loading}
                  className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg shadow-md hover:bg-[var(--primary-hover)] disabled:opacity-50"
                >
                  {loading ? "시작중..." : "새 면접 시작하기"}
                </button>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] shadow ${
                      m.role === "user"
                        ? "bg-[var(--primary)] text-white"
                        : "bg-white border"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}
          </div>
          {sessionId && (
            <div className="p-4 border-t bg-white flex justify-center">
              <Recorder onComplete={handleAudioComplete} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

