'use client';

import { useEffect, useState } from 'react';
import { userAPI } from '@/lib/api';
import { HiUser, HiPencilSquare } from 'react-icons/hi2';

interface UserProfile {
  email?: string;
  name?: string;
  nickName?: string;
  phone?: string;
}

export default function MyProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getProfile();
        setProfile(res.data as UserProfile);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f9fb] py-16">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">마이페이지</h1>
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
            // onClick={() => router.push('/mypage/edit')}
          >
            <HiPencilSquare className="w-5 h-5" />
            정보수정
          </button>
        </div>

        {/* 내 정보 카드 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* 프로필 영역 */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
              <HiUser className="w-9 h-9 text-blue-500" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{profile?.nickName || '닉네임 없음'}</div>
              <div className="text-sm text-gray-400">{profile?.email || '-'}</div>
            </div>
          </div>
          {/* 테이블 형태 정보 */}
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
              <tbody>
                <tr className="hover:bg-blue-50 transition">
                  <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">이름</th>
                  <td className="py-2 pl-4 text-gray-800">{profile?.name || '-'}</td>
                </tr>
                <tr className="hover:bg-blue-50 transition">
                  <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">닉네임</th>
                  <td className="py-2 pl-4 text-gray-800">{profile?.nickName || '-'}</td>
                </tr>
                <tr className="hover:bg-blue-50 transition">
                  <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">이메일</th>
                  <td className="py-2 pl-4 text-gray-800">{profile?.email || '-'}</td>
                </tr>
                <tr className="hover:bg-blue-50 transition">
                  <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">전화번호</th>
                  <td className="py-2 pl-4 text-gray-800">{profile?.phone || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
