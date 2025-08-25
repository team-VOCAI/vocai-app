'use client';

import { HiPaperClip } from 'react-icons/hi2';
import { formatDate } from '@/lib/utils';
import { Post } from '@/types/post';

interface RegularBoardProps {
  posts: Post[];
  onPostClick: (postId: number) => void;
  boardId: string;
  currentPage: number;
  postsPerPage: number;
}

export default function RegularBoard({
  posts,
  onPostClick,
  boardId,
  currentPage,
  postsPerPage,
}: RegularBoardProps) {
  // 취업 정보 카테고리 판별 함수
  const isJobInfoBoard = (boardId: string): boolean => {
    return ['1', '2', '3', '4'].includes(boardId);
  };

  // 메타정보 표시 여부 판별
  const shouldShowJobMetaInfo = (post: Post): boolean => {
    return isJobInfoBoard(boardId) && Boolean(post.company || post.jobCategory);
  };

  // 메타정보 텍스트 생성
  const getJobMetaInfoText = (post: Post): string => {
    if (post.company && post.jobCategory) {
      return `${post.company} · ${post.jobCategory}`;
    }
    return (post.company || post.jobCategory || '') as string;
  };

  return (
    <div className='divide-y divide-gray-200'>
      {posts.map((post, index) => (
        <div
          key={post.postId}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPostClick(post.postId);
          }}
          className='text-gray-900 hover:text-blue-600 transition-colors font-medium cursor-pointer hover:bg-gray-50 rounded-lg'
        >
          <div className='grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors'>
            <div className='col-span-1 text-center text-sm text-gray-600'>
              {(currentPage - 1) * postsPerPage + index + 1}
            </div>
            <div className='col-span-5'>
              <div className='flex items-center gap-2'>
                {/* 취업 정보 카테고리인 경우 메타정보 표시 */}
                {shouldShowJobMetaInfo(post) && (
                  <span className='text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                    {getJobMetaInfoText(post)}
                  </span>
                )}
                {post.title}

                {/* 첨부파일 아이콘 표시 */}
                {post.attachments.length > 0 && (
                  <HiPaperClip className='w-4 h-4 text-gray-500' />
                )}
                {/* 댓글 수 표시 [댓글수] 형식 */}
                {post.commentCount > 0 && (
                  <span className='text-gray-500 text-sm'>
                    [{post.commentCount}]
                  </span>
                )}
              </div>
            </div>
            <div className='col-span-2 text-center text-sm text-gray-600'>
              {post.nickName}
            </div>
            <div className='col-span-2 text-center text-sm text-gray-600'>
              {formatDate(post.createdAt)}
            </div>
            <div className='col-span-1 text-center text-sm text-gray-600'>
              {post.view}
            </div>
            <div className='col-span-1 text-center text-sm text-gray-600'>
              {/* 추천 수 표시 (추후 구현) */}0
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
