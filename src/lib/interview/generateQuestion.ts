// src/lib/interview/generateQuestion.ts
import { genAI } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function generateQuestion(sessionId: number): Promise<string> {
  // 1. 이전 질문/답변 기록
  const records = await prisma.mockInterviewRecord.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });

  // 2. 페르소나 정보 조회
  const session = await prisma.mockInterviewSession.findUnique({
    where: { sessionId },
    include: { profile: true },
  });

  if (!session || !session.profile.persona)
    throw new Error("페르소나가 설정되지 않았습니다.");

  const rawPersona = session.profile.persona;
  const persona =
    typeof rawPersona === "string" ? rawPersona : JSON.stringify(rawPersona);
  // 3. 질문/답변 이력 정리
  const historyText = records
    .map((r, i) => `질문 ${i + 1}: ${r.question}\n답변: ${r.answerText}`)
    .join("\n\n");

  // 4. 프롬프트 구성
  const prompt = `
당신은 면접관입니다.
지원자는 아래 페르소나를 바탕으로 면접에 응하고 있습니다:

${persona}

다음은 지금까지의 면접 질문과 지원자의 답변입니다.
페르소나와 면접 흐름을 고려하여, **다음 면접 질문을 반드시 한국어로 한 문장만** 생성해주세요.

- 서론, 분석, 설명 없이 질문 문장만 출력하세요.
- 이전 답변을 기반으로 심화된 내용을 묻는 질문이면 좋습니다.
- 혹시 면접 기록이 비어있다면 첫 질문이니까 자기소개를 요구하세요.
면접 기록:
${historyText}
`;

  // 5. Gemini 호출
  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text = result.text;
  if (!text) throw new Error("질문 생성 실패");

  return text.trim();
}
