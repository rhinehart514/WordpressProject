import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  stack?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = host.getResponse<Response>();
    const request = host.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'InternalServerError';

    // Handle HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || exception.name;
      }
    }
    // Handle Prisma errors
    else if (exception && typeof exception === 'object' && 'code' in exception) {
      const prismaError = exception as any;

      switch (prismaError.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'A record with this value already exists';
          error = 'DuplicateError';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          error = 'NotFoundError';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = 'Foreign key constraint failed';
          error = 'ForeignKeyError';
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Database operation failed';
          error = 'DatabaseError';
      }
    }
    // Handle generic errors
    else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // Build error response
    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    // Log the error
    const logMessage = `${request.method} ${request.url} - ${status} - ${
      exception instanceof Error ? exception.message : 'Unknown error'
    }`;

    if (status >= 500) {
      this.logger.error(logMessage, exception instanceof Error ? exception.stack : '');
    } else if (status >= 400) {
      this.logger.warn(logMessage);
    }

    response.status(status).json(errorResponse);
  }
}
