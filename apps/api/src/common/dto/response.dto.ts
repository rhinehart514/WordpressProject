import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Standardized API response wrapper
 */
export class ApiResponse<T> {
  @ApiProperty({
    description: 'Response status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Success',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data: T;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;

  @ApiPropertyOptional({
    description: 'API version',
    example: 'v1',
  })
  version?: string;

  constructor(statusCode: number, message: string, data: T, version?: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.version = version || 'v1';
  }
}

/**
 * Success response builder
 */
export function successResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return new ApiResponse(200, message, data);
}

/**
 * Created response builder
 */
export function createdResponse<T>(data: T, message = 'Created successfully'): ApiResponse<T> {
  return new ApiResponse(201, message, data);
}
