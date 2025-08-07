'use client';

import { HiPaperClip } from 'react-icons/hi2';
import { formatDate } from '@/lib/utils';
import { Post } from '@/types/post';

interface StudyBoardProps {
  posts: Post[];
  onPostClick: (postId: number) => void;
}

export default function StudyBoard({ posts, onPostClick }: StudyBoardProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {posts.map((post) => (
        <div
          key={post.postId}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPostClick(post.postId);
          }}
          className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer'
        >
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded'>
              스터디
            </span>
            {post.attachments.length > 0 && (
              <HiPaperClip className='w-4 h-4 text-gray-500' />
            )}
          </div>
          <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2'>
            {post.title}
          </h3>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <span>{post.nickName}</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.commentCount > 0 && (
            <div className='mt-2 text-xs text-gray-500'>
              댓글 {post.commentCount}개
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
