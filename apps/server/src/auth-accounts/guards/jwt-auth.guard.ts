import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. 현재 요청된 핸들러(메서드)나 클래스에 @Public()이 붙어있는지 확인
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 2. @Public()이 붙어있다면 인증 로직을 건너뛴다.
    if (isPublic) {
      return true;
    }
    // 3. @Public()이 붙어있지 않다면 부모 클래스(AuthGuard)의 JWT 인증 로직을 실행한다.
    return super.canActivate(context);
  }
}
