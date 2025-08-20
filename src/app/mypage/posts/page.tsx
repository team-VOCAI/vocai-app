'use client';

import { useEffect, useState } from 'react';

interface Post {
  title: string;
  createdAt: string;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/user/posts');
        const data = await res.json();
        setPosts(data.posts || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-gray-500">게시글을 불러오는 중...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">내가 쓴 게시글</h2>
      {posts.length === 0 ? (
        <div className="text-gray-400">작성한 게시글이 없습니다.</div>
      ) : (
        <ul className="space-y-4">
          {posts.map((post, idx) => (
            <li key={idx} className="p-5 bg-white rounded-xl shadow flex flex-col gap-1 border border-gray-100">
              <span className="text-lg font-semibold text-gray-800">{post.title}</span>
              <span className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}