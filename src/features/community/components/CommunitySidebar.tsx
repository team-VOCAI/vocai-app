'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCount } from '@/lib/utils';
import { boardAPI } from '@/lib/api';
import { boardInfo, categoryGroups } from '@/lib/constants/boards';

interface Board {
  id: string;
  name: string;
  description: string;
  postCount: number;
}

interface Category {
  title: string;
  boards: Board[];
}

interface CommunitySidebarProps {
  selectedBoardId?: string;
}

interface BoardStat {
  boardId: number;
  name: string;
  postCount: number;
}

export default function CommunitySidebar({
  selectedBoardId = '1',
}: CommunitySidebarProps) {
  const [boardStats, setBoardStats] = useState<BoardStat[]>([]);
  const [loading, setLoading] = useState(true);

  // 게시판 통계 데이터 로드
  useEffect(() => {
    const fetchBoardStats = async () => {
      try {
        const response = await boardAPI.getStats();
        setBoardStats((response.data as { stats: BoardStat[] }).stats || []);
      } catch (error) {
        console.error('게시판 통계 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardStats();
  }, []);

  // 게시판별 게시물 수 조회
  const getPostCount = (boardId: string): number => {
    const stat = boardStats.find((s) => s.boardId === parseInt(boardId));
    return stat ? stat.postCount : 0;
  };

  // 통일된 데이터를 사용해서 카테고리 구성
  const categories: Category[] = categoryGroups.map((group) => ({
    title: group.title,
    boards: group.boardIds.map((boardId) => ({
      id: boardId,
      name: boardInfo[boardId].name,
      description: boardInfo[boardId].description,
      postCount: getPostCount(boardId),
    })),
  }));

  return (
    <aside className='w-80 bg-white border-r border-gray-200 min-h-screen shadow-sm'>
      <div className='p-6'>
        {/* 사이드바 헤더 */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>커뮤니티</h2>
          <p className='text-sm text-gray-600'>함께 성장하는 취업 준비 공간</p>
        </div>

        {/* 네비게이션 */}
        <nav className='space-y-8'>
          {categories.map((category, categoryIndex) => (
            <div key={category.title} className='space-y-3'>
              {/* 카테고리 헤더 */}
              <div className='flex items-center gap-3'>
                {/* 카테고리 아이콘 */}
                <div
                  className={`w-2 h-2 rounded-full ${
                    categoryIndex === 0
                      ? 'bg-blue-500'
                      : categoryIndex === 1
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                />
                <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
                  {category.title}
                </h3>
              </div>

              {/* 서브 게시판들 */}
              <div className='space-y-1 ml-5'>
                {category.boards.map((board) => {
                  const isSelected = selectedBoardId === board.id;
                  const href = `/community/boards/${board.id}`;

                  return (
                    <Link
                      key={board.id}
                      href={href}
                      className={`group block p-3 rounded-xl transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-50 border border-blue-200 shadow-sm'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className='flex justify-between items-start'>
                        <div className='flex-1 min-w-0'>
                          <h4
                            className={`font-medium text-sm mb-1 transition-colors ${
                              isSelected
                                ? 'text-blue-700'
                                : 'text-gray-700 group-hover:text-gray-900'
                            }`}
                          >
                            {board.name}
                          </h4>
                          <p
                            className={`text-xs leading-relaxed transition-colors ${
                              isSelected
                                ? 'text-blue-600'
                                : 'text-gray-500 group-hover:text-gray-600'
                            }`}
                          >
                            {board.description}
                          </p>
                        </div>

                        {/* 게시글 수 */}
                        <div className='ml-3 flex-shrink-0'>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                              isSelected
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                            }`}
                          >
                            {loading ? '...' : formatCount(board.postCount)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
