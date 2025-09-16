// 게시판 관련 타입 정의
export interface BoardInfo {
  name: string;
  description: string;
}

export interface CategoryInfo {
  name: string;
  defaultId: string;
}

export interface JobCategory {
  value: string;
  label: string;
}

// 카테고리 정보 매핑
export const getCategoryInfo = (boardId: string): CategoryInfo | null => {
  if (['1', '2', '3', '4'].includes(boardId)) {
    return { name: '취업 정보', defaultId: '1' };
  } else if (['5', '6'].includes(boardId)) {
    return { name: '자유게시판', defaultId: '5' };
  } else if (['7', '8'].includes(boardId)) {
    return { name: '스터디 모집', defaultId: '7' };
  }
  return null;
};

// 게시판 정보 매핑
export const boardInfo: Record<string, BoardInfo> = {
  '1': {
    name: '기업별 취업 정보',
    description:
      '기업별, 직군별 채용 정보와 다양한 취업 정보를 공유하는 공간입니다.',
  },
  '2': {
    name: '면접 후기',
    description: '실제 면접 경험담과 후기를 공유하는 공간입니다.',
  },
  '3': {
    name: '취업 질문',
    description: '취업 관련 궁금한 점을 묻고 답변하는 공간입니다.',
  },
  '4': {
    name: '취업 자료 공유',
    description: '이력서, 자소서 등 취업 자료를 공유하는 공간입니다.',
  },
  '5': {
    name: '잡담방',
    description: '자유롭게 이야기하는 공간입니다.',
  },
  '6': {
    name: '고민상담',
    description: '진로와 고민을 나누는 공간입니다.',
  },
  '7': {
    name: '스터디 목록',
    description: '스터디 그룹 모집 및 참여하는 공간입니다.',
  },
  '8': {
    name: '스터디 후기',
    description: '스터디 경험담과 후기를 공유하는 공간입니다.',
  },
};

// 직무 카테고리 옵션
export const jobCategories: JobCategory[] = [
  { value: 'FE', label: '프론트엔드' },
  { value: 'BE', label: '백엔드' },
  { value: 'FS', label: '풀스택' },
  { value: 'iOS', label: 'iOS' },
  { value: 'AOS', label: '안드로이드' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'DATA', label: '데이터분석' },
  { value: 'AI', label: 'AI/ML' },
  { value: 'GAME', label: '게임개발' },
  { value: 'UX', label: 'UX/UI' },
  { value: 'PM', label: '기획' },
  { value: 'QA', label: 'QA' },
  { value: 'SECURITY', label: '보안' },
  { value: 'CLOUD', label: '클라우드' },
  { value: 'BLOCKCHAIN', label: '블록체인' },
  { value: '기타', label: '기타' },
];

// 대표 기업 목록
export const companies: string[] = [
  '네이버',
  '카카오',
  '삼성',
  'LG',
  '라인',
  '토스',
  '쿠팡',
  '배민',
  '야놀자',
  '당근마켓',
  'SKT',
  'KT',
  '현대차',
  'NHN',
  '넥슨',
  'NC소프트',
  '스마일게이트',
  '컴투스',
  '우아한형제들',
  '버즈빌',
  '마켓컬리',
  '뱅크샐러드',
  '하이퍼커넥트',
  '리디',
  '직방',
  '구글',
  '마이크로소프트',
  '아마존',
  '메타',
  '애플',
  '테슬라',
  '넷플릭스',
  '에어비앤비',
  '기타',
];

// 카테고리별 게시판 그룹핑 (CommunitySidebar용)
export const categoryGroups = [
  {
    title: '취업 정보',
    boardIds: ['1', '2', '3', '4'],
  },
  {
    title: '자유게시판',
    boardIds: ['5', '6'],
  },
  {
    title: '스터디 모집',
    boardIds: ['7', '8'],
  },
];
