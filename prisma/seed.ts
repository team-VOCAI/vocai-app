import { PrismaClient, type Board, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const boards: Prisma.BoardUncheckedCreateInput[] = [
  { boardId: 1, name: "채용공고", isActive: true },
  { boardId: 2, name: "면접후기", isActive: true },
  { boardId: 3, name: "기업정보", isActive: true },
  { boardId: 4, name: "합격자소서", isActive: true },
  { boardId: 5, name: "자유게시판", isActive: true },
  { boardId: 6, name: "질문게시판", isActive: true },
];

async function main() {
  console.log("🌱 시드 데이터 삽입 시작...");

  const existingBoards: Board[] = await prisma.board.findMany();
  console.log("📋 기존 게시판 수:", existingBoards.length);

  if (existingBoards.length === 0) {
    console.log("📋 게시판 데이터가 없어서 기본 데이터를 삽입합니다...");
    for (const board of boards) {
      await prisma.board.upsert({
        where: { boardId: board.boardId },
        update: {},
        create: board,
      });
      console.log(`✅ 게시판 생성: ${board.name}`);
    }
    console.log("🎉 모든 게시판 데이터 삽입 완료!");
  } else {
    console.log("📋 게시판 데이터가 이미 존재합니다:");
    existingBoards.forEach((board: Board) => {
      console.log(`  - ${board.boardId}: ${board.name}`);
    });
  }
}

main()
  .catch((e) => {
    console.error("❌ 시드 실행 중 에러:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
