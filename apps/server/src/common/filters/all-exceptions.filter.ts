import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { buildHttpErrorBody } from '@/common/http/error-response.helper';
import {
  networkFromRequest,
  userFromRequest,
} from '@/common/logging/structured-log.helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(AllExceptionsFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      const errObj =
        exception instanceof Error ? exception : { message: String(exception) };
      this.logger.error(
        {
          context: 'system',
          action: 'unhandled_exception_non_http',
          payload: { hostType: host.getType() },
          err: errObj,
        },
        '처리되지 않은 예외가 발생했습니다. (비 HTTP 컨텍스트)',
      );
      return;
    }

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const path = request.originalUrl ?? request.url;
    const net = networkFromRequest(request);
    const user = userFromRequest(request);

    this.logger.error(
      {
        context: 'http',
        action: 'unhandled_exception',
        ...(user ? { user } : {}),
        network: net,
        payload: { method: request.method, path },
        err:
          exception instanceof Error
            ? exception
            : { message: String(exception) },
      },
      `${request.method} ${path} 처리 중 처리되지 않은 예외`,
    );

    const body = buildHttpErrorBody(
      HttpStatus.INTERNAL_SERVER_ERROR,
      '서버 내부 오류가 발생했습니다.',
      path,
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }
}
