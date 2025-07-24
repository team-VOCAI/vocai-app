// 나중에 삭제할 것
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 삽입 시작...');

  // Board 데이터 확인
  const existingBoards = await prisma.board.findMany();
  console.log('📋 기존 게시판 수:', existingBoards.length);

  if (existingBoards.length === 0) {
    console.log('📋 게시판 데이터가 없어서 기본 데이터를 삽입합니다...');

    const boards = [
      { boardId: 1, name: '채용공고', isActive: true },
      { boardId: 2, name: '면접후기', isActive: true },
      { boardId: 3, name: '기업정보', isActive: true },
      { boardId: 4, name: '합격자소서', isActive: true },
      { boardId: 5, name: '자유게시판', isActive: true },
      { boardId: 6, name: '질문게시판', isActive: true },
    ];

    for (const board of boards) {
      await prisma.board.upsert({
        where: { boardId: board.boardId },
        update: {},
        create: board,
      });
      console.log(`✅ 게시판 생성: ${board.name}`);
    }

    console.log('🎉 모든 게시판 데이터 삽입 완료!');
  } else {
    console.log('📋 게시판 데이터가 이미 존재합니다:');
    existingBoards.forEach((board) => {
      console.log(`  - ${board.boardId}: ${board.name}`);
    });
  }
}

main()
  .catch((e) => {
    console.error('❌ 시드 실행 중 에러:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
