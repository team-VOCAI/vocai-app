// 에러 메시지 매핑 함수
export const getErrorMessage = (
  status: number,
  url?: string,
  serverMessage?: string
): string => {
  // URL별 특화된 에러 메시지
  if (url?.includes('/auth/signin')) {
    // 보안상 로그인 실패 시 구체적인 정보를 제공하지 않음
    // 계정 열거 공격(Username Enumeration) 방지
    switch (status) {
      case 401:
        return '아이디 또는 비밀번호를 확인해주세요.';
      case 400:
        return '아이디 또는 비밀번호를 확인해주세요.';
      case 429:
        return '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
      default:
        return '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  }

  // 서버에서 제공한 에러 메시지가 있으면 사용 (로그인 외의 경우)
  if (serverMessage && !url?.includes('/auth/signin')) {
    return serverMessage;
  }

  if (url?.includes('/auth/signup')) {
    switch (status) {
      case 409:
        return '이미 가입된 이메일입니다.';
      case 400:
        return '입력한 정보를 다시 확인해주세요.';
      default:
        return '회원가입 중 오류가 발생했습니다.';
    }
  }

  if (url?.includes('/boards/')) {
    switch (status) {
      case 404:
        return '게시글을 찾을 수 없습니다.';
      case 403:
        return '게시글에 접근할 권한이 없습니다.';
      default:
        return '게시글 처리 중 오류가 발생했습니다.';
    }
  }

  if (url?.includes('/comments/')) {
    switch (status) {
      case 404:
        return '댓글을 찾을 수 없습니다.';
      case 403:
        return '댓글을 수정/삭제할 권한이 없습니다.';
      default:
        return '댓글 처리 중 오류가 발생했습니다.';
    }
  }

  // 일반적인 HTTP 상태 코드 메시지
  switch (status) {
    case 400:
      return '잘못된 요청입니다. 입력한 정보를 확인해주세요.';
    case 401:
      return '인증이 필요합니다. 다시 로그인해주세요.';
    case 403:
      return '접근 권한이 없습니다.';
    case 404:
      return '요청한 정보를 찾을 수 없습니다.';
    case 409:
      return '이미 존재하는 데이터입니다.';
    case 422:
      return '입력한 데이터가 올바르지 않습니다.';
    case 429:
      return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
    case 500:
      return '서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    case 502:
    case 503:
    case 504:
      return '서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
};
