/** 예외 필터에서 내려주는 클라이언트용 에러 바디 형식 통일 */
export function buildHttpErrorBody(
  statusCode: number,
  message: string | string[],
  path: string,
): {
  success: false;
  statusCode: number;
  message: string | string[];
  data: null;
  timestamp: string;
  path: string;
} {
  return {
    success: false,
    statusCode,
    message,
    data: null,
    timestamp: new Date().toISOString(),
    path,
  };
}

export function normalizeExceptionMessage(exceptionResponse: unknown): string {
  if (typeof exceptionResponse === 'string') {
    return exceptionResponse;
  }
  if (
    typeof exceptionResponse === 'object' &&
    exceptionResponse !== null &&
    'message' in exceptionResponse
  ) {
    const m = (exceptionResponse as { message: unknown }).message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m) && m.every((x): x is string => typeof x === 'string'))
      return m.join(', ');
  }
  return '요청 처리 중 오류가 발생했습니다.';
}
