import React from 'react';
import Navbar from '@/components/Navbar';
import ContainerX from '@/components/ContainerX';

export default function SignInPage() {
  return (
    <div className='min-h-screen flex flex-col bg-[#F3F4F6] font-pretendard'>
      <Navbar />
      {/* 로그인 폼 */}
      <main className='flex-1 flex flex-col items-center justify-center pt-16'>
        <ContainerX>
          <section className='w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 mx-auto'>
            <h1 className='text-3xl font-bold text-center text-[#1F2937] mb-8 tracking-tight'>
              로그인
            </h1>
            <form className='flex flex-col gap-5'>
              <div>
                <input
                  type='text'
                  placeholder='아이디'
                  className='w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-base placeholder:text-gray-400 transition'
                  autoComplete='username'
                  aria-label='아이디'
                />
              </div>
              <div>
                <input
                  type='password'
                  placeholder='비밀번호'
                  className='w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-base placeholder:text-gray-400 transition'
                  autoComplete='current-password'
                  aria-label='비밀번호'
                />
              </div>
              {/* 로그인 버튼 */}
              <button
                type='submit'
                className='w-full py-2 mt-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors'
              >
                로그인
              </button>
            </form>
            {/* 회원가입 링크 */}
            <p className='mt-4 text-center text-sm text-gray-600'>
              계정이 없으신가요?{' '}
              <a href='/signup' className='text-blue-600 hover:underline'>
                회원가입
              </a>
            </p>
            {/* 구분선 */}
            <div className='my-6 border-t border-gray-200' />
            {/* Google 로그인 버튼 (디자인 시스템 및 가이드라인 적용) */}
            <button
              type='button'
              // 실제 구글 로그인 연동 시 onClick에 signIn('google') 등 연결
              className='flex items-center justify-center w-full border border-[#D1D5DB] rounded-lg py-2 px-4 shadow-sm bg-white hover:bg-[#F3F4F6] transition focus:outline-none focus:ring-2 focus:ring-blue-500'
              style={{
                fontFamily: 'Roboto, Arial, sans-serif',
                fontWeight: 500,
              }}
            >
              <img
                src='https://developers.google.com/identity/images/g-logo.png'
                alt='Google Logo'
                className='w-5 h-5 mr-2'
              />
              {/* 텍스트 색상을 더 진하게(Tailwind gray-800, #1F2937) */}
              <span className='text-sm font-medium text-[#1F2937]'>
                Google로 로그인
              </span>
            </button>
          </section>
        </ContainerX>
      </main>
    </div>
  );
}
