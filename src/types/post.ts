// 게시글 타입 정의
export interface Post {
  postId: number;
  title: string;
  content: string;
  nickName: string;
  createdAt: string;
  updatedAt: string;
  view: number;
  commentCount: number; // 댓글 수 추가
  company?: string | null;
  jobCategory?: string | null;
  tags?: string | null;
  profile: {
    profileId: number;
    nickName: string;
  };
  board: {
    boardId: number;
    name: string;
  };
  attachments: Array<{
    attachmentId: number;
    fileName: string;
    fileSize: number;
    fileType: string;
    createdAt: string;
  }>;
}

// API 응답 타입 정의
export interface PostsResponse {
  posts: Post[];
}
