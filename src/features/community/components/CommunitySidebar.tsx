'use client';

import React from 'react';
import Link from 'next/link';
import { formatCount } from '@/lib/utils';

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

// 실제 게시판별 게시글 수 데이터
const getActualPostCount = (boardId: string): number => {
  switch (boardId) {
    case '1': // 기업별 취업 정보
      return 25; // 실제 더미 데이터 수
    case '2': // 면접 후기
      return 0;
    case '3': // 취업 질문
      return 0;
    case '4': // 취업 자료 공유
      return 0;
    case '5': // 잡담방
      return 0;
    case '6': // 고민상담
      return 0;
    case '7': // 스터디 목록
      return 0;
    case '8': // 스터디 후기
      return 0;
    default:
      return 0;
  }
};

export default function CommunitySidebar({
  selectedBoardId = '1',
}: CommunitySidebarProps) {
  const categories: Category[] = [
    {
      title: '취업 정보',
      boards: [
        {
          id: '1',
          name: '기업별 취업 정보',
          description: '기업별 채용 정보와 다양한 정보',
          postCount: getActualPostCount('1'),
        },
        {
          id: '2',
          name: '면접 후기',
          description: '실제 면접 경험담과 후기',
          postCount: getActualPostCount('2'),
        },
        {
          id: '3',
          name: '취업 질문',
          description: '취업 관련 궁금한 점 Q&A',
          postCount: getActualPostCount('3'),
        },
        {
          id: '4',
          name: '취업 자료 공유',
          description: '이력서, 자소서 등 취업 자료',
          postCount: getActualPostCount('4'),
        },
      ],
    },
    {
      title: '자유게시판',
      boards: [
        {
          id: '5',
          name: '잡담방',
          description: '자유롭게 이야기하는 공간',
          postCount: getActualPostCount('5'),
        },
        {
          id: '6',
          name: '고민상담',
          description: '진로와 고민을 나누는 공간',
          postCount: getActualPostCount('6'),
        },
      ],
    },
    {
      title: '스터디 모집',
      boards: [
        {
          id: '7',
          name: '스터디 목록',
          description: '스터디 그룹 모집 및 참여',
          postCount: getActualPostCount('7'),
        },
        {
          id: '8',
          name: '스터디 후기',
          description: '스터디 경험담과 후기',
          postCount: getActualPostCount('8'),
        },
      ],
    },
  ];

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
                            {formatCount(board.postCount)}
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
