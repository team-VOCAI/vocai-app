'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiBriefcase } from 'react-icons/hi2';
import { userAPI } from '@/lib/api';

interface Session {
  sessionId: number;
  title: string | null;
  createdAt: string;
}

export default function MyInterviewsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await userAPI.getMyInterviews();
        setSessions(res.data.sessions || []);
      } catch {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">면접 기록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-[400px] pl-2">
      <h2 className="text-2xl font-bold mb-8">내 면접</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-gray-700">
            <div className="col-span-1 text-center">번호</div>
            <div className="col-span-7 text-center">제목</div>
            <div className="col-span-4 text-center">날짜</div>
          </div>
        </div>
        {sessions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {sessions.map((s, index) => (
              <div
                key={s.sessionId}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/interview/ai?sessionId=${s.sessionId}`)}
              >
                <div className="col-span-1 text-center text-sm text-gray-600">
                  {sessions.length - index}
                </div>
                <div className="col-span-7 flex items-center">
                  <span className="text-gray-900 font-medium">
                    {s.title ?? `세션 ${s.sessionId}`}
                  </span>
                </div>
                <div className="col-span-4 text-center text-sm text-gray-600">
                  {new Date(s.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiBriefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              아직 면접 기록이 없습니다
            </h3>
            <p className="text-gray-600 mb-8">새로운 면접을 시작해보세요!</p>
            <Link
              href="/interview/ai"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              면접 보러가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
