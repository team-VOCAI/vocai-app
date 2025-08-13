// src/app/interview/page.tsx
"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function InterviewHomePage() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <h1 className="text-2xl font-bold mb-6">면접 준비</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* AI 면접 */}
          <Link href="/interview/ai">
            <div className="border rounded-2xl p-6 hover:shadow-md transition cursor-pointer bg-white">
              <h2 className="text-xl font-semibold mb-2">AI 면접 시작하기</h2>
              <p className="text-gray-600">AI가 면접관이 되어 질문을 던지고 피드백을 제공합니다.</p>
            </div>
          </Link>

          {/* 화상 면접 - 비활성화 */}
          <div className="border rounded-2xl p-6 bg-gray-100 text-gray-400 cursor-not-allowed">
            <h2 className="text-xl font-semibold mb-2">사람과 화상 면접</h2>
            <p className="text-gray-500">곧 제공될 예정입니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
