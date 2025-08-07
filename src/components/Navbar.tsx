'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authAPI, userAPI, ApiError } from '@/lib/api';
import {
  canStayAfterLogout,
  setCurrentPageAsRedirect,
  getLogoutRedirectUrl,
} from '@/lib/redirect';

// 사용자 프로필 타입 정의
interface UserProfile {
  name?: string;
  nickName?: string;
  email?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isCommunityPage = pathname.startsWith('/community');

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{
    nickName?: string;
    email?: string;
  } | null>(null);

  // 컴포넌트 마운트 시 토큰 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('🔍 인증 상태 확인 시작');

      // HttpOnly 쿠키는 클라이언트에서 읽을 수 없으므로
      // 서버 API를 호출하여 인증 상태 확인
      try {
        console.log('🔑 서버에서 토큰 유효성 확인 중...');
        const response = await userAPI.getProfile();

        console.log('📡 API 응답 상태:', response.status);
        const data = response.data as UserProfile;
        console.log('👤 받은 사용자 정보:', data);

        setIsLoggedIn(true);
        setUserInfo({
          nickName: data.nickName,
          email: data.email,
        });
        console.log('✅ 로그인 상태로 설정됨');
      } catch (error) {
        if (error instanceof ApiError) {
          console.log('❌ 인증 실패:', error.status);
        } else {
          console.log('❌ 네트워크 오류:', error);
        }
        setIsLoggedIn(false);
        setUserInfo(null);
      }

      console.log('🏁 인증 상태 확인 완료');
    };

    checkAuthStatus();
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      console.log('🚪 로그아웃 처리 중...');
      // 서버에 로그아웃 요청 (HttpOnly 쿠키 삭제)
      await authAPI.signout();
      console.log('✅ 서버에서 로그아웃 성공');
    } catch {
      console.log('⚠️ 서버 로그아웃 실패, 클라이언트 상태만 초기화');
    } finally {
      // 클라이언트 상태 초기화
      setIsLoggedIn(false);
      setUserInfo(null);
      console.log('🔄 클라이언트 상태 초기화 완료');

      // 현재 페이지에 머물 수 있는지 확인
      if (canStayAfterLogout(pathname)) {
        console.log('📍 현재 페이지에 머무름:', pathname);
        // 페이지 새로고침으로 로그아웃 상태 반영
        window.location.reload();
      } else {
        const redirectUrl = getLogoutRedirectUrl(pathname);
        console.log('🔄 페이지 이동:', pathname, '->', redirectUrl);
        router.push(redirectUrl);
      }
    }
  };

  // 로그인 페이지로 이동 (현재 페이지 저장)
  const handleLoginClick = () => {
    setCurrentPageAsRedirect();
    router.push('/signin');
  };

  return (
    <nav className='fixed top-0 left-0 w-full z-50 border-b border-[var(--gray-300)] bg-white shadow-sm'>
      <div
        className={`${
          isCommunityPage
            ? 'w-full px-4 md:px-8'
            : 'max-w-5xl mx-auto px-4 md:px-8'
        } flex justify-between items-center h-16`}
      >
        <div className='flex items-center gap-10'>
          <Link
            href='/'
            className='text-2xl font-extrabold tracking-tight text-[var(--text-accent)] select-none'
            aria-label='VOCAI 홈'
          >
            VOCAI
          </Link>
          <div className='hidden md:flex gap-6 ml-4'>
            <Link
              href='/community/boards/1'
              className='text-base font-medium text-[var(--text-secondary)] px-2 py-1 rounded hover:bg-[var(--gray-100)] hover:text-[var(--text-accent)] transition-colors focus:outline-none'
            >
              커뮤니티
            </Link>
            <Link
              href='/interview'
              className='text-base font-medium text-[var(--text-secondary)] px-2 py-1 rounded hover:bg-[var(--gray-100)] hover:text-[var(--text-accent)] transition-colors focus:outline-none'
            >
              면접 준비
            </Link>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {isLoggedIn ? (
            // 로그인된 상태 - 마이페이지와 로그아웃 버튼
            <div className='flex items-center gap-2'>
              {/* 사용자 정보 표시 */}
              <div className='hidden md:flex items-center gap-2 pr-4'>
                <span className='font-medium text-gray-600'>
                  {userInfo?.nickName}님
                </span>
              </div>

              {/* 마이페이지 버튼 */}
              <Link
                href='/mypage'
                className='text-base font-medium text-[var(--text-secondary)] px-2 py-1 rounded hover:bg-[var(--gray-100)] hover:text-[var(--text-accent)] transition-colors focus:outline-none'
                title='마이페이지'
              >
                MY
              </Link>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className='px-2 py-1 font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors'
                title='로그아웃'
              >
                로그아웃
              </button>
            </div>
          ) : (
            // 로그인되지 않은 상태 또는 로딩 중 - 로그인/회원가입 버튼
            <button
              onClick={handleLoginClick}
              className='text-base font-semibold text-[var(--text-accent)] px-4 py-2 rounded-lg border border-[var(--primary)] bg-white hover:bg-[var(--primary)] hover:text-[var(--text-inverse)] transition-colors focus:outline-none'
            >
              로그인/회원가입
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
