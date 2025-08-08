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

interface RecordItem {
  question: string;
  answerText?: string | null;
  summary?: string | null;
  feedback?: string | null;
}

export default function AIInterviewPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);
  const [sessionFeedback, setSessionFeedback] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [ending, setEnding] = useState(false);
  const [ended, setEnded] = useState(false);
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
      setStarting(true);
      const res = await fetch("/api/AIInterview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: "기본 면접관" }),
      });
      const data = await res.json();
      if (res.ok) {
        setSessionId(data.sessionId);
        setMessages([{ role: "assistant", content: data.question }]);
        setRecords([{ question: data.question }]);
        setEnded(false);
        setSessionSummary(null);
        setSessionFeedback(null);
        fetchSessions();
      }
    } finally {
      setStarting(false);
    }
  };

  const loadSession = async (id: number) => {
    const res = await fetch(`/api/AIInterview/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data.ended) {
        setRecords(data.records.filter((r: RecordItem) => r.answerText));
        setMessages([]);
      } else {
        setRecords(data.records);
        const msgs: Message[] = [];
        data.records.forEach((r: RecordItem) => {
          msgs.push({ role: "assistant", content: r.question });
          if (r.answerText) msgs.push({ role: "user", content: r.answerText });
        });
        setMessages(msgs);
      }
      setSessionId(id);
      setEnded(data.ended);
      setSessionSummary(data.summary ?? null);
      setSessionFeedback(data.feedback ?? null);
    }
  };

  const endSession = async () => {
    if (!sessionId) return;
    try {
      setEnding(true);
      const res = await fetch("/api/AIInterview/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnded(true);
        setSessionSummary(data.summary);
        setSessionFeedback(data.feedback);
        setRecords((prev) => prev.filter((r) => r.answerText));
        setMessages([]);
        fetchSessions();
      }
    } finally {
      setEnding(false);
    }
  };

  const handleAudioComplete = async (audio: Blob) => {
    if (!sessionId || ended) return;
    const form = new FormData();
    form.append("file", audio, "audio.webm");
    setProcessing(true);
    try {
      const res = await fetch(`/api/AIInterview/${sessionId}/record`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        setRecords((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (lastIndex >= 0) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              answerText: data.transcribedText,
              summary: data.summary,
              feedback: data.feedback,
            };
          }
          updated.push({ question: data.question });
          return updated;
        });
        setMessages((prev) => [
          ...prev,
          { role: "user", content: data.transcribedText },
          { role: "assistant", content: data.question },
        ]);
      }
    } finally {
      setProcessing(false);
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
              disabled={starting}
              className="w-full px-4 py-2 bg-[var(--primary)] text-white rounded-lg shadow hover:bg-[var(--primary-hover)] disabled:opacity-50"
            >
              {starting ? "시작중..." : "새 면접 시작하기"}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {sessions.length === 0 ? (
              <p className="text-sm text-gray-500">면접 기록이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {sessions.map((s) => (
                  <li key={s.sessionId}>
                    <button
                      onClick={() => loadSession(s.sessionId)}
                      className={`w-full text-left text-sm truncate px-2 py-1 rounded hover:bg-gray-100 ${
                        s.sessionId === sessionId ? "bg-gray-200" : "text-gray-700"
                      }`}
                    >
                      세션 {s.sessionId}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
        <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full">
          <div className="flex-1 overflow-y-auto p-4">
            {!sessionId ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                좌측에서 새 면접을 시작하세요.
              </div>
            ) : ended ? (
              <>
                {records.map((r, i) => (
                  <div key={i} className="mb-6">
                    <div className="mb-2 flex justify-start">
                      <div className="px-4 py-2 rounded-2xl max-w-[75%] shadow bg-white border">
                        {r.question}
                      </div>
                    </div>
                    {r.answerText && (
                      <div className="mb-2 flex justify-end">
                        <div className="px-4 py-2 rounded-2xl max-w-[75%] shadow bg-[var(--primary)] text-white">
                          {r.answerText}
                        </div>
                      </div>
                    )}
                    {r.summary && r.feedback && (
                      <div className="ml-4 mt-2 text-sm text-gray-700">
                        <p className="font-semibold">요약</p>
                        <p>{r.summary}</p>
                        <p className="font-semibold mt-2">피드백</p>
                        <p>{r.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
                {sessionSummary && sessionFeedback && (
                  <div className="mt-8 p-4 rounded-2xl bg-white border">
                    <h3 className="font-semibold mb-2">세션 요약</h3>
                    <p className="mb-4">{sessionSummary}</p>
                    <h3 className="font-semibold mb-2">세션 피드백</h3>
                    <p>{sessionFeedback}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {messages.map((m, i) => (
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
                ))}
                {processing && (
                  <div className="mb-4 flex justify-start">
                    <div className="px-4 py-2 rounded-2xl max-w-[75%] shadow bg-white border text-gray-500">
                      응답을 생성 중...
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {sessionId && !ended && (
            <div className="p-4 border-t bg-white flex flex-col items-center">
              <Recorder onComplete={handleAudioComplete} />
              <button
                onClick={endSession}
                disabled={ending}
                className="mt-2 text-sm text-gray-600 underline disabled:opacity-50"
              >
                {ending ? "종료중..." : "세션 종료"}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                마이크 버튼을 눌러 녹음을 시작하고 다시 눌러 종료하세요.
              </p>
              {processing && (
                <p className="mt-1 text-xs text-gray-500">응답을 처리 중입니다...</p>
              )}
            </div>
          )}
          {sessionId && ended && (
            <div className="p-4 border-t bg-white text-center text-gray-500">
              세션이 종료되었습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
