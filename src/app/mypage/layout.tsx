'use client';

import Navbar from '@/components/Navbar';
import { HiUser, HiDocumentText, HiUsers, HiBriefcase } from 'react-icons/hi2';

const SIDEBAR = [
  { label: '내 프로필', link: '/mypage/profile', icon: <HiUser className="w-5 h-5" /> },
  { label: '내가 쓴 게시글', link: '/mypage/posts', icon: <HiDocumentText className="w-5 h-5" /> },
  { label: '내 스터디', link: '/mypage/study', icon: <HiUsers className="w-5 h-5" /> },
  { label: '내 면접', link: '/mypage/interviews', icon: <HiBriefcase className="w-5 h-5" /> },
];

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
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
                    text-gray-600 hover:bg-gray-100
                  `}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
          {/* --- 페이지별 콘텐츠 --- */}
          <section className="flex-1 pt-10">
            {children}
          </section>
        </div>
      </main>
    </>
  );
}
