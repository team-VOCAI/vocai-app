'use client';

import React, { useState, useMemo, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CommunitySidebar } from '@/features/community/components';
import Link from 'next/link';
import {
  HiPlus,
  HiChevronLeft,
  HiChevronRight,
  HiDocumentText,
} from 'react-icons/hi2';
import { formatCount, formatDate } from '@/lib/utils';

interface BoardPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

// 카테고리 정보 매핑
const getCategoryInfo = (boardId: string) => {
  if (['1', '2', '3', '4'].includes(boardId)) {
    return { name: '취업 정보', defaultId: '1' };
  } else if (['5', '6'].includes(boardId)) {
    return { name: '자유게시판', defaultId: '5' };
  } else if (['7', '8'].includes(boardId)) {
    return { name: '스터디 모집', defaultId: '7' };
  }
  return null;
};

// 더미 게시글 데이터 (기업별 취업 정보)
const dummyPosts = [
  {
    id: 1,
    title: '네이버 프론트엔드 개발자 채용 정보 및 면접 질문 유형',
    author: '개발자A',
    date: '2024-01-15T14:30:00',
    views: 245,
    company: '네이버',
    jobCategory: 'FE',
    commentCount: 2000,
    likeCount: 45,
  },
  {
    id: 2,
    title: '카카오 백엔드 개발자 기술스택 요구사항 정리',
    author: '코딩맨',
    date: '2024-01-14T16:45:00',
    views: 189,
    company: '카카오',
    jobCategory: 'BE',
    commentCount: 18,
    likeCount: 32,
  },
  {
    id: 3,
    title: '삼성전자 SDS 신입 개발자 면접 질문 패턴 분석',
    author: '취준생123',
    date: '2024-01-13T09:20:00',
    views: 312,
    company: '삼성',
    jobCategory: '개발',
    commentCount: 35,
    likeCount: 58,
  },
  {
    id: 4,
    title: 'LG CNS 데이터 분석가 직무 역량 요구사항',
    author: '데이터러버',
    date: '2024-01-12T11:15:00',
    views: 167,
    company: 'LG',
    jobCategory: '데이터',
    commentCount: 12,
    likeCount: 28,
  },
  {
    id: 5,
    title: '라인 플러스 iOS 개발자 채용 프로세스 정보',
    author: 'iOS개발자',
    date: '2024-01-11T13:25:00',
    views: 203,
    company: '라인',
    jobCategory: 'iOS',
    commentCount: 27,
    likeCount: 41,
  },
  {
    id: 6,
    title: '토스 프로덕트 매니저 직무 역량 및 면접 질문 모음',
    author: 'PM지망생',
    date: '2024-01-10T15:40:00',
    views: 156,
    company: '토스',
    jobCategory: '기획',
    commentCount: 15,
    likeCount: 29,
  },
  {
    id: 7,
    title: '쿠팡 풀스택 개발자 기술스택 및 코딩테스트 정보',
    author: '풀스택러',
    date: '2024-01-09T10:30:00',
    views: 278,
    company: '쿠팡',
    jobCategory: '풀스택',
    commentCount: 42,
    likeCount: 67,
  },
  {
    id: 8,
    title: '배달의민족 안드로이드 개발자 채용 요구사항',
    author: '안드로이더',
    date: '2024-01-08T17:15:00',
    views: 134,
    company: '배민',
    jobCategory: 'AOS',
    commentCount: 9,
    likeCount: 22,
  },
  {
    id: 9,
    title: '야놀자 DevOps 엔지니어 기술면접 질문 패턴',
    author: 'DevOps맨',
    date: '2024-01-07T12:50:00',
    views: 198,
    company: '야놀자',
    jobCategory: 'DevOps',
    commentCount: 31,
    likeCount: 39,
  },
  {
    id: 10,
    title: '당근마켓 UX 디자이너 포트폴리오 요구사항',
    author: 'UX디자이너',
    date: '2024-01-06T08:35:00',
    views: 221,
    company: '당근마켓',
    jobCategory: 'UX',
    commentCount: 24,
    likeCount: 44,
  },
  {
    id: 11,
    title: 'SK텔레콤 AI 개발자 직무 역량 및 기술스택 정보',
    author: 'AI연구원',
    date: '2024-01-05T19:10:00',
    views: 289,
    company: 'SKT',
    jobCategory: 'AI',
    commentCount: 38,
    likeCount: 72,
  },
  {
    id: 12,
    title: 'KT 클라우드 엔지니어 채용 정보 및 면접 질문 유형',
    author: '클라우드맨',
    date: '2024-01-04T14:20:00',
    views: 145,
    company: 'KT',
    jobCategory: '클라우드',
    commentCount: 16,
    likeCount: 25,
  },
  {
    id: 13,
    title: '현대자동차 소프트웨어 개발자 채용 프로세스',
    author: '자동차개발자',
    date: '2024-01-03T11:05:00',
    views: 167,
    company: '현대차',
    jobCategory: '개발',
    commentCount: 19,
    likeCount: 33,
  },
  {
    id: 14,
    title: 'NHN 게임 개발자 기술면접 질문 패턴 분석',
    author: '게임개발자',
    date: '2024-01-02T16:30:00',
    views: 201,
    company: 'NHN',
    jobCategory: '게임',
    commentCount: 26,
    likeCount: 48,
  },
  {
    id: 15,
    title: '넥슨 게임 기획자 직무 요구사항 및 면접 정보',
    author: '게임기획자',
    date: '2024-01-01T09:45:00',
    views: 178,
    company: '넥슨',
    jobCategory: '기획',
    commentCount: 21,
    likeCount: 37,
  },
  {
    id: 16,
    title: '엔씨소프트 서버 개발자 기술스택 및 채용 정보',
    author: '서버개발자',
    date: '2023-12-31T18:25:00',
    views: 234,
    company: 'NC소프트',
    jobCategory: 'BE',
    commentCount: 29,
    likeCount: 51,
  },
  {
    id: 17,
    title: '스마일게이트 QA 엔지니어 직무 역량 요구사항',
    author: 'QA엔지니어',
    date: '2023-12-30T13:40:00',
    views: 123,
    company: '스마일게이트',
    jobCategory: 'QA',
    commentCount: 8,
    likeCount: 19,
  },
  {
    id: 18,
    title: '컴투스 모바일 게임 개발자 면접 질문 유형',
    author: '모바일개발자',
    date: '2023-12-29T15:55:00',
    views: 189,
    company: '컴투스',
    jobCategory: '게임',
    commentCount: 22,
    likeCount: 36,
  },
  {
    id: 19,
    title: '우아한형제들 데이터 엔지니어 채용 프로세스',
    author: '데이터엔지니어',
    date: '2023-12-28T10:15:00',
    views: 267,
    company: '우아한형제들',
    jobCategory: '데이터',
    commentCount: 33,
    likeCount: 59,
  },
  {
    id: 20,
    title: '버즈빌 마케팅 데이터 분석가 직무 정보',
    author: '마케터',
    date: '2023-12-27T17:30:00',
    views: 156,
    company: '버즈빌',
    jobCategory: '마케팅',
    commentCount: 14,
    likeCount: 26,
  },
  {
    id: 21,
    title: '마켓컬리 프론트엔드 개발자 기술스택 정보',
    author: '프론트개발자',
    date: '2023-12-26T12:45:00',
    views: 198,
    company: '마켓컬리',
    jobCategory: 'FE',
    commentCount: 25,
    likeCount: 42,
  },
  {
    id: 22,
    title: '뱅크샐러드 핀테크 개발자 채용 요구사항',
    author: '핀테크개발자',
    date: '2023-12-25T16:20:00',
    views: 212,
    company: '뱅크샐러드',
    jobCategory: '핀테크',
    commentCount: 30,
    likeCount: 47,
  },
  {
    id: 23,
    title: '하이퍼커넥트 AI 연구원 직무 역량 및 면접 질문',
    author: 'AI연구자',
    date: '2023-12-24T11:35:00',
    views: 245,
    company: '하이퍼커넥트',
    jobCategory: 'AI',
    commentCount: 34,
    likeCount: 56,
  },
  {
    id: 24,
    title: '리디 웹 개발자 채용 프로세스 및 면접 정보',
    author: '웹개발자',
    date: '2023-12-23T14:50:00',
    views: 167,
    company: '리디',
    jobCategory: '웹',
    commentCount: 17,
    likeCount: 31,
  },
  {
    id: 25,
    title: '직방 빅데이터 분석가 기술면접 질문 패턴',
    author: '빅데이터분석가',
    date: '2023-12-22T09:10:00',
    views: 189,
    company: '직방',
    jobCategory: '데이터',
    commentCount: 23,
    likeCount: 38,
  },
];

// 게시판 정보 매핑
const boardInfo: Record<string, { name: string; description: string }> = {
  '1': {
    name: '기업별 취업 정보',
    description:
      '기업별, 직군별 채용 정보와 다양한 취업 정보를 공유하는 공간입니다.',
  },
  '2': {
    name: '면접 후기',
    description: '실제 면접 경험담과 후기를 공유하는 공간입니다.',
  },
  '3': {
    name: '취업 질문',
    description: '취업 관련 궁금한 점을 묻고 답변하는 공간입니다.',
  },
  '4': {
    name: '취업 자료 공유',
    description: '이력서, 자소서 등 취업 자료를 공유하는 공간입니다.',
  },
  '5': {
    name: '잡담방',
    description: '자유롭게 이야기하는 공간입니다.',
  },
  '6': {
    name: '고민상담',
    description: '진로와 고민을 나누는 공간입니다.',
  },
  '7': {
    name: '스터디 목록',
    description: '스터디 그룹 모집 및 참여하는 공간입니다.',
  },
  '8': {
    name: '스터디 후기',
    description: '스터디 경험담과 후기를 공유하는 공간입니다.',
  },
};

export default function BoardPage({ params }: BoardPageProps) {
  const { boardId } = use(params);
  const board = boardInfo[boardId];
  const categoryInfo = getCategoryInfo(boardId);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;

  // 현재 게시판이 기업별 면접 정보(ID: 1)인 경우에만 더미 데이터 사용
  const posts = useMemo(() => {
    return boardId === '1' ? dummyPosts : [];
  }, [boardId]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  if (!board) {
    return (
      <>
        <Navbar />
        <main className='min-h-screen pt-16'>
          <div className='flex'>
            <CommunitySidebar selectedBoardId={boardId} />
            <div className='flex-1 bg-[var(--gray-50)]'>
              <div className='p-8'>
                <div className='text-center py-12'>
                  <h1 className='text-2xl font-bold text-[var(--text-primary)] mb-4'>
                    게시판을 찾을 수 없습니다
                  </h1>
                  <Link
                    href='/community'
                    className='text-[var(--text-accent)] hover:underline'
                  >
                    커뮤니티로 돌아가기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className='min-h-screen pt-16'>
        <div className='flex'>
          {/* 좌측 사이드바 */}
          <CommunitySidebar selectedBoardId={boardId} />

          {/* 우측 메인 컨텐츠 */}
          <div className='flex-1 bg-gradient-to-br from-slate-50 to-gray-100'>
            <div className='p-8 max-w-7xl mx-auto'>
              {/* 브레드크럼 */}
              <nav className='mb-8 text-sm text-gray-600'>
                <Link
                  href='/community/boards/1'
                  className='text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200'
                >
                  커뮤니티
                </Link>
                <span className='mx-2 text-gray-400'>/</span>
                {categoryInfo && (
                  <>
                    <Link
                      href={`/community/boards/${categoryInfo.defaultId}`}
                      className='text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200'
                    >
                      {categoryInfo.name}
                    </Link>
                    <span className='mx-2 text-gray-400'>/</span>
                  </>
                )}
                <span className='text-gray-800 font-medium'>{board.name}</span>
              </nav>

              {/* 게시판 헤더 */}
              <div className='mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
                  <div>
                    <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                      {board.name}
                    </h1>
                    <p className='text-gray-600'>{board.description}</p>
                  </div>
                  <div className='sm:flex-shrink-0'>
                    <Link
                      href={`/community/boards/${boardId}/write`}
                      className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors duration-200'
                    >
                      <HiPlus className='w-4 h-4' />
                      글쓰기
                    </Link>
                  </div>
                </div>
              </div>

              {/* 검색 및 필터 */}
              <div className='mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
                <div className='flex flex-col sm:flex-row gap-3 justify-between'>
                  <div className='flex gap-2 flex-1'>
                    <select className='px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white'>
                      <option>전체</option>
                      <option>제목</option>
                      <option>내용</option>
                      <option>작성자</option>
                    </select>
                    <input
                      type='text'
                      placeholder='검색어를 입력하세요'
                      className='px-3 py-2 border border-gray-300 rounded-lg flex-1 sm:max-w-xs bg-white'
                    />
                    <button className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'>
                      검색
                    </button>
                  </div>
                  <select className='px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white'>
                    <option>최신순</option>
                    <option>추천순</option>
                    <option>조회순</option>
                    <option>댓글순</option>
                  </select>
                </div>
              </div>

              {/* 게시글 목록 */}
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                {/* 테이블 헤더 */}
                <div className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
                  <div className='grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-gray-700'>
                    <div className='col-span-1 text-center'>번호</div>
                    <div className='col-span-5 text-center'>제목</div>
                    <div className='col-span-2 text-center'>작성자</div>
                    <div className='col-span-2 text-center'>작성일</div>
                    <div className='col-span-1 text-center'>조회</div>
                    <div className='col-span-1 text-center'>추천</div>
                  </div>
                </div>

                {/* 게시글 목록 또는 빈 상태 */}
                {currentPosts.length > 0 ? (
                  <div className='divide-y divide-gray-200'>
                    {currentPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className='grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer'
                      >
                        <div className='col-span-1 text-center text-sm text-gray-600'>
                          {(currentPage - 1) * postsPerPage + index + 1}
                        </div>
                        <div className='col-span-5'>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                              {post.company} · {post.jobCategory}
                            </span>
                            <Link
                              href={`/community/boards/${boardId}/posts/${post.id}`}
                              className='text-gray-900 hover:text-blue-600 transition-colors font-medium'
                            >
                              {post.title}
                            </Link>
                            <span className='text-sm text-gray-500'>
                              [{formatCount(post.commentCount)}]
                            </span>
                          </div>
                        </div>
                        <div className='col-span-2 text-center text-sm text-gray-600'>
                          {post.author}
                        </div>
                        <div className='col-span-2 text-center text-sm text-gray-600'>
                          {formatDate(post.date)}
                        </div>
                        <div className='col-span-1 text-center text-sm text-gray-600'>
                          {post.views}
                        </div>
                        <div className='col-span-1 text-center text-sm text-gray-600'>
                          {post.likeCount}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-16'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                      <HiDocumentText className='w-8 h-8 text-gray-400' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                      아직 게시글이 없습니다
                    </h3>
                    <p className='text-gray-600 mb-8'>
                      첫 번째 게시글을 작성해보세요!
                    </p>
                    <Link
                      href={`/community/boards/${boardId}/write`}
                      className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors'
                    >
                      <HiPlus className='w-4 h-4' />
                      글쓰기
                    </Link>
                  </div>
                )}
              </div>

              {/* 페이지네이션 */}
              {posts.length > 0 && totalPages > 1 && (
                <div className='mt-12 flex justify-center'>
                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-2'>
                    <div className='flex items-center gap-1'>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className='px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <HiChevronLeft className='w-4 h-4' />
                        이전
                      </button>

                      {/* 페이지 번호 */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className='px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        다음
                        <HiChevronRight className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
