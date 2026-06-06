import { z } from "zod";

/** 클라이언트·Swagger에 노출되는 공통 메시지 */
export const XSS_POLICY_VIOLATION_MESSAGE =
  "보안 정책 위반 : 사용할 수 없는 문자나 태그가 포함되어 있습니다.";

/**
 * 스크립트 삽입·이벤트 핸들러·위험도 높은 HTML·브라우저 프로토콜 등 간단 패턴 차단.
 * (WAF/템플릿 이스케이프와 병행 필요)
 */
export function rejectsXssLikePayload(raw: string): boolean {
  if (!raw.length) return true;

  const patterns: RegExp[] = [
    /<script\b/i,
    /<\/script\b/i,
    /javascript\s*:/i,
    /data\s*:\s*text\/html/i,
    /<\s*(iframe|object|embed|foreignObject)\b/i,
    /\bon[A-Za-z]+\s*=/i,
  ];

  return !patterns.some((re) => re.test(raw));
}

/** ZodString에 XSS 패턴 검사 refine을 붙임 */
export function withXssCheck(
  zodString: z.ZodString,
): z.ZodEffects<z.ZodString, string, string> {
  return zodString.refine(rejectsXssLikePayload, {
    message: XSS_POLICY_VIOLATION_MESSAGE,
  });
}

/** 쿼리/바디 ISO 날짜 문자열: XSS 검사 후 datetime 검증 */
export function xssSafeIsoDateTimeString(): z.ZodPipeline<
  z.ZodEffects<z.ZodString, string, string>,
  z.ZodString
> {
  return withXssCheck(z.string()).pipe(z.string().datetime({ offset: true }));
}

/** 쿼리 스트링 `"true" | "false"` 등: XSS 검사 후 boolean으로 변환 */
export function xssSafeBooleanFromQueryString() {
  return withXssCheck(z.string()).transform((v) => v === "true");
}
