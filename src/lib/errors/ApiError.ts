// 커스텀 에러 클래스
export class ApiError extends Error {
  public status: number;
  public userMessage: string;
  public originalError?: unknown;

  constructor(status: number, userMessage: string, originalError?: unknown) {
    super(userMessage);
    this.name = 'ApiError';
    this.status = status;
    this.userMessage = userMessage;
    this.originalError = originalError;
  }
}
