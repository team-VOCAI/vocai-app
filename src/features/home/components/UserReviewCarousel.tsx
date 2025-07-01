'use client';

import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { HiStar } from 'react-icons/hi2';

interface Review {
  name: string;
  company: string;
  position: string;
  rating: number;
  comment: string;
}

const reviews: Review[] = [
  {
    name: '김민수',
    company: '삼성전자',
    position: '소프트웨어 엔지니어',
    rating: 5,
    comment:
      'AI 피드백 덕분에 면접에서 자신감을 가질 수 있었어요. 특히 답변 구조화에 큰 도움이 되었습니다.',
  },
  {
    name: '이지은',
    company: '네이버',
    position: 'UX 디자이너',
    rating: 4,
    comment:
      '실시간 면접 연습으로 떨림을 극복했어요. 녹화 기능으로 객관적으로 제 모습을 볼 수 있어서 좋았습니다.',
  },
  {
    name: '박준호',
    company: '카카오',
    position: '데이터 분석가',
    rating: 5,
    comment:
      '커뮤니티에서 얻은 정보가 실제 면접에 정말 유용했어요. 합격률이 확실히 높아졌습니다.',
  },
  {
    name: '최예린',
    company: '토스',
    position: '프로덕트 매니저',
    rating: 5,
    comment:
      '체계적인 면접 준비가 가능해서 단기간에 실력 향상을 느낄 수 있었어요. 강력 추천합니다!',
  },
  {
    name: '이성민',
    company: 'LG전자',
    position: 'AI 연구원',
    rating: 4,
    comment:
      '다양한 면접 시나리오로 연습할 수 있어서 실제 면접에서 당황하지 않았어요. 추천합니다.',
  },
  {
    name: '정하은',
    company: '쿠팡',
    position: '백엔드 개발자',
    rating: 5,
    comment:
      '개발자 면접에 특화된 질문들이 정말 도움이 되었어요. 기술 면접 준비에 최고입니다.',
  },
  {
    name: '윤태훈',
    company: '현대자동차',
    position: '품질관리 전문가',
    rating: 4,
    comment:
      'AI 분석을 통한 피드백이 구체적이고 실용적이었습니다. 면접 실력이 눈에 띄게 향상되었어요.',
  },
];

export default function UserReviewCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    loop: true,
    breakpoints: {
      '(min-width: 1024px)': { slidesToScroll: 4 },
    },
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className='relative'>
      <div className='overflow-hidden min-h-[300px]' ref={emblaRef}>
        <div className='flex'>
          {reviews.map((review, index) => (
            <div
              key={index}
              className='flex-[0_0_100%] min-w-0 p-2 md:flex-[0_0_50%] lg:flex-[0_0_25%] min-h-[270px]'
            >
              <div className='bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:transform hover:-translate-y-2 h-full my-2'>
                <div className='mb-4'>
                  <p className='font-semibold mb-1'>{review.name}</p>
                  <p className='text-sm text-blue-200'>
                    {review.company} · {review.position}
                  </p>
                </div>

                {/* 별점 */}
                <div className='flex mb-4'>
                  {Array.from({ length: review.rating }, (_, i) => (
                    <HiStar key={i} className='w-5 h-5 text-yellow-400' />
                  ))}
                </div>

                <p className='text-blue-100 text-sm leading-relaxed'>
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 화살표 버튼 - 무한 루프이므로 항상 양쪽 모두 표시 */}
      <button
        className='absolute -left-5 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-full p-3 transition-all duration-300 border border-white/30'
        onClick={scrollPrev}
        aria-label='이전 후기 보기'
      >
        <IoChevronBack className='w-6 h-6 text-white' />
      </button>

      <button
        className='absolute -right-5 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-full p-3 transition-all duration-300 border border-white/30'
        onClick={scrollNext}
        aria-label='다음 후기 보기'
      >
        <IoChevronForward className='w-6 h-6 text-white' />
      </button>
    </div>
  );
}
