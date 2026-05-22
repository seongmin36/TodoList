import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  buildHttpErrorBody,
  normalizeExceptionMessage,
} from '@/common/http/error-response.helper';

interface DatabaseDriverError {
  code?: string;
  detail?: string;
}

@Catch(HttpException, QueryFailedError)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(HttpExceptionFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  catch(
    exception: HttpException | QueryFailedError,
    host: ArgumentsHost,
  ): void {
    if (host.getType() !== 'http') {
      this.logger.warn(
        { context: host.getType(), err: exception },
        'HTTP 필터에서 비 HTTP 컨텍스트 예외 발생',
      );
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.originalUrl ?? request.url;
    const reqMeta = { method: request.method, url: path };

    if (exception instanceof QueryFailedError) {
      const { status, message } = this.handleQueryFailedError(
        exception,
        reqMeta,
      );

      response.status(status).json(buildHttpErrorBody(status, message, path));
      return;
    }

    const status = exception.getStatus();
    const errorMessage = normalizeExceptionMessage(exception.getResponse());

    if (status >= 500) {
      this.logger.error(
        { req: reqMeta, status, err: exception },
        `${reqMeta.method} ${path} 서버 예외 (${status})`,
      );
    } else {
      this.logger.warn(
        {
          req: reqMeta,
          status,
          ...(typeof errorMessage === 'string'
            ? { message: errorMessage }
            : { messages: errorMessage }),
        },
        `${reqMeta.method} ${path} 클라이언트/비즈니스 오류 (${status})`,
      );
    }

    response
      .status(status)
      .json(buildHttpErrorBody(status, errorMessage, path));
  }

  private handleQueryFailedError(
    error: QueryFailedError,
    reqMeta: { method: string; url: string },
  ): {
    status: number;
    message: string;
  } {
    const driverError = this.getDriverError(error);
    const code = driverError?.code;

    switch (code) {
      case '23505':
        return {
          status: HttpStatus.CONFLICT,
          message: this.extractUniqueViolationMessage(driverError),
        };
      case '23503':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: '참조하는 데이터가 존재하지 않습니다.',
        };
      case '23502':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: '필수 입력값이 누락되었습니다.',
        };
      default:
        this.logger.error(
          {
            req: reqMeta,
            dbCode: code,
            err: error,
          },
          '데이터베이스 처리 중 알 수 없는 오류',
        );
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: '데이터베이스 오류가 발생했습니다.',
        };
    }
  }

  private getDriverError(error: QueryFailedError): DatabaseDriverError | null {
    if (
      typeof error === 'object' &&
      error !== null &&
      'driverError' in error &&
      typeof error.driverError === 'object' &&
      error.driverError !== null
    ) {
      return error.driverError as DatabaseDriverError;
    }
    return null;
  }

  private extractUniqueViolationMessage(
    driverError: DatabaseDriverError | null,
  ): string {
    const detail = driverError?.detail ?? '';
    const match = detail.match(/Key \((.+?)\)=/);

    if (match) {
      const column = match[1];
      return `이미 사용중인 (${column})입니다.`;
    }
    return '이미 존재하는 데이터입니다.';
  }
}
