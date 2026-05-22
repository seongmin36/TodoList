import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '@/common/decorators/response-message.decorator';

export interface ApiResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T | null;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const req = context.switchToHttp().getRequest<{ method: string }>();
    const response = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>();

    const customMessage = this.reflector.getAllAndOverride<string>(
      RESPONSE_MESSAGE_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map(
        (data): ApiResponse<T> => ({
          success: true,
          statusCode: response.statusCode,
          message:
            customMessage ??
            this.resolveMessage(req.method, response.statusCode),
          data: data ?? null,
        }),
      ),
    );
  }

  private resolveMessage(method: string, statusCode: number): string {
    if (statusCode === 204) {
      return '처리가 완료되었습니다.';
    }

    const messages: Record<string, string> = {
      GET: '조회에 성공했습니다.',
      POST: '생성에 성공했습니다.',
      PATCH: '수정에 성공했습니다.',
      PUT: '수정에 성공했습니다.',
      DELETE: '삭제에 성공했습니다.',
    };

    return messages[method.toUpperCase()] ?? '처리에 성공했습니다.';
  }
}
