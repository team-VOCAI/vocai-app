import { genAI } from "@/lib/gemini";

export async function generateSessionSummary(persona: any, records: { question: string; answerText: string | null }[]) {
  const history = records
    .map((r, i) => `질문 ${i + 1}: ${r.question}\n답변: ${r.answerText ?? ""}`)
    .join("\n\n");

  const prompt = `아래는 면접 세션 기록입니다. 지원자의 페르소나는 다음과 같습니다:\n${JSON.stringify(persona)}\n\n면접 기록:\n${history}\n\n면접 전체에 대한 종합 요약과 피드백을 한국어로 작성해주세요.\n\n요약:(요약 내용)\n\n피드백:(피드백 내용)`;

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text = result.text || "";

  const summaryMatch = text.match(/(?:- )?(?:\\*\\*)?요약:(?:\\*\\*)?\s*\n?([\s\S]*?)\n+(?:- )?(?:\\*\\*)?피드백:(?:\\*\\*)?/i);
  const feedbackMatch = text.match(/(?:- )?(?:\\*\\*)?피드백:(?:\\*\\*)?\s*\n?([\s\S]*)/i);

  const summary = summaryMatch?.[1]?.trim() || "요약을 찾을 수 없습니다.";
  const feedback = feedbackMatch?.[1]?.trim() || "피드백을 찾을 수 없습니다.";

  return { summary, feedback };
}
