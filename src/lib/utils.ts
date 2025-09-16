/**
 * 숫자를 포맷팅합니다. 1000개 이상이면 999+로 표시합니다.
 * @param count - 포맷팅할 숫자
 * @returns 포맷팅된 문자열
 */
export const formatCount = (count: number): string => {
  if (count >= 1000) {
    return '999+';
  }
  return count.toString();
};

/**
 * 날짜를 yyyy.mm.dd HH:mm 형식으로 포맷팅합니다.
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};
