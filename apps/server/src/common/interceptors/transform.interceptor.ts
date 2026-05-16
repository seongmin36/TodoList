import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse<T> {
  success: true;
  statusCode: number;
  data: T | null;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>();

    return next.handle().pipe(
      map(
        (data): ApiResponse<T> => ({
          success: true,
          statusCode: response.statusCode,
          data: data ?? null,
        }),
      ),
    );
  }
}
