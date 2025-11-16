import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/response.dto';

/**
 * Transform all responses to standardized format
 * Excludes SSE (Server-Sent Events) streams
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Don't transform SSE streams
    if (request.url.includes('/stream')) {
      return next.handle();
    }

    // Don't transform file downloads
    if (response.getHeader('Content-Type')?.includes('application/octet-stream')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // If data is already in ApiResponse format, return as-is
        if (data && typeof data === 'object' && 'statusCode' in data && 'timestamp' in data) {
          return data;
        }

        // Transform to standard format
        const statusCode = response.statusCode || 200;
        const message = this.getMessageForStatusCode(statusCode);

        return new ApiResponse(statusCode, message, data, 'v1');
      }),
    );
  }

  private getMessageForStatusCode(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return 'Success';
      case 201:
        return 'Created successfully';
      case 202:
        return 'Accepted';
      case 204:
        return 'No content';
      default:
        return 'Success';
    }
  }
}
