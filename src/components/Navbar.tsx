import React from 'react';

export default function Navbar() {
  return (
    <nav className='fixed top-0 left-0 w-full z-50 border-b border-[#E5E7EB] bg-white shadow-sm'>
      <div className='max-w-5xl mx-auto flex justify-between items-center h-16 px-4 md:px-8'>
        <div className='flex items-center gap-10'>
          <a
            href='/home'
            className='text-2xl font-extrabold tracking-tight text-[#2563EB] select-none'
            aria-label='VOCAI 홈'
          >
            VOCAI
          </a>
          <div className='hidden md:flex gap-6 ml-4'>
            <a
              href='#'
              className='text-base font-medium text-[#374151] px-2 py-1 rounded hover:bg-[#F3F4F6] hover:text-[#2563EB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]'
            >
              커뮤니티
            </a>
            <a
              href='#'
              className='text-base font-medium text-[#374151] px-2 py-1 rounded hover:bg-[#F3F4F6] hover:text-[#2563EB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]'
            >
              면접 준비
            </a>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <a
            href='#'
            className='text-base font-semibold text-[#2563EB] px-4 py-2 rounded-lg border border-[#2563EB] bg-white hover:bg-[#2563EB] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]'
          >
            로그인/회원가입
          </a>
        </div>
      </div>
    </nav>
  );
}
