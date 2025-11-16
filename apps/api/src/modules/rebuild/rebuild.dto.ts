import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsIn,
  MaxLength,
} from 'class-validator';

export class CreateRebuildDto {
  @ApiProperty({
    description: 'Site analysis ID to base the rebuild on',
    example: 'clx1234567890abcdefgh',
  })
  @IsString({ message: 'Site analysis ID must be a string' })
  @IsNotEmpty({ message: 'Site analysis ID is required' })
  siteAnalysisId: string;

  @ApiProperty({
    description: 'Template ID to use for the rebuild',
    example: 'clx9876543210zyxwvuts',
  })
  @IsString({ message: 'Template ID must be a string' })
  @IsNotEmpty({ message: 'Template ID is required' })
  templateId: string;
}

export class UpdateRebuildDto {
  @ApiProperty({
    description: 'Rebuild status',
    example: 'completed',
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    required: false,
  })
  @IsString({ message: 'Status must be a string' })
  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed', 'failed'], {
    message: 'Status must be one of: pending, in_progress, completed, failed',
  })
  status?: string;

  @ApiProperty({
    description: 'Preview URLs for the rebuilt site',
    example: {
      homepage: 'https://preview.example.com/home',
      menu: 'https://preview.example.com/menu',
    },
    required: false,
  })
  @IsObject({ message: 'Preview URLs must be an object' })
  @IsOptional()
  previewUrls?: any;

  @ApiProperty({
    description: 'Error message if rebuild failed',
    example: 'Failed to generate menu page: template not found',
    required: false,
  })
  @IsString({ message: 'Error message must be a string' })
  @IsOptional()
  @MaxLength(1000, { message: 'Error message must not exceed 1000 characters' })
  errorMessage?: string;
}
