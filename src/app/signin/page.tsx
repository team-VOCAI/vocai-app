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
              <button
                type='submit'
                className='h-12 rounded-lg bg-[#2563EB] text-white font-bold text-base shadow hover:bg-[#1D4ED8] transition-colors'
              >
                로그인
              </button>
            </form>
            <div className='text-center mt-4 text-sm text-[#6B7280]'>
              회원이 아니시라면?{' '}
              <a
                href='/signup'
                className='font-bold text-[#2563EB] underline hover:text-[#1D4ED8] transition'
              >
                회원가입
              </a>
            </div>
            <div className='my-6 border-t border-[#E5E7EB]' />
            <button
              type='button'
              className='flex items-center justify-center w-full h-12 border border-[#D1D5DB] rounded-lg bg-white hover:bg-[#F3F4F6] transition-colors shadow-sm'
              aria-label='Google로 로그인'
            >
              <img src='/google.svg' alt='Google' className='w-6 h-6 mr-2' />
              <span className='font-medium text-[#1F2937]'>
                Google로 로그인
              </span>
            </button>
          </section>
        </ContainerX>
      </main>
    </div>
  );
}
