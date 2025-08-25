import { prisma } from "@/lib/prisma";
import { genAI } from "@/lib/gemini";

const candidates = [
  "지원 동기는 무엇인가요?",
  "본인의 강점과 약점은 무엇인가요?",
  "최근 도전 과제와 해결 방법은 무엇인가요?",
];

export async function generateSecondQuestion(sessionId: number): Promise<string> {
  const firstRecord = await prisma.mockInterviewRecord.findFirst({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });
  const answer = firstRecord?.answerText ?? "";

  const prompt = `지원자의 자기소개 답변:\n"""${answer}"""\n\n위 답변을 참고하여 아래 후보 질문 중 아직 답하지 않은 주제를 하나 선택해 주세요.\n후보 질문 목록:\n${candidates
    .map((q, i) => `${i + 1}. ${q}`)
    .join("\n")}\n답변으로 이미 다룬 주제는 피하고, 질문 문장만 한국어로 출력하세요.`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const text = result.text?.trim();
    if (text) return text;
  } catch (e) {
    console.error("generateSecondQuestion error", e);
  }
  return candidates[0];
}
