import axios from 'axios';

// API 응답 타입 정의
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

// 게시글 데이터 타입
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

    // 향후 토큰 인증이 필요할 때 사용
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => {
    console.error('❌ 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답 로깅
    console.log(`✅ API 응답: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // 에러 응답 처리
    console.error(
      `❌ API 에러: ${error.response?.status} ${error.config?.url}`
    );

    if (error.response?.status === 401) {
      // 인증 에러 처리 (향후 로그인 기능 추가 시 사용)
      console.warn('🔒 인증이 필요합니다.');
      // window.location.href = '/signin';
    } else if (error.response?.status === 403) {
      console.warn('🚫 권한이 없습니다.');
    } else if (error.response?.status >= 500) {
      console.error('🔥 서버 에러가 발생했습니다.');
    }

    return Promise.reject(error);
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
    const response = await fetch(`/api/boards/${boardId}/posts`);
    if (!response.ok) {
      throw new Error('게시글 목록을 불러오는데 실패했습니다.');
    }
    return { data: await response.json() };
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
    const response = await fetch('/api/boards/stats');
    if (!response.ok) {
      throw new Error('게시판 통계를 불러오는데 실패했습니다.');
    }
    return { data: await response.json() };
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

  // 댓글 삭제
  deleteComment: async (commentId: string) => {
    return apiClient.delete(`/comments/${commentId}`);
  },
};

// 기본 API 클라이언트도 export (커스텀 요청용)
export default apiClient;
