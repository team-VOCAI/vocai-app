"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Recorder from "@/components/interview/Recorder";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface Session {
  sessionId: number;
  createdAt: string;
}

export default function AIInterviewPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchSessions = async () => {
    const res = await fetch("/api/AIInterview");
    if (res.ok) {
      const data = await res.json();
      setSessions(data);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

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
        fetchSessions();
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
        <aside className="w-64 border-r bg-white flex flex-col">
          <div className="p-4">
            <button
              onClick={startSession}
              disabled={loading}
              className="w-full px-4 py-2 bg-[var(--primary)] text-white rounded-lg shadow hover:bg-[var(--primary-hover)] disabled:opacity-50"
            >
              {loading ? "시작중..." : "새 면접 시작하기"}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {sessions.length === 0 ? (
              <p className="text-sm text-gray-500">면접 기록이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {sessions.map((s) => (
                  <li key={s.sessionId} className="text-sm text-gray-700 truncate">
                    세션 {s.sessionId}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
        <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                좌측에서 새 면접을 시작하세요.
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