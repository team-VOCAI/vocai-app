import axios from 'axios';
import { ApiError, getErrorMessage } from './errors';

// API 응답 타입 정의
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

// 게시글 관련 데이터 타입
export interface PostData {
  title: string;
  content: string;
  attachments?: Array<{
    name: string;
    size: number;
    type: string;
    data: string;
  }>;
  // 메타정보 (선택사항)
  company?: string | null;
  jobCategory?: string | null;
  tags?: string[] | null;
}

// 인증 관련 데이터 타입
export interface SignupData {
  email: string;
  password: string;
  name: string;
  nickname: string;
  phone: string;
}

export interface SigninData {
  email: string;
  password: string;
}

// 중복확인 응답 타입
export interface DuplicateCheckResponse {
  available: boolean;
  message: string;
}

// 에러 관련 export (재export for convenience)
export { ApiError } from './errors';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000, // 15초 타임아웃
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 요청 시작 시 로깅
    console.log(`🚀 API 요청: ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    console.error('❌ 요청 에러:', error);
    return Promise.reject(
      new ApiError(0, '요청을 보내는데 실패했습니다.', error)
    );
  }
);

// 응답 인터셉터 - 중앙집중식 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답 로깅
    console.log(`✅ API 응답: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // 에러 응답 처리
    console.error(
      `❌ API 에러: ${error.response?.status} ${error.config?.url}`,
      error
    );

    if (error.response) {
      // 서버 응답이 있는 경우 (4xx, 5xx)
      const status = error.response.status;
      const url = error.config?.url;
      const serverMessage =
        error.response.data?.error || error.response.data?.message;

      const userMessage = getErrorMessage(status, url, serverMessage);

      // 특별한 처리가 필요한 상태 코드들
      if (
        status === 401 &&
        !url?.includes('/auth/signin') &&
        !url?.includes('/user/profile')
      ) {
        // 로그인이 아닌 다른 요청에서 401이 발생하면 로그인 페이지로 이동
        // 단, /user/profile은 제외 (인증 상태 확인용이므로 정상적인 401)
        console.warn('🔒 토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/signin';
          }
        }, 1500);
      }

      return Promise.reject(new ApiError(status, userMessage, error));
    } else if (error.request) {
      // 네트워크 오류 등 (요청이 전송되지 않은 경우)
      console.error('🌐 네트워크 오류:', error);
      return Promise.reject(
        new ApiError(0, '네트워크 연결을 확인해주세요.', error)
      );
    } else {
      // 기타 에러
      console.error('⚠️ 예상치 못한 오류:', error);
      return Promise.reject(
        new ApiError(0, '예상치 못한 오류가 발생했습니다.', error)
      );
    }
  }
);

// 게시판 관련 API
export const boardAPI = {
  // 게시글 생성
  createPost: async (boardId: string, data: PostData) => {
    return apiClient.post(`/boards/${boardId}/posts`, data);
  },

  // 게시글 목록 조회
  getPosts: async (boardId: string) => {
    return apiClient.get(`/boards/${boardId}/posts`);
  },

  // 게시글 검색
  searchPosts: async (boardId: string, keyword: string) => {
    return apiClient.get(`/boards/${boardId}/search`, {
      params: { keyword },
    });
  },

  // 게시글 상세 조회
  getPost: async (boardId: string, postId: string) => {
    return apiClient.get(`/boards/${boardId}/posts/${postId}`);
  },

  // 조회수 증가
  incrementView: async (boardId: string, postId: string) => {
    return apiClient.post(`/boards/${boardId}/posts/${postId}/increment-view`);
  },

  // 게시판 목록별 게시글 수 조회
  getStats: async () => {
    return apiClient.get('/boards/stats');
  },

  // 게시글 수정
  updatePost: async (boardId: string, postId: string, data: PostData) => {
    return apiClient.put(`/boards/${boardId}/posts/${postId}`, data);
  },

  // 게시글 삭제
  deletePost: async (boardId: string, postId: string) => {
    return apiClient.delete(`/boards/${boardId}/posts/${postId}`);
  },
};

// 댓글 관련 API
export const commentAPI = {
  // 댓글 목록 조회
  getComments: async (postId: number) => {
    return apiClient.get('/comments', {
      params: { postId },
    });
  },

  // 댓글 생성
  createComment: async (postId: number, content: string) => {
    return apiClient.post('/comments', { postId, content });
  },

  // 댓글 수정
  updateComment: async (commentId: number, content: string) => {
    return apiClient.put(`/comments/${commentId}`, { content });
  },

  // 댓글 삭제
  deleteComment: async (commentId: number) => {
    return apiClient.delete(`/comments/${commentId}`);
  },
};

// 인증 관련 API
export const authAPI = {
  // 회원가입
  signup: async (data: SignupData) => {
    return apiClient.post('/auth/signup', {
      email: data.email,
      password: data.password,
      name: data.name,
      nickname: data.nickname,
      phone: data.phone.replace(/\D/g, ''), // 숫자만 전송
    });
  },

  // 로그인
  signin: async (data: SigninData) => {
    return apiClient.post('/auth/signin', {
      email: data.email,
      password: data.password,
    });
  },

  // 로그아웃
  signout: async () => {
    return apiClient.post('/auth/signout');
  },

  // 이메일 중복 체크
  checkEmailDuplicate: async (email: string) => {
    return apiClient.get('/auth/check-email', {
      params: { email },
    });
  },

  // 닉네임 중복 체크
  checkNicknameDuplicate: async (nickname: string) => {
    return apiClient.get('/auth/check-nickname', {
      params: { nickname },
    });
  },
};

// 사용자 관련 API
export const userAPI = {
  // 사용자 프로필 조회
  getProfile: async () => {
    return apiClient.get('/user/profile');
  },
  getMe: async () => {
    return apiClient.get('/user/me');
  },
  updateMe: async (data: { name: string; nickName: string; phone: string }) => {
    return apiClient.patch('/user/me', {
      name: data.name,
      nickName: data.nickName,
      phone: data.phone.replace(/\D/g, ''),
    });
  },
};

// 기본 API 클라이언트도 export (커스텀 요청용)
export default apiClient;
