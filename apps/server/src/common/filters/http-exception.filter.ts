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
import {
  networkFromRequest,
  userFromRequest,
} from '@/common/logging/structured-log.helper';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

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
        {
          context: 'system',
          action: 'http_filter_wrong_host_type',
          payload: { hostType: host.getType() },
          err: exception,
        },
        'HTTP 예외 필터가 비 HTTP 컨텍스트에서 호출됨',
      );
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.originalUrl ?? request.url;

    if (exception instanceof QueryFailedError) {
      const { status, message } = this.handleQueryFailedError(
        exception,
        request,
        path,
      );

      response.status(status).json(buildHttpErrorBody(status, message, path));
      return;
    }

    const status = exception.getStatus();
    const errorMessage = normalizeExceptionMessage(exception.getResponse());
    const net = networkFromRequest(request);
    const user = userFromRequest(request);

    let validationDetails:
      | Array<{ field: string; reason: string }>
      | undefined = undefined;
    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError() as ZodError | undefined;

      if (zodError && Array.isArray(zodError.errors)) {
        validationDetails = (
          zodError.errors as Array<{
            path: Array<string | number>;
            message: string;
          }>
        ).map((e) => ({
          field: e.path.join('.'),
          reason: e.message,
        }));
      }
    }

    if (status >= 500) {
      this.logger.error(
        {
          context: 'http',
          action: 'http_server_error_response',
          ...(user ? { user } : {}),
          network: net,
          payload: {
            method: request.method,
            path,
            statusCode: status,
            message:
              typeof errorMessage === 'string'
                ? errorMessage
                : { messages: errorMessage },
          },
          err: exception,
        },
        `${request.method} ${path} 서버 예외 (${status})`,
      );
    } else {
      this.logger.warn(
        {
          context: 'http',
          action: 'http_client_error_response',
          ...(user ? { user } : {}),
          network: net,
          payload: {
            method: request.method,
            path,
            statusCode: status,
            message:
              typeof errorMessage === 'string'
                ? errorMessage
                : { messages: errorMessage },
            ...(validationDetails ? { validationDetails } : {}),
          },
        },
        `${request.method} ${path} 클라이언트/비즈니스 오류 (${status})`,
      );
    }

    response
      .status(status)
      .json(buildHttpErrorBody(status, errorMessage, path));
  }

  private handleQueryFailedError(
    error: QueryFailedError,
    request: Request,
    path: string,
  ): {
    status: number;
    message: string;
  } {
    const driverError = this.getDriverError(error);
    const code = driverError?.code;
    const net = networkFromRequest(request);
    const user = userFromRequest(request);

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
            context: 'database',
            action: 'query_unhandled_error',
            ...(user ? { user } : {}),
            network: net,
            payload: {
              method: request.method,
              path,
              dbCode: code ?? 'unknown',
            },
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
