'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import ContainerX from '@/components/ContainerX';
import Footer from '@/components/Footer';
import { UserReviewCarousel } from '@/features/home/components';
import {
  HiLightBulb,
  HiVideoCamera,
  HiUsers,
  HiEye,
  HiHandThumbUp,
  HiChatBubbleLeftRight,
  HiChevronRight,
} from 'react-icons/hi2';

// 배너 데이터 타입 정의
interface BannerData {
  title: string;
  subtitle?: string;
  ctaText: string;
  backgroundImage: string;
}

// 배너 슬라이더 데이터
const bannerSlides: BannerData[] = [
  {
    title: 'AI와 함께 완벽한 면접 준비,\n이제 시작하세요',
    ctaText: 'AI 면접 무료 체험하기',
    backgroundImage: '/hero-banner1.png',
  },
  {
    title: '실시간 AI 피드백으로\n면접 실력 향상',
    subtitle: '당신의 답변을 즉시 분석하고 개선점을 제안합니다',
    ctaText: '실시간 피드백 체험하기',
    backgroundImage: '/hero-banner2.png',
  },
  {
    title: '화상 면접 연습으로\n자신감을 키워보세요',
    subtitle: '실제 면접관과의 1:1 모의면접으로 완벽 준비',
    ctaText: '화상 면접 연습하기',
    backgroundImage: '/hero-banner3.png',
  },
  {
    title: '커뮤니티에서 면접 정보를\n공유하고 성장하세요',
    subtitle: '기업별 면접 후기와 질문 데이터베이스 활용',
    ctaText: '커뮤니티 둘러보기',
    backgroundImage: '/hero-banner4.png',
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 4초마다 자동으로 다음 슬라이드로 전환
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);

      // 애니메이션 시작 후 슬라이드 변경
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // 수동 슬라이드 변경 함수
  const handleSlideChange = (index: number) => {
    if (index === currentSlide || isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
  };

  // 현재 슬라이드 데이터
  const currentBanner = bannerSlides[currentSlide];

  return (
    <div className='min-h-screen flex flex-col bg-[var(--gray-100)] font-pretendard'>
      <Navbar />

      {/* 히어로 섹션 - 슬라이더 */}
      <section className='relative flex-1 flex flex-col items-center justify-center pt-16 min-h-[500px] overflow-hidden'>
        {/* 배경 이미지들 - 레이어드 구조로 페이드 효과 */}
        {bannerSlides.map((slide, index) => (
          <Image
            key={`bg-${index}`}
            src={slide.backgroundImage}
            alt={`Hero background ${index + 1}`}
            fill
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0}
          />
        ))}

        {/* 배경 오버레이 */}
        <div className='absolute inset-0 bg-black/30'></div>

        <ContainerX>
          <div className='relative text-center max-w-4xl mx-auto z-10'>
            {/* 슬라이드 콘텐츠 - 부드러운 전환 애니메이션 */}
            <div
              className={`transition-all duration-700 ease-in-out transform ${
                isTransitioning
                  ? 'opacity-0 translate-y-4 scale-95'
                  : 'opacity-100 translate-y-0 scale-100'
              }`}
            >
              <h1 className='text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight whitespace-pre-line'>
                {currentBanner.title}
              </h1>

              {/* 부제목이 있는 경우에만 표시 */}
              {currentBanner.subtitle && (
                <p className='text-xl text-white/90 mb-6 leading-relaxed'>
                  {currentBanner.subtitle}
                </p>
              )}

              {/* CTA 버튼 */}
              <button className='bg-[var(--primary)] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[var(--primary-hover)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105'>
                {currentBanner.ctaText}
              </button>
            </div>
          </div>
        </ContainerX>

        {/* 페이지네이션 점들 - 배너 하단 고정 */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10'>
          <div className='flex justify-center gap-2'>
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                disabled={isTransitioning}
                className={`rounded-full transition-all duration-500 ease-out ${
                  index === currentSlide
                    ? 'bg-white w-8 h-2'
                    : 'bg-white/50 hover:bg-white/70 w-2 h-2'
                } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 서비스 소개 섹션 */}
      <section className='py-16 bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/30'>
        <ContainerX>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-[var(--text-primary)] mb-4'>
              지금 경험해보세요!
            </h2>
            <p className='text-lg text-[var(--text-secondary)] max-w-2xl mx-auto'>
              VOCAI만의 혁신적인 AI 기술로 완벽한 면접 준비를 도와드립니다
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {/* AI 면접 시스템 */}
            <div className='group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-blue-100 hover:border-[var(--primary)]/30 transform hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <HiLightBulb className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-[var(--text-primary)] mb-4'>
                AI 면접 시스템
              </h3>
              <ul className='space-y-3 text-[var(--text-secondary)]'>
                <li className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-[var(--primary)] rounded-full'></div>
                  실시간 음성 인식으로 답변 분석
                </li>
                <li className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-[var(--primary)] rounded-full'></div>
                  개인 맞춤형 피드백 제공
                </li>
                <li className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-[var(--primary)] rounded-full'></div>
                  면접 상황별 맞춤 질문 제공
                </li>
              </ul>
            </div>

            {/* 화상 면접 연습 */}
            <div className='group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-emerald-100 hover:border-[var(--secondary)]/30 transform hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-br from-[var(--secondary)] to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <HiVideoCamera className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-[var(--text-primary)] mb-4'>
                화상 면접 연습
              </h3>
              <ul className='space-y-3 text-[var(--text-secondary)]'>
                <li className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-[var(--secondary)] rounded-full'></div>
                  실제 면접관과 1:1 모의면접
                </li>
                <li className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-[var(--secondary)] rounded-full'></div>
                  면접 전 과정 녹화 및 재생
                </li>
                <li className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-[var(--secondary)] rounded-full'></div>
                  즉시 피드백 및 평가 제공
                </li>
              </ul>
            </div>

            {/* 커뮤니티 및 스터디 */}
            <div className='group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-amber-100 hover:border-[var(--accent)]/30 transform hover:-translate-y-2'>
              <div className='w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                <HiUsers className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-[var(--text-primary)] mb-4'>
                커뮤니티 및 스터디
              </h3>
              <ul className='space-y-3 text-[var(--text-secondary)]'>
                <li className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-[var(--accent)] rounded-full'></div>
                  기업별 면접 정보 제공
                </li>
                <li className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-[var(--accent)] rounded-full'></div>
                  면접 후기 및 질문 데이터베이스
                </li>
                <li className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-[var(--accent)] rounded-full'></div>
                  스터디 그룹 매칭
                </li>
              </ul>
            </div>
          </div>
        </ContainerX>
      </section>

      {/* 인기 면접 후기 + 실시간 면접 질문 섹션 */}
      <section className='py-20 bg-gradient-to-b from-gray-50 to-white'>
        <ContainerX>
          <div className='grid lg:grid-cols-2 gap-12'>
            {/* 인기 면접 후기 */}
            <div>
              <div className='flex justify-between items-center mb-8'>
                <div>
                  <h3 className='text-2xl font-bold text-[var(--text-primary)] mb-2'>
                    인기 면접 후기
                  </h3>
                  <p className='text-sm text-[var(--text-muted)]'>
                    실제 면접 경험을 공유한 생생한 후기들
                  </p>
                </div>
                <a
                  href='#'
                  className='text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors flex items-center gap-1'
                >
                  더보기
                  <HiChevronRight className='w-4 h-4' />
                </a>
              </div>

              <div className='grid grid-cols-1 gap-4'>
                {[
                  {
                    tag: '삼성',
                    title: '삼성전자 기획직 면접 후기',
                    excerpt:
                      '팀 내에서 갈등이 발생했을 때 어떻게 해결하시겠습니까? 이런 상황적 질문들이 많이 나왔고, 실제 업무 경험과 연결지어 답변하는 것이 중요했습니다. 면접관들이 구체적인 사례를 요구하셨어요.',
                    time: '2시간 전',
                    views: '1.2k',
                    likes: 24,
                    comments: 8,
                  },
                  {
                    tag: '네이버',
                    title: '네이버 신입 개발자 면접 경험담',
                    excerpt:
                      '기술 스택에 대한 깊이 있는 질문들이 많이 나왔어요. React, Node.js, 데이터베이스 설계까지 전반적으로 물어보셨고, 특히 최적화 경험에 대해 자세히 질문하셨습니다.',
                    time: '5시간 전',
                    views: '856',
                    likes: 18,
                    comments: 12,
                  },
                  {
                    tag: '카카오',
                    title: '카카오 개발팀 면접 후기',
                    excerpt:
                      '알고리즘 문제와 시스템 설계에 대한 질문이 인상적이었습니다.',
                    time: '1일 전',
                    views: '632',
                    likes: 15,
                    comments: 6,
                  },
                  {
                    tag: '토스',
                    title: '토스 운영팀 면접 후기',
                    excerpt:
                      '문화적 fit에 대한 질문들이 많았습니다. 토스의 핵심 가치와 본인의 가치관이 얼마나 일치하는지, 빠르게 변화하는 환경에서 어떻게 적응할 수 있는지에 대한 질문이 인상적이었어요.',
                    time: '2024.12.14 14:32',
                    views: '1.8k',
                    likes: 32,
                    comments: 15,
                  },
                  {
                    tag: 'LG',
                    title: 'LG화학 연구개발직 면접 경험',
                    excerpt:
                      '화학 전공 지식과 실무 적용 능력을 중점적으로 평가받았습니다. 특히 신소재 개발 프로젝트 경험과 논문 내용에 대해 깊이 있게 질문하셨고, 향후 연구 방향성에 대한 견해도 물어보셨어요.',
                    time: '2024.12.13 09:45',
                    views: '924',
                    likes: 28,
                    comments: 9,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className='group bg-white rounded-xl border border-gray-200 hover:border-[var(--primary)]/30 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer h-44 flex flex-col'
                  >
                    {/* 상단: 태그와 시간 */}
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-xs font-medium text-[var(--text-muted)] bg-gray-100 px-2 py-1 rounded-full'>
                        {item.tag}
                      </span>
                      <span className='text-xs text-[var(--text-muted)]'>
                        {item.time}
                      </span>
                    </div>

                    {/* 제목 */}
                    <h4 className='font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-1'>
                      {item.title}
                    </h4>

                    {/* 내용 미리보기 */}
                    <p className='text-sm text-[var(--text-secondary)] mb-3 line-clamp-2 flex-1'>
                      {item.excerpt}
                    </p>

                    {/* 하단: 메타 정보 */}
                    <div className='flex items-center justify-between mt-auto'>
                      <div className='flex items-center gap-4 text-xs text-[var(--text-muted)]'>
                        <div className='flex items-center gap-1'>
                          <HiEye className='w-4 h-4' />
                          {item.views}
                        </div>
                        <div className='flex items-center gap-1'>
                          <HiHandThumbUp className='w-4 h-4' />
                          {item.likes}
                        </div>
                        <div className='flex items-center gap-1'>
                          <HiChatBubbleLeftRight className='w-4 h-4' />
                          {item.comments}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 실시간 면접 질문 */}
            <div>
              <div className='flex justify-between items-center mb-8'>
                <div>
                  <h3 className='text-2xl font-bold text-[var(--text-primary)] mb-2'>
                    최근 취업 질문
                  </h3>
                  <p className='text-sm text-[var(--text-muted)]'>
                    최근 올라온 취업 관련 질문들을 확인해보세요
                  </p>
                </div>
                <a
                  href='#'
                  className='text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors flex items-center gap-1'
                >
                  더보기
                  <HiChevronRight className='w-4 h-4' />
                </a>
              </div>

              <div className='grid grid-cols-1 gap-4'>
                {[
                  {
                    company: '삼성',
                    title: '카카오 지원하려고 하는데 저 괜찮을까요?',
                    description:
                      '안녕하세요. 현재 대학교 4학년이고 컴퓨터공학과입니다. 카카오에 신입으로 지원하려고 하는데 제 스펙으로 괜찮을지 궁금해서 질문드립니다.',
                    category: '기획',
                    time: '1시간 전',
                    views: '425',
                    likes: 12,
                    comments: 8,
                  },
                  {
                    company: '네이버',
                    title: '면접 준비 어떻게 하셨나요?',
                    description:
                      '다음 주에 네이버 신입 면접이 있는데 너무 떨려요. 기술 면접과 인성 면접 준비 방법이 궁금합니다. 경험자분들의 조언 부탁드려요. 특히 코딩 테스트는 통과했지만 면접에서 항상 떨어져서 정말 걱정이에요. 어떤 준비를 해야 할까요?',
                    category: '개발',
                    time: '3시간 전',
                    views: '782',
                    likes: 24,
                    comments: 15,
                  },
                  {
                    company: '카카오',
                    title: '대기업 vs 스타트업 고민입니다',
                    description:
                      '대기업 최종합격과 스타트업 오퍼를 동시에 받았는데 어디를 선택해야 할지 모르겠어요. 각각의 장단점이 궁금합니다.',
                    category: '디자인',
                    time: '5시간 전',
                    views: '1.1k',
                    likes: 36,
                    comments: 22,
                  },
                  {
                    company: '토스',
                    title: '신입 연봉 협상 가능한가요?',
                    description:
                      '토스에서 오퍼를 받았는데 연봉이 생각보다 낮아서요. 신입도 연봉 협상이 가능한지, 어떻게 접근해야 하는지 궁금합니다. 다른 회사들과 비교해보니 시장 평균보다 조금 낮은 것 같아서 고민이에요. 혹시 경험이 있으신 분들의 조언을 듣고 싶습니다.',
                    category: '마케팅',
                    time: '1일 전',
                    views: '593',
                    likes: 18,
                    comments: 11,
                  },
                  {
                    company: '구글',
                    title: '경력직 이직 타이밍 질문',
                    description:
                      '현재 3년차 개발자인데 구글 코리아로 이직을 고려하고 있습니다. 언제가 가장 좋은 타이밍일까요? 준비해야 할 것들도 알려주세요.',
                    category: '기획',
                    time: '2일 전',
                    views: '344',
                    likes: 9,
                    comments: 6,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className='group bg-white rounded-xl border border-gray-200 hover:border-[var(--primary)]/30 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer h-44 flex flex-col'
                  >
                    {/* 상단: 기업명, 직무, 시간, 라이브 상태 */}
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs font-medium text-[var(--text-muted)] bg-gray-100 px-2 py-1 rounded-full'>
                          {item.company}
                        </span>
                        <span className='text-xs text-[var(--primary)] bg-blue-50 px-2 py-1 rounded-full'>
                          {item.category}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs text-[var(--text-muted)]'>
                          {item.time}
                        </span>
                      </div>
                    </div>

                    {/* 제목 */}
                    <h4 className='font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-1'>
                      {item.title}
                    </h4>

                    {/* 본문 내용 */}
                    <p className='text-sm text-[var(--text-secondary)] mb-3 line-clamp-2 flex-1'>
                      {item.description}
                    </p>

                    {/* 하단: 메타 정보 */}
                    <div className='flex items-center gap-4 text-xs text-[var(--text-muted)] mt-auto'>
                      <div className='flex items-center gap-1'>
                        <HiEye className='w-4 h-4' />
                        {item.views}
                      </div>
                      <div className='flex items-center gap-1'>
                        <HiHandThumbUp className='w-4 h-4' />
                        {item.likes}
                      </div>
                      <div className='flex items-center gap-1'>
                        <HiChatBubbleLeftRight className='w-4 h-4' />
                        {item.comments}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ContainerX>
      </section>

      {/* 사용자 후기 섹션 */}
      <section className='py-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden'>
        {/* 배경 패턴 */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl'></div>
        </div>

        <ContainerX>
          <div className='relative z-10'>
            <div className='text-center mb-6'>
              <h2 className='text-4xl font-bold mb-4'>
                실제 사용자들의 생생한 후기
              </h2>
              <p className='text-xl text-blue-100 max-w-2xl mx-auto'>
                VOCAI를 통해 꿈의 직장에 합격한 사용자들의 이야기를 들어보세요
              </p>
            </div>

            <UserReviewCarousel />
          </div>
        </ContainerX>
      </section>

      <Footer />
    </div>
  );
}
