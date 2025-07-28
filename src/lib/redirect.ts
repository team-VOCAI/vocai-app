// 로그인 후 리다이렉트 관리 유틸리티

const REDIRECT_KEY = 'redirectAfterLogin';

// 로그인 후 돌아가면 안 되는 페이지들
const FORBIDDEN_REDIRECT_PATHS = [
  '/signin',
  '/signup',
  '/auth',
  '/error',
  '/404',
  '/500',
];

// 로그아웃 후 머물러도 되는 페이지들 (로그인 없이 접근 가능)
const ALLOWED_AFTER_LOGOUT_PATHS = ['/', '/community', '/about', '/contact'];

// 로그아웃 후에도 현재 페이지에 머물 수 있는지 확인
export const canStayAfterLogout = (pathname: string): boolean => {
  // 메인 페이지나 커뮤니티는 로그아웃 후에도 접근 가능
  if (pathname === '/' || pathname.startsWith('/community')) {
    return true;
  }

  // 기타 공개 페이지들
  return ALLOWED_AFTER_LOGOUT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path)
  );
};

// 로그인 후 리다이렉트 URL 저장
export const setRedirectUrl = (url: string) => {
  // 금지된 경로인지 확인
  const isForbidden = FORBIDDEN_REDIRECT_PATHS.some((path) =>
    url.startsWith(path)
  );

  if (!isForbidden && typeof window !== 'undefined') {
    sessionStorage.setItem(REDIRECT_KEY, url);
  }
};

// 현재 페이지를 리다이렉트 URL로 저장
export const setCurrentPageAsRedirect = () => {
  if (typeof window !== 'undefined') {
    setRedirectUrl(window.location.pathname + window.location.search);
  }
};

// 저장된 리다이렉트 URL 가져오기
export const getRedirectUrl = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(REDIRECT_KEY);
  }
  return null;
};

// 리다이렉트 URL 제거
export const clearRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(REDIRECT_KEY);
  }
};

// 로그인 후 적절한 페이지로 리다이렉트
export const redirectAfterLogin = (): string => {
  const savedUrl = getRedirectUrl();
  clearRedirectUrl();

  // 저장된 URL이 있고 유효하면 해당 URL로, 없으면 메인으로
  if (
    savedUrl &&
    !FORBIDDEN_REDIRECT_PATHS.some((path) => savedUrl.startsWith(path))
  ) {
    return savedUrl;
  }

  return '/';
};
