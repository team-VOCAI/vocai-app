import { genAI } from "@/lib/gemini";

// Persona 타입 정의
export type Persona = {
  company: string[];
  job: string[];
  careerLevel: string;
  difficulty: "쉬움" | "중간" | "어려움";
  techStack: string[];
};

export async function generateSessionSummary(
  persona: Persona,
  records: { question: string; answerText: string | null }[]
) {
  const history = records
    .map((r, i) => `질문 ${i + 1}: ${r.question}\n답변: ${r.answerText ?? ""}`)
    .join("\n\n");

  const prompt = `
  아래는 면접 세션 기록입니다. 지원자의 페르소나는 다음과 같습니다:
  ${JSON.stringify(persona)}

  면접 기록:
  ${history}

  면접 전체에 대한 종합 요약과 피드백을 아래와 같은 **형식**으로 한국어로 작성해주세요. **반드시 형식을 지켜주세요.**

  형식:
  ---
  요약:
  [요약 내용을 여기에 작성하세요. 한 문단 이상.]

  피드백:
  [피드백 내용을 여기에 작성하세요. 구체적인 조언을 포함해주세요.]
  ---
  `;
  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text = result.text || "";

  const summaryMatch = text.match(/요약:\s*\n?([\s\S]*?)\n+피드백:/i);
  const feedbackMatch = text.match(/피드백:\s*\n?([\s\S]*)/i);

  const summary = summaryMatch?.[1]?.trim() || "요약을 찾을 수 없습니다.";
  const feedback = feedbackMatch?.[1]?.trim() || "피드백을 찾을 수 없습니다.";

  return { summary, feedback };
}
