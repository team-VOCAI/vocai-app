// src/app/interview/page.tsx
"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState, useEffect, ChangeEvent } from "react";

interface PersonaForm {
  company: string[];
  job: string[];
  careerLevel: string;
  difficulty: "쉬움" | "중간" | "어려움";
  techStack: string[];
}

export default function InterviewHomePage() {
  const [persona, setPersona] = useState<PersonaForm>({
    company: [],
    job: [],
    careerLevel: "",
    difficulty: "쉬움",
    techStack: [],
  });
  const [companyInput, setCompanyInput] = useState("");
  const [jobInput, setJobInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasPersona, setHasPersona] = useState(false);
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/persona");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setPersona({
            company: Array.isArray(data.company) ? data.company : [],
            job: Array.isArray(data.job) ? data.job : [],
            careerLevel: data.careerLevel ?? "",
            difficulty: data.difficulty ?? "쉬움",
            techStack: Array.isArray(data.techStack) ? data.techStack : [],
          });
          setHasPersona(true);
          setEditing(false);
        } else {
          setEditing(true);
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

  const addCompany = () => {
    const c = companyInput.trim();
    if (c && !persona.company.includes(c)) {
      setPersona((prev) => ({ ...prev, company: [...prev.company, c] }));
    }
    setCompanyInput("");
  };

  const removeCompany = (c: string) => {
    setPersona((prev) => ({ ...prev, company: prev.company.filter((v) => v !== c) }));
  };

  const addJob = () => {
    const j = jobInput.trim();
    if (j && !persona.job.includes(j)) {
      setPersona((prev) => ({ ...prev, job: [...prev.job, j] }));
    }
    setJobInput("");
  };

  const removeJob = (j: string) => {
    setPersona((prev) => ({ ...prev, job: prev.job.filter((v) => v !== j) }));
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !persona.techStack.includes(t)) {
      setPersona((prev) => ({ ...prev, techStack: [...prev.techStack, t] }));
    }
    setTechInput("");
  };

  const removeTech = (t: string) => {
    setPersona((prev) => ({ ...prev, techStack: prev.techStack.filter((v) => v !== t) }));
  };

  const savePersona = async () => {
    setSaving(true);
    await fetch("/api/persona", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(persona),
    });
    setSaving(false);
    setHasPersona(true);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">면접 준비</h1>

        <div className="mb-10 bg-white p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">면접 페르소나 설정</h2>
          {editing ? (
            <>
              <div className="space-y-4">
                <div>
                  <div className="flex gap-2">
                    <input
                      value={companyInput}
                      onChange={(e) => setCompanyInput(e.target.value)}
                      placeholder="회사"
                      className="border p-2 rounded flex-1"
                    />
                    <button
                      type="button"
                      onClick={addCompany}
                      className="px-3 py-2 border rounded"
                    >
                      추가
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {persona.company.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-1 bg-gray-200 rounded-full flex items-center"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() => removeCompany(c)}
                          className="ml-1 text-sm"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex gap-2">
                    <input
                      value={jobInput}
                      onChange={(e) => setJobInput(e.target.value)}
                      placeholder="직무"
                      className="border p-2 rounded flex-1"
                    />
                    <button
                      type="button"
                      onClick={addJob}
                      className="px-3 py-2 border rounded"
                    >
                      추가
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {persona.job.map((j) => (
                      <span
                        key={j}
                        className="px-2 py-1 bg-gray-200 rounded-full flex items-center"
                      >
                        {j}
                        <button
                          type="button"
                          onClick={() => removeJob(j)}
                          className="ml-1 text-sm"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <input
                  name="careerLevel"
                  value={persona.careerLevel}
                  onChange={handleChange}
                  placeholder="경력 수준"
                  className="border p-2 rounded w-full"
                />
                <select
                  name="difficulty"
                  value={persona.difficulty}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="쉬움">쉬움</option>
                  <option value="중간">중간</option>
                  <option value="어려움">어려움</option>
                </select>
                <div>
                  <div className="flex gap-2">
                    <input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="기술 스택"
                      className="border p-2 rounded flex-1"
                    />
                    <button
                      type="button"
                      onClick={addTech}
                      className="px-3 py-2 border rounded"
                    >
                      추가
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {persona.techStack.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 bg-gray-200 rounded-full flex items-center"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTech(t)}
                          className="ml-1 text-sm"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={savePersona}
                  disabled={saving}
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg disabled:opacity-50"
                >
                  저장
                </button>
                {hasPersona && (
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    취소
                  </button>
                )}
              </div>
            </>
          ) : hasPersona ? (
            <>
              <div className="space-y-2">
                <p><strong>회사:</strong> {persona.company.join(', ')}</p>
                <p><strong>직무:</strong> {persona.job.join(', ')}</p>
                <p><strong>경력 수준:</strong> {persona.careerLevel}</p>
                <p><strong>난이도:</strong> {persona.difficulty}</p>
                <p><strong>기술 스택:</strong> {persona.techStack.join(', ')}</p>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="mt-4 px-4 py-2 border rounded-lg"
              >
                수정
              </button>
            </>
          ) : (
            <p className="text-gray-500">저장된 페르소나가 없습니다. 설정해 주세요.</p>
          )}
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
