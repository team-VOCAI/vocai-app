import { genAI } from "@/lib/gemini";

export async function generateFeedback(question: string, answer: string) {
  const prompt = `
  아래 면접 질문과 답변을 보고 아래 형식에 맞춰 피드백을 작성해줘:
  
질문: ${question}
답변: ${answer}

요약:(요약 내용)
  
잘한 점:(잘한 점 내용)
  
개선할 점:(개선할 점 내용)
  `;

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text = result.text;
  console.log("Gemini 응답:", text);

  if (!text) {
    console.log("generateFeedback에 text가 없습니다!");
    return { summary: "없음", feedback: "없음" };
  }

  const summaryMatch = text.match(
    /(?:- )?(?:\*\*)?요약:(?:\*\*)?\s*\n?([\s\S]*?)\n+(?:- )?(?:\*\*)?개선할 점:(?:\*\*)?/i
  );

  const feedbackMatch = text.match(
    /(?:- )?(?:\*\*)?개선할 점:(?:\*\*)?\s*\n?([\s\S]*)/i
  );

  const summary = summaryMatch?.[1]?.trim() || "요약을 찾을 수 없습니다.";
  const feedback = feedbackMatch?.[1]?.trim() || "피드백을 찾을 수 없습니다.";

  return { summary, feedback };
}
