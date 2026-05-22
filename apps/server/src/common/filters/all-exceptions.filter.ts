import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { buildHttpErrorBody } from '@/common/http/error-response.helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(AllExceptionsFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      this.logger.error(
        {
          context: host.getType(),
          err:
            exception instanceof Error
              ? exception
              : { message: String(exception) },
        },
        '처리되지 않은 예외가 발생했습니다. (비 HTTP)',
      );
      return;
    }

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const path = request.originalUrl ?? request.url;

    this.logger.error(
      {
        err:
          exception instanceof Error
            ? exception
            : { message: String(exception) },
        req: {
          method: request.method,
          url: path,
        },
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
