import React from 'react';
import Link from 'next/link';
import ContainerX from '@/components/ContainerX';

export default function Footer() {
  return (
    <footer className='bg-white'>
      {/* 메인 푸터 */}
      <div className='bg-[var(--gray-100)] text-[var(--text-primary)]'>
        <ContainerX>
          {/* 푸터 콘텐츠 */}
          <div className='pt-16 pb-8'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12'>
              {/* 브랜드 및 회사 정보 */}
              <div className='md:col-span-2'>
                <Link
                  href='/'
                  className='text-2xl font-extrabold tracking-tight text-[var(--text-primary)] select-none mb-6 inline-block'
                  aria-label='VOCAI 홈'
                >
                  VOCAI
                </Link>
                <p className='text-[var(--text-secondary)] text-sm leading-relaxed mb-6'>
                  AI와 함께하는 완벽한 면접 준비
                  <br />
                  당신의 면접 성공을 위한 최고의 파트너
                </p>

                {/* 회사 정보 */}
                <div className='text-[var(--text-secondary)] text-sm space-y-1 mb-6'>
                  <p>
                    <span className='font-medium'>(주)보카이</span>
                  </p>
                  <p>대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
                  <p>통신판매업신고: 2024-서울강남-1234</p>
                  <p>주소: 서울시 강남구 테헤란로 123, 4층</p>
                  <p>이메일: support@vocai.com | 고객센터: 1588-0000</p>
                  <p>평일 09:00 - 18:00 (점심시간 12:00 - 13:00)</p>
                </div>
              </div>

              {/* 서비스 링크 */}
              <div>
                <h4 className='text-[var(--text-primary)] font-semibold mb-6 text-lg'>
                  서비스
                </h4>
                <ul className='space-y-3'>
                  <li>
                    <a
                      href='#'
                      className='text-[var(--text-secondary)] text-sm hover:text-[var(--primary)] transition-colors'
                    >
                      AI 면접 연습
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-[var(--text-secondary)] text-sm hover:text-[var(--primary)] transition-colors'
                    >
                      화상 면접 준비
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-[var(--text-secondary)] text-sm hover:text-[var(--primary)] transition-colors'
                    >
                      면접 커뮤니티
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-[var(--text-secondary)] text-sm hover:text-[var(--primary)] transition-colors'
                    >
                      스터디 매칭
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-[var(--text-secondary)] text-sm hover:text-[var(--primary)] transition-colors'
                    >
                      면접 후기
                    </a>
                  </li>
                </ul>
              </div>

              {/* 고객지원 */}
              <div>
                <h4 className='text-[var(--text-primary)] font-semibold mb-6 text-lg'>
                  고객지원
                </h4>
                <ul className='space-y-3'>
                  <li>
                    <a
                      href='#'
                      className='text-[var(--text-secondary)] text-sm hover:text-[var(--primary)] transition-colors'
                    >
                      공지사항
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-[var(--text-secondary)] text-sm hover:text-[var(--primary)] transition-colors'
                    >
                      자주 묻는 질문
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-[var(--text-secondary)] text-sm hover:text-[var(--primary)] transition-colors'
                    >
                      문의하기
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-[var(--text-secondary)] text-sm hover:text-[var(--primary)] transition-colors'
                    >
                      이용가이드
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='text-[var(--text-secondary)] text-sm hover:text-[var(--primary)] transition-colors'
                    >
                      기업 문의
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 하단 링크 및 저작권 */}
          <div className='border-t border-[var(--gray-300)] py-6'>
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
              {/* 하단 링크들 */}
              <div className='flex flex-wrap gap-6 text-sm'>
                <a
                  href='#'
                  className='text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors'
                >
                  이용약관
                </a>
                <a
                  href='#'
                  className='text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors font-semibold'
                >
                  개인정보보호방침
                </a>
                <a
                  href='#'
                  className='text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors'
                >
                  사업자정보
                </a>
                <a
                  href='#'
                  className='text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors'
                >
                  채용정보
                </a>
                <a
                  href='#'
                  className='text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors'
                >
                  제휴문의
                </a>
              </div>

              {/* 저작권 */}
              <div className='text-[var(--text-muted)] text-sm'>
                © 2025 VOCAI All rights reserved.
              </div>
            </div>
          </div>
        </ContainerX>
      </div>
    </footer>
  );
}
