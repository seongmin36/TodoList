import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  // TODO: 실제 운영 환경에서는 ConfigService를 사용하여 허용된 오리진을 가져와야 함
  private readonly allowedOrigins: string[] = ['http://localhost:3000'];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true;
    }

    const origin = request.headers.origin;
    const referer = request.headers.referer;

    const hasCustomHeader = !!request.headers['x-requested-with'];

    // Origin 헤더 검증
    if (origin) {
      if (!this.allowedOrigins.includes(origin)) {
        throw new ForbiddenException(
          'CSRF 위협이 감지되었습니다 : 허용되지 않은 Origin 요청입니다.',
        );
      }
      // 허용된 Origin이면서, 커스텀 헤더가 누락된 경우
      if (!hasCustomHeader && process.env.NODE_ENV === 'production') {
        throw new ForbiddenException(
          '보안 정책 위반 : 유효한 요청 헤더가 누락되었습니다.',
        );
      }
      return true;
    }

    // 구형 브라우저나 일부 네트워크 환경으로 인해 Origin이 없을 경우
    if (referer) {
      const isAllowedReferer = this.allowedOrigins.some((allowed) =>
        referer.startsWith(allowed),
      );
      if (!isAllowedReferer) {
        throw new ForbiddenException(
          'CSRF 위협이 감지되었습니다 : 허용되지 않은 Referer 요청입니다.',
        );
      }
      return true;
    }

    // Origin과 Referer 헤더가 둘 다 존재하지 않는 특수한 요청 처리
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException(
        '보안 정책 위반: 올바른 요청 출처(Origin/Referer)를 확인할 수 없습니다.',
      );
    }
    return true;
  }
}
