'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  HiPlus,
  HiChevronLeft,
  HiChevronRight,
  HiDocumentText,
  HiPaperClip,
} from 'react-icons/hi2';
import Navbar from '@/components/Navbar';
import { CommunitySidebar } from '@/features/community/components';
import { boardAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface BoardPageProps {
  params: Promise<{ boardId: string }>;
}

// 게시글 타입 정의
interface Post {
  postId: number;
  title: string;
  content: string;
  nickName: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  company?: string | null;
  jobCategory?: string | null;
  tags?: string | null;
  profile: {
    profileId: number;
    nickName: string;
  };
  board: {
    boardId: number;
    name: string;
  };
  attachments: Array<{
    attachmentId: number;
    fileName: string;
    fileSize: number;
    fileType: string;
    createdAt: string;
  }>;
}

// API 응답 타입 정의
interface PostsResponse {
  posts: Post[];
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

  // 상태 관리
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('전체');
  const [sortType, setSortType] = useState('최신순');
  const postsPerPage = 20;

  // 게시글 데이터 로드
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await boardAPI.getPosts(boardId);
        const postsData = (response.data as PostsResponse).posts || [];

        console.log('📋 게시글 데이터 로드:', postsData.length, '개');
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (err) {
        console.error('게시글 로드 에러:', err);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (boardId) {
      fetchPosts();
    }
  }, [boardId]);

  // 검색 및 정렬 처리
  useEffect(() => {
    let filtered = [...posts];

    // 검색 필터링
    if (searchTerm.trim()) {
      filtered = filtered.filter((post) => {
        const term = searchTerm.toLowerCase();
        switch (searchType) {
          case '제목':
            return post.title.toLowerCase().includes(term);
          case '내용':
            return post.content.toLowerCase().includes(term);
          case '작성자':
            return post.nickName.toLowerCase().includes(term);
          default: // '전체'
            return (
              post.title.toLowerCase().includes(term) ||
              post.content.toLowerCase().includes(term) ||
              post.nickName.toLowerCase().includes(term)
            );
        }
      });
    }

    // 정렬 처리
    switch (sortType) {
      case '최신순':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case '조회순':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case '댓글순':
        // 댓글 수 기준 정렬 (추후 구현)
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // 검색/정렬 시 첫 페이지로 이동
  }, [posts, searchTerm, searchType, sortType]);

  // 검색 함수
  const handleSearch = () => {
    // useEffect에서 자동으로 처리되므로 별도 로직 불필요
  };

  // 새로고침 함수
  const handleRefresh = () => {
    window.location.reload();
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

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
                    <select
                      className='px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white'
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option>전체</option>
                      <option>제목</option>
                      <option>내용</option>
                      <option>작성자</option>
                    </select>
                    <input
                      type='text'
                      placeholder='검색어를 입력하세요'
                      className='px-3 py-2 border border-gray-300 rounded-lg flex-1 sm:max-w-xs bg-white'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      onClick={handleSearch}
                      className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
                    >
                      검색
                    </button>
                  </div>
                  <select
                    className='px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white'
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                  >
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

                {/* 로딩 상태 */}
                {loading && (
                  <div className='text-center py-16'>
                    <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                    <p className='mt-4 text-gray-600'>
                      게시글을 불러오는 중...
                    </p>
                  </div>
                )}

                {/* 에러 상태 */}
                {error && (
                  <div className='text-center py-16'>
                    <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                      <HiDocumentText className='w-8 h-8 text-red-400' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                      오류가 발생했습니다
                    </h3>
                    <p className='text-gray-600 mb-8'>{error}</p>
                    <button
                      onClick={handleRefresh}
                      className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors'
                    >
                      다시 시도
                    </button>
                  </div>
                )}

                {/* 게시글 목록 또는 빈 상태 */}
                {!loading && !error && (
                  <>
                    {currentPosts.length > 0 ? (
                      <div className='divide-y divide-gray-200'>
                        {currentPosts.map((post, index) => (
                          <div
                            key={post.postId}
                            className='grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer'
                          >
                            <div className='col-span-1 text-center text-sm text-gray-600'>
                              {(currentPage - 1) * postsPerPage + index + 1}
                            </div>
                            <div className='col-span-5'>
                              <div className='flex items-center gap-2'>
                                {/* 취업 정보 카테고리인 경우 메타정보 표시 */}
                                {['1', '2', '3', '4'].includes(boardId) &&
                                  (post.company || post.jobCategory) && (
                                    <span className='text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                                      {post.company && post.jobCategory
                                        ? `${post.company} · ${post.jobCategory}`
                                        : post.company || post.jobCategory}
                                    </span>
                                  )}
                                <Link
                                  href={`/community/boards/${boardId}/posts/${post.postId}`}
                                  className='text-gray-900 hover:text-blue-600 transition-colors font-medium'
                                >
                                  {post.title}
                                </Link>
                                {/* 첨부파일 아이콘 표시 */}
                                {post.attachments.length > 0 && (
                                  <HiPaperClip className='w-4 h-4 text-gray-500 ml-1' />
                                )}
                                {/* 댓글 수 표시 [댓글수] 형식 */}
                                {/* 댓글 기능 구현 시 조건부 표시 */}
                                {/* {post.commentCount > 0 && (
                                  <span className='text-gray-500 text-sm ml-1'>[{post.commentCount}]</span>
                                )} */}
                              </div>
                            </div>
                            <div className='col-span-2 text-center text-sm text-gray-600'>
                              {post.nickName}
                            </div>
                            <div className='col-span-2 text-center text-sm text-gray-600'>
                              {formatDate(post.createdAt)}
                            </div>
                            <div className='col-span-1 text-center text-sm text-gray-600'>
                              {post.views}
                            </div>
                            <div className='col-span-1 text-center text-sm text-gray-600'>
                              {/* 추천 수 표시 (추후 구현) */}0
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-16'>
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                          <HiDocumentText className='w-8 h-8 text-gray-400' />
                        </div>
                        {searchTerm.trim() ? (
                          <>
                            <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                              검색 결과가 없습니다
                            </h3>
                            <p className='text-gray-600 mb-8'>
                              &apos;{searchTerm}&apos; 검색 결과가 없습니다.
                              다른 검색어를 시도해보세요.
                            </p>
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setSearchType('전체');
                              }}
                              className='inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mr-4'
                            >
                              검색 초기화
                            </button>
                          </>
                        ) : (
                          <>
                            <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                              아직 게시글이 없습니다
                            </h3>
                            <p className='text-gray-600 mb-8'>
                              첫 번째 게시글을 작성해보세요!
                            </p>
                          </>
                        )}
                        <Link
                          href={`/community/boards/${boardId}/write`}
                          className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors'
                        >
                          <HiPlus className='w-4 h-4' />
                          글쓰기
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 페이지네이션 */}
              {!loading &&
                !error &&
                filteredPosts.length > 0 &&
                totalPages > 1 && (
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
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((pageNum) => (
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
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
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
