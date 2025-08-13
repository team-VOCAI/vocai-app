// src/app/interview/page.tsx
"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState, useEffect, ChangeEvent } from "react";

interface PersonaForm {
  company: string;
  job: string;
  careerLevel: string;
  difficulty: "쉬움" | "중간" | "어려움";
  techStack: string;
}

export default function InterviewHomePage() {
  const [persona, setPersona] = useState<PersonaForm>({
    company: "",
    job: "",
    careerLevel: "",
    difficulty: "쉬움",
    techStack: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/persona");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setPersona({
            company: data.company ?? "",
            job: data.job ?? "",
            careerLevel: data.careerLevel ?? "",
            difficulty: data.difficulty ?? "쉬움",
            techStack: (data.techStack ?? []).join(", "),
          });
        }
      }
    };
    load();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersona((prev) => ({ ...prev, [name]: value }));
  };

  const savePersona = async () => {
    setSaving(true);
    await fetch("/api/persona", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: persona.company,
        job: persona.job,
        careerLevel: persona.careerLevel,
        difficulty: persona.difficulty,
        techStack: persona.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">면접 준비</h1>

        <div className="mb-10 bg-white p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">면접 페르소나 설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="company"
              value={persona.company}
              onChange={handleChange}
              placeholder="회사"
              className="border p-2 rounded"
            />
            <input
              name="job"
              value={persona.job}
              onChange={handleChange}
              placeholder="직무"
              className="border p-2 rounded"
            />
            <input
              name="careerLevel"
              value={persona.careerLevel}
              onChange={handleChange}
              placeholder="경력 수준"
              className="border p-2 rounded"
            />
            <select
              name="difficulty"
              value={persona.difficulty}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="쉬움">쉬움</option>
              <option value="중간">중간</option>
              <option value="어려움">어려움</option>
            </select>
            <input
              name="techStack"
              value={persona.techStack}
              onChange={handleChange}
              placeholder="기술 스택 (콤마로 구분)"
              className="border p-2 rounded md:col-span-2"
            />
          </div>
          <button
            onClick={savePersona}
            disabled={saving}
            className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-lg disabled:opacity-50"
          >
            저장
          </button>
        </div>

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
