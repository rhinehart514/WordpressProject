import { IsString, IsOptional, IsUUID, MaxLength, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiPropertyOptional({
    description: 'Conversation title',
    example: 'Restaurant Website Rebuild',
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title?: string;

  @ApiPropertyOptional({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { source: 'web', referrer: 'https://example.com' },
  })
  @IsOptional()
  @IsObject({ message: 'Metadata must be an object' })
  metadata?: any;
}
