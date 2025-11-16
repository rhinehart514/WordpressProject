import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom exception for business logic errors
 */
export class BusinessException extends HttpException {
  constructor(message: string, statusCode = HttpStatus.BAD_REQUEST) {
    super(
      {
        statusCode,
        message,
        error: 'BusinessError',
      },
      statusCode,
    );
  }
}

/**
 * Exception for resource not found
 */
export class ResourceNotFoundException extends HttpException {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with ID '${identifier}' not found`
      : `${resource} not found`;

    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message,
        error: 'NotFoundError',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Exception for duplicate resources
 */
export class DuplicateResourceException extends HttpException {
  constructor(resource: string, field?: string) {
    const message = field
      ? `${resource} with this ${field} already exists`
      : `${resource} already exists`;

    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message,
        error: 'DuplicateError',
      },
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * Exception for validation errors
 */
export class ValidationException extends HttpException {
  constructor(message: string | string[]) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message,
        error: 'ValidationError',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

/**
 * Exception for unauthorized access
 */
export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized access') {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message,
        error: 'UnauthorizedError',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

/**
 * Exception for forbidden access
 */
export class ForbiddenException extends HttpException {
  constructor(message = 'Access forbidden') {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message,
        error: 'ForbiddenError',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * Exception for external service errors
 */
export class ExternalServiceException extends HttpException {
  constructor(service: string, message?: string) {
    super(
      {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: message || `External service ${service} is unavailable`,
        error: 'ExternalServiceError',
      },
      HttpStatus.BAD_GATEWAY,
    );
  }
}

/**
 * Exception for rate limiting
 */
export class RateLimitException extends HttpException {
  constructor(message = 'Too many requests') {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message,
        error: 'RateLimitError',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
