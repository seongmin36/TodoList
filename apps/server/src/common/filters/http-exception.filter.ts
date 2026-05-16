import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    const exceptionResponse = exception.getResponse();
    const errorMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as Record<string, string>).message;

    if (status >= 500) {
      this.logger.error(`[${request.method}] ${request.url} -> ${status}`);
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} -> ${status}: ${message}`,
      );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: errorMessage,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
