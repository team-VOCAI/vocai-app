'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  HiArrowLeft,
  HiPencilSquare,
  HiTrash,
  HiEye,
  HiCalendarDays,
  HiUser,
  HiPaperClip,
  HiArrowDownTray,
  HiChatBubbleLeft,
  HiHandThumbUp,
} from 'react-icons/hi2';
import Navbar from '@/components/Navbar';
import { CommunitySidebar } from '@/features/community/components';
import { boardAPI, commentAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface PostDetailPageProps {
  params: Promise<{ boardId: string; postId: string }>;
}

// 게시글 상세 타입 정의
interface PostDetail {
  postId: number;
  title: string;
  content: string;
  nickName: string;
  createdAt: string;
  updatedAt: string;
  view: number;
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
  company?: string;
  jobCategory?: string;
  tags?: string;
  attachments?: Array<{
    attachmentId: number;
    fileName: string;
    fileSize: number;
    fileType: string;
    createdAt: string;
  }>;
}

// 댓글 타입 정의
interface Comment {
  commentId: number;
  content: string;
  nickName: string;
  createdAt: string;
  updatedAt: string;
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
    name: '직무별 취업 정보',
    description: '직무별 채용 정보, 면접 후기, 합격 팁을 공유하는 공간입니다.',
  },
  '3': {
    name: '취업 후기',
    description: '취업 성공 후기와 면접 경험담을 공유하는 공간입니다.',
  },
  '4': {
    name: '취업 질문',
    description: '취업 관련 궁금한 점을 질문하고 답변을 받는 공간입니다.',
  },
  '5': {
    name: '자유게시판',
    description: '자유롭게 소통하고 다양한 주제로 이야기를 나누는 공간입니다.',
  },
  '6': {
    name: '정보공유',
    description: '유용한 정보와 팁을 공유하는 공간입니다.',
  },
  '7': {
    name: '스터디 모집',
    description: '함께 공부할 스터디 멤버를 모집하는 공간입니다.',
  },
  '8': {
    name: '프로젝트 모집',
    description: '프로젝트 팀원을 모집하고 협업하는 공간입니다.',
  },
};

// 파일 크기 포맷팅 함수
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { boardId, postId } = use(params);
  const board = boardInfo[boardId];
  const categoryInfo = getCategoryInfo(boardId);

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setIsLoading(true);

        // 조회수 증가 후 게시글 상세 정보 가져오기
        await boardAPI.incrementView(boardId, postId);

        // 조회수 증가 반영을 위해 잠깐 대기
        await new Promise((resolve) => setTimeout(resolve, 100));

        const postResponse = await boardAPI.getPost(boardId, postId);
        const postData = postResponse.data as PostDetail;

        // 임시로 추천 데이터 추가 (실제로는 서버에서 가져와야 함)
        setPost({
          ...postData,
          likeCount: 12, // 임시 추천 수
          isLiked: false, // 임시 추천 상태
        });

        // 댓글 목록 가져오기
        const commentsResponse = await commentAPI.getComments(parseInt(postId));
        setComments(commentsResponse.data as Comment[]);
      } catch (error) {
        console.error('Error fetching post detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetail();
  }, [boardId, postId]);

  // 댓글 작성
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const response = await commentAPI.createComment(
        parseInt(postId),
        newComment
      );

      setComments([...comments, response.data as Comment]);
      setNewComment('');

      // 댓글 수 업데이트
      if (post) {
        setPost({ ...post, commentCount: post.commentCount + 1 });
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 파일 다운로드
  const handleFileDownload = async (attachmentId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/attachments/${attachmentId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('파일 다운로드에 실패했습니다.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  // 추천 토글 함수
  const handleLikeToggle = () => {
    if (!post) return;

    setPost({
      ...post,
      isLiked: !post.isLiked,
      likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
    });
  };

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

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className='min-h-screen pt-16'>
          <div className='flex'>
            <CommunitySidebar selectedBoardId={boardId} />
            <div className='flex-1 bg-gradient-to-br from-slate-50 to-gray-100'>
              <div className='p-8 max-w-7xl mx-auto'>
                <div className='flex items-center justify-center py-12'>
                  <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
                    <p className='text-gray-600'>게시글을 불러오는 중...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className='min-h-screen pt-16'>
          <div className='flex'>
            <CommunitySidebar selectedBoardId={boardId} />
            <div className='flex-1 bg-gradient-to-br from-slate-50 to-gray-100'>
              <div className='p-8 max-w-7xl mx-auto'>
                <div className='text-center py-12'>
                  <h1 className='text-2xl font-bold text-gray-900 mb-4'>
                    게시글을 찾을 수 없습니다
                  </h1>
                  <Link
                    href={`/community/boards/${boardId}`}
                    className='text-blue-600 hover:underline'
                  >
                    목록으로 돌아가기
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
                <Link
                  href={`/community/boards/${boardId}`}
                  className='text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200'
                >
                  {board.name}
                </Link>
                <span className='mx-2 text-gray-400'>/</span>
                <span className='text-gray-800 font-medium'>게시글 상세</span>
              </nav>

              {/* 1. 게시판 헤더 */}
              <div className='mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                      {board.name}
                    </h1>
                    <p className='text-gray-600'>{board.description}</p>
                  </div>
                  <Link
                    href={`/community/boards/${boardId}`}
                    className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200'
                  >
                    <HiArrowLeft className='w-4 h-4' />
                    목록으로
                  </Link>
                </div>
              </div>

              {/* 2. 컨텐츠 박스 */}
              <div className='mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                {/* 메타정보 태그 (기업명, 직군만) */}
                {['1', '2', '3', '4'].includes(boardId) &&
                  (post.company || post.jobCategory) && (
                    <div className='flex flex-wrap gap-3 mb-4'>
                      {post.company && (
                        <span className='text-sm font-medium text-[var(--text-muted)] bg-gray-100 px-3 py-1.5 rounded-full'>
                          {post.company}
                        </span>
                      )}
                      {post.jobCategory && (
                        <span className='text-sm text-[var(--primary)] bg-blue-50 px-3 py-1.5 rounded-full font-medium'>
                          {post.jobCategory}
                        </span>
                      )}
                    </div>
                  )}

                {/* 제목 */}
                <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                  {post.title}
                </h2>

                {/* 메타정보 */}
                <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-200'>
                  <div className='flex items-center gap-6 text-sm text-gray-600'>
                    <div className='flex items-center gap-1'>
                      <HiUser className='w-4 h-4' />
                      <span>{post.nickName}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <HiCalendarDays className='w-4 h-4' />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <HiEye className='w-4 h-4' />
                      <span>조회 {post.view}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <HiChatBubbleLeft className='w-4 h-4' />
                      <span>댓글 {post.commentCount}</span>
                    </div>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={handleLikeToggle}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        post.isLiked
                          ? 'bg-[var(--button-primary-bg)] text-[var(--text-accent)] hover:bg-[var(--button-primary-bg-hover)]'
                          : 'bg-[var(--button-muted-bg)] text-[var(--text-muted)] hover:bg-[var(--button-muted-bg-hover)]'
                      }`}
                    >
                      <HiHandThumbUp className='w-4 h-4' />
                      추천 {post.likeCount}
                    </button>
                    <button className='flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium bg-[var(--button-primary-bg)] text-[var(--text-accent)] hover:bg-[var(--button-primary-bg-hover)] transition-colors duration-200'>
                      <HiPencilSquare className='w-4 h-4' />
                      수정
                    </button>
                    <button className='flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium bg-[var(--button-error-bg)] text-[var(--text-error)] hover:bg-[var(--button-error-bg-hover)] transition-colors duration-200'>
                      <HiTrash className='w-4 h-4' />
                      삭제
                    </button>
                  </div>
                </div>

                {/* 게시글 내용 */}
                <div className='prose max-w-none mb-6'>
                  <div
                    className='text-gray-900 leading-relaxed'
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>

                {/* 태그 (본문 하단) */}
                {post.tags && (
                  <div className='flex flex-wrap gap-2 mb-6 pt-4'>
                    {post.tags
                      .split(',')
                      .filter((tag) => tag.trim())
                      .map((tag, index) => (
                        <span
                          key={index}
                          className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800'
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                  </div>
                )}

                {/* 첨부파일 */}
                {post.attachments && post.attachments.length > 0 && (
                  <div className='border-t border-gray-200 pt-6'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                      <HiPaperClip className='w-5 h-5' />
                      첨부파일 ({post.attachments.length}개)
                    </h3>
                    <div className='space-y-2'>
                      {post.attachments.map((attachment) => (
                        <div
                          key={attachment.attachmentId}
                          className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                        >
                          <div className='flex items-center gap-3'>
                            <HiPaperClip className='w-4 h-4 text-gray-500' />
                            <div>
                              <p className='text-sm font-medium text-gray-900'>
                                {attachment.fileName}{' '}
                                <span className='text-xs text-gray-500 font-normal'>
                                  ({formatFileSize(attachment.fileSize)})
                                </span>
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleFileDownload(
                                attachment.attachmentId,
                                attachment.fileName
                              )
                            }
                            className='flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200'
                          >
                            <HiArrowDownTray className='w-4 h-4' />
                            다운로드
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. 댓글 박스 */}
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                  <HiChatBubbleLeft className='w-5 h-5' />
                  댓글 ({comments.length}개)
                </h3>

                {/* 댓글 작성 폼 */}
                <form onSubmit={handleCommentSubmit} className='mb-6'>
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder='댓글을 입력하세요...'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
                        rows={3}
                      />
                    </div>
                    <button
                      type='submit'
                      disabled={!newComment.trim() || isSubmittingComment}
                      className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium'
                    >
                      {isSubmittingComment ? '작성 중...' : '댓글 작성'}
                    </button>
                  </div>
                </form>

                {/* 댓글 목록 */}
                <div className='space-y-4'>
                  {comments.length === 0 ? (
                    <div className='text-center py-8 text-gray-500'>
                      아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.commentId}
                        className='border-b border-gray-100 pb-4 last:border-b-0'
                      >
                        <div className='flex items-center gap-2 mb-2'>
                          <span className='font-medium text-gray-900'>
                            {comment.nickName}
                          </span>
                          <span className='text-sm text-gray-500'>
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className='text-gray-700 leading-relaxed'>
                          {comment.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
