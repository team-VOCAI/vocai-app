'use client';

import { useEffect, useState } from 'react';
import { HiUser, HiPencilSquare, HiDocumentText, HiUsers, HiBriefcase } from 'react-icons/hi2';
import { userAPI } from '@/lib/api';
// import { useRouter } from 'next/navigation'; // 필요시 사용

// ---- 사이드바 메뉴 정의 ----
const SIDEBAR = [
  { label: '마이페이지', link: '/mypage', icon: <HiUser className="w-5 h-5" /> },
  { label: '내 프로필', link: '/mypage/profile', icon: <HiUser className="w-5 h-5" />, active: true },
  { label: '내가 쓴 게시글', link: '/mypage/posts', icon: <HiDocumentText className="w-5 h-5" /> },
  { label: '내 스터디', link: '/mypage/study', icon: <HiUsers className="w-5 h-5" /> },
  { label: '내 면접', link: '/mypage/interviews', icon: <HiBriefcase className="w-5 h-5" /> },
];

interface UserProfile {
  userId: number;
  email?: string;
  name?: string;
  profile?: {
    profileId: number;
    nickName?: string;
    phoneNum?: string;
  }
}

export default function MyProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await userAPI.getMe();
      setProfile(res.data as UserProfile);  // 타입 단언 추천!
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };
  fetchProfile();
}, []);

  return (
    <main className="min-h-screen bg-[#f7f9fb] pt-16">
      <div className="max-w-6xl mx-auto flex gap-8">
        {/* --- 사이드바 --- */}
        <aside className="w-64 pt-8">
          <div className="text-2xl font-bold text-gray-800 mb-8 ml-2">마이페이지</div>
          <nav className="flex flex-col gap-2">
            {SIDEBAR.map((item) => (
              <a
                key={item.link}
                href={item.link}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition
                  ${item.active
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* --- 정보 콘텐츠 (박스 없이 흰 배경, 여백많이) --- */}
        <section className="flex-1 pt-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <HiUser className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">
                  {profile?.profile?.nickName || '닉네임 없음'}
                  <span className="text-base text-gray-400 ml-2 font-normal">({profile?.name || '-'})</span>
                </div>
                <div className="text-sm text-gray-500">{profile?.email || '-'}</div>
              </div>
            </div>
          </div>
          {/* 정보 테이블 (박스X, 흰 배경 위 여백만) */}
          <div className="w-full">
            <table className="w-full max-w-xl border-separate border-spacing-y-2">
              <tbody>
                <tr>
                  <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">이름</th>
                  <td className="py-2 pl-4 text-gray-800">{profile?.name || '-'}</td>
                </tr>
                <tr>
                  <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">닉네임</th>
                  <td className="py-2 pl-4 text-gray-800">{profile?.profile?.nickName || '-'}</td>
                </tr>
                <tr>
                  <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">이메일</th>
                  <td className="py-2 pl-4 text-gray-800">{profile?.email || '-'}</td>
                </tr>
                <tr>
                  <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">전화번호</th>
                  <td className="py-2 pl-4 text-gray-800">{profile?.profile?.phoneNum || '-'}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end mt-8">
            <button
              className="flex items-center gap-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
              // onClick={() => router.push('/mypage/edit')}
            >
              <HiPencilSquare className="w-5 h-5" />
              정보수정
            </button>
          </div>
          </div>
        </section>
      </div>
    </main>
  );
}
