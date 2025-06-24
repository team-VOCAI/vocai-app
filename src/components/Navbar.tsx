import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='fixed top-0 left-0 w-full z-50 border-b border-[var(--gray-300)] bg-white shadow-sm'>
      <div className='max-w-5xl mx-auto flex justify-between items-center h-16 px-4 md:px-8'>
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
              href='/'
              className='text-base font-medium text-[var(--text-secondary)] px-2 py-1 rounded hover:bg-[var(--gray-100)] hover:text-[var(--text-accent)] transition-colors focus:outline-none'
            >
              커뮤니티
            </Link>
            <a
              href='#'
              className='text-base font-medium text-[var(--text-secondary)] px-2 py-1 rounded hover:bg-[var(--gray-100)] hover:text-[var(--text-accent)] transition-colors focus:outline-none'
            >
              면접 준비
            </a>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Link
            href='/signin'
            className='text-base font-semibold text-[var(--text-accent)] px-4 py-2 rounded-lg border border-[var(--primary)] bg-white hover:bg-[var(--primary)] hover:text-[var(--text-inverse)] transition-colors focus:outline-none'
          >
            로그인/회원가입
          </Link>
        </div>
      </div>
    </nav>
  );
}
