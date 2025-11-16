import { IsString, IsOptional, IsUUID, IsNotEmpty, MaxLength, MinLength, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'I want to rebuild my restaurant website',
    minLength: 1,
    maxLength: 10000,
  })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Message content is required' })
  @MinLength(1, { message: 'Message cannot be empty' })
  @MaxLength(10000, { message: 'Message must not exceed 10000 characters' })
  content: string;

  @ApiPropertyOptional({
    description: 'Conversation ID (optional for first message)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Conversation ID must be a valid UUID' })
  conversationId?: string;

  @ApiPropertyOptional({
    description: 'User ID (optional if authenticated)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { userAgent: 'Mozilla/5.0', ipAddress: '192.168.1.1' },
  })
  @IsOptional()
  @IsObject({ message: 'Metadata must be an object' })
  metadata?: any;
}
