import { Request } from 'express';
import { User } from '@/users/entities/user.entity';

/**
 * - context: 대분류
 * - action: 동사_스네이크 케이스
 * - user / network / payload: 상황별 확장
 * - err: Error 시 Pino가 스택 직렬화
 */
export type StructuredLogContext =
  | 'auth'
  | 'user'
  | 'tag'
  | 'todo'
  | 'http'
  | 'database'
  | 'system';

export interface StructuredLogBase {
  context: StructuredLogContext;
  action: string;
  user?: { id?: number; role?: string };
  network?: { ip: string; userAgent?: string };
  payload?: Record<string, unknown>;
  err?: unknown;
  durationMs?: number;
  target?: string;
}

export function networkFromRequest(req: Request): {
  ip: string;
  userAgent?: string;
} {
  const forwarded = req.headers['x-forwarded-for'];
  const ipFromForwarded =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0]?.trim()
      : Array.isArray(forwarded)
        ? forwarded[0]
        : undefined;
  const ip =
    ipFromForwarded || req.ip || req.socket?.remoteAddress || 'unknown';
  const userAgent = req.get('user-agent') ?? undefined;
  return { ip, userAgent };
}

export function userFromRequest(req: Request): { id: number } | undefined {
  const u = (req as Request & { user?: User }).user;
  if (u?.userId != null) {
    return { id: u.userId };
  }
  return undefined;
}

export function businessEvent(id: number): { id: number } {
  return { id };
}
