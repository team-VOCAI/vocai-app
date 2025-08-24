'use client';

import { useEffect, useState } from 'react';
import { HiDocumentText } from 'react-icons/hi2';
import Link from 'next/link';
import { userAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Post {
  postId?: number;
  boardId?: number;
  title: string;
  createdAt: string;
  view?: number;
  commentCount?: number;
  company?: string | null;
  jobCategory?: string | null;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('전체');
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await userAPI.getMyPosts();
        setPosts(res.data.posts || []);
        setFilteredPosts(res.data.posts || []);
      } catch {
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = [...posts];
    const term = searchTerm.trim().toLowerCase();

    if (term) {
      filtered = filtered.filter((post) => {
        switch (searchType) {
          case '제목':
            return post.title.toLowerCase().includes(term);
          case '기업':
            return (post.company || '').toLowerCase().includes(term);
          case '카테고리':
            return (post.jobCategory || '').toLowerCase().includes(term);
          default: // 전체
            return (
              post.title.toLowerCase().includes(term) ||
              (post.company || '').toLowerCase().includes(term) ||
              (post.jobCategory || '').toLowerCase().includes(term)
            );
        }
      });
    }
    setFilteredPosts(filtered);
  }, [searchTerm, searchType, posts]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">게시글을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-[400px] pl-2">
      <h2 className="text-2xl font-bold mb-8">내가 쓴 게시글</h2>

      {/* 검색/필터 UI */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="전체">전체</option>
            <option value="제목">제목</option>
            <option value="기업">기업</option>
            <option value="카테고리">카테고리</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="px-3 py-2 border border-gray-300 rounded-lg flex-1 sm:max-w-xs bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setSearchTerm(searchTerm); // 엔터로 검색
              }
            }}
          />
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => setSearchTerm(searchTerm)}
          >
            검색
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-gray-700">
            <div className="col-span-1 text-center">번호</div>
            <div className="col-span-6 text-center">제목</div>
            <div className="col-span-2 text-center">작성일</div>
            <div className="col-span-1 text-center">조회</div>
            <div className="col-span-2 text-center">댓글</div>
          </div>
        </div>
        {/* 게시글 목록 또는 빈 상태 */}
        {filteredPosts.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post, index) => (
              <div
                key={post.postId ?? index}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  if (post.postId && post.boardId) {
                    router.push(`/community/boards/${post.boardId}/posts/${post.postId}`);
                  }
                }}
              >
                <div className="col-span-1 text-center text-sm text-gray-600">
                  {filteredPosts.length - index}
                </div>
                <div className="col-span-6 flex items-center gap-2">
                  {/* 기업/카테고리 value값 표시 */}
                  {(post.company || post.jobCategory) && (
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {post.company && post.jobCategory
                        ? `${post.company} · ${post.jobCategory}`
                        : post.company || post.jobCategory}
                    </span>
                  )}
                  <span className="text-gray-900 font-medium">{post.title}</span>
                </div>
                <div className="col-span-2 text-center text-sm text-gray-600">
                  {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                </div>
                <div className="col-span-1 text-center text-sm text-gray-600">
                  {post.view ?? 0}
                </div>
                <div className="col-span-2 text-center text-sm text-gray-600">
                  {post.commentCount ?? 0}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiDocumentText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              아직 게시글이 없습니다
            </h3>
            <p className="text-gray-600 mb-8">
              첫 번째 게시글을 작성해보세요!
            </p>
            <Link
              href="/community/boards/1/write"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              글쓰기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}