/**
 * 파일 관련 유틸리티 함수들
 */

/**
 * 파일 크기를 읽기 쉬운 형태로 포맷팅
 * @param bytes 바이트 크기
 * @returns 포맷된 파일 크기 문자열 (예: "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 파일 타입에 따른 아이콘 반환
 * @param type MIME 타입 또는 파일 확장자
 * @returns 파일 타입에 맞는 이모지 아이콘
 */
export const getFileIcon = (type: string): string => {
  if (type.includes('image')) return '🖼️';
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
  if (type.includes('powerpoint') || type.includes('presentation')) return '📊';
  if (type.includes('zip') || type.includes('rar')) return '📦';
  if (type.includes('csv')) return '📋';
  if (type.includes('hwp') || type.includes('x-hwp')) return '📑';
  return '📎'; // 기본 아이콘
};

/**
 * URL에 프로토콜이 없으면 자동으로 https:// 추가
 * @param url 입력 URL
 * @returns 프로토콜이 포함된 정규화된 URL
 */
export const normalizeUrl = (url: string): string => {
  if (!url) return '';

  // 이미 프로토콜이 있는 경우 (http://, https://, mailto:, tel: 등)
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) {
    return url;
  }

  // 프로토콜이 없는 경우 https:// 추가
  return `https://${url}`;
};

/**
 * 지원하는 파일 확장자 목록
 */
export const SUPPORTED_FILE_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.zip',
  '.rar',
  '.jpg',
  '.jpeg',
  '.png',
  '.xlsx',
  '.pptx',
  '.xls',
  '.ppt',
  '.csv',
  '.hwp',
];

/**
 * 파일 크기 제한 (바이트)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
