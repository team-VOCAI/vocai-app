const cache = new Map<number, string>();

export function getCachedQuestion(sessionId: number) {
  return cache.get(sessionId);
}

export function setCachedQuestion(sessionId: number, question: string) {
  cache.set(sessionId, question);
}

export function clearCachedQuestion(sessionId: number) {
  cache.delete(sessionId);
}
