import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateDeploymentDto {
  @ApiProperty({
    description: 'Rebuild ID to deploy',
    example: 'clx1234567890abcdefgh',
  })
  @IsString({ message: 'Rebuild ID must be a string' })
  @IsNotEmpty({ message: 'Rebuild ID is required' })
  rebuildId: string;

  @ApiProperty({
    description: 'WordPress site ID to deploy to',
    example: 'clx9876543210zyxwvuts',
  })
  @IsString({ message: 'WordPress site ID must be a string' })
  @IsNotEmpty({ message: 'WordPress site ID is required' })
  wordPressSiteId: string;
}

export class UpdateDeploymentDto {
  @ApiProperty({
    description: 'Deployment status',
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
    description: 'Array of error messages if deployment failed',
    example: ['Connection timeout', 'Invalid credentials'],
    required: false,
    type: [String],
  })
  @IsArray({ message: 'Error log must be an array' })
  @IsString({ each: true, message: 'Each error must be a string' })
  @IsOptional()
  errorLog?: string[];
}
