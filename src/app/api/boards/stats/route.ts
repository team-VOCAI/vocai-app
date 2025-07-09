import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('📊 게시판별 게시글 수 조회 시작');

    // 각 게시판별 게시글 수를 조회
    const boardStats = await prisma.board.findMany({
      select: {
        boardId: true,
        name: true,
        _count: {
          select: {
            posts: {
              where: {
                deletedAt: null, // 삭제되지 않은 게시글만 카운트
              },
            },
          },
        },
      },
      orderBy: {
        boardId: 'asc',
      },
    });

    // 응답 형태를 변환
    const stats = boardStats.map((board) => ({
      boardId: board.boardId,
      name: board.name,
      postCount: board._count.posts,
    }));

    console.log('📊 게시판별 게시글 수:', stats);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('❌ 게시판 통계 조회 에러:', error);
    return NextResponse.json(
      { error: '게시판 통계를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
