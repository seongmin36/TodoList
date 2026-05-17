import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface DatabaseDriverError {
  code?: string;
  detail?: string;
}

@Catch(HttpException, QueryFailedError)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException | QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // QueryFailed Error 처리
    if (exception instanceof QueryFailedError) {
      const { status, message } = this.handleQueryFailedError(exception);

      this.logger.warn(
        `[${request.method}] ${request.url} -> ${status}: ${message}`,
      );

      return response.status(status).json({
        success: false,
        statusCode: status,
        message,
        data: null,
      });
    }

    // HttpException 처리
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const errorMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as Record<string, string>).message;

    if (status >= 500) {
      this.logger.error(`[${request.method}] ${request.url} -> ${status}`);
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} -> ${status}: ${errorMessage}`,
      );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: errorMessage,
      data: null,
    });
  }

  private handleQueryFailedError(error: QueryFailedError): {
    status: number;
    message: string;
  } {
    const driverError = this.getDriverError(error);
    const code = driverError?.code;

    switch (code) {
      case '23505': // 유니크 제약 조건 위반
        return {
          status: HttpStatus.CONFLICT,
          message: this.extractUniqueViolationMessage(driverError),
        };
      case '23503': // 외래 키 위반
        return {
          status: HttpStatus.BAD_REQUEST,
          message: '참조하는 데이터가 존재하지 않습니다.',
        };
      case '23502': // Not null 위반
        return {
          status: HttpStatus.BAD_REQUEST,
          message: '필수 입력값이 누락되었습니다.',
        };
      default: // 500 : 그 외 서버 오류
        this.logger.error(`DB Error [${code}]: ${error.message}`);
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
