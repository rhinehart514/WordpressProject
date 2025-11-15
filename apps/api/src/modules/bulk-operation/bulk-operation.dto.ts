import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsObject,
  IsNumber,
  Min,
  Max,
  ArrayMinSize,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateBulkOperationDto {
  @ApiProperty({
    description: 'Type of bulk operation to perform',
    example: 'health_check',
  })
  @IsString({ message: 'Operation type must be a string' })
  @IsNotEmpty({ message: 'Operation type is required' })
  @MinLength(3, { message: 'Operation type must be at least 3 characters long' })
  @MaxLength(50, { message: 'Operation type must not exceed 50 characters' })
  operationType: string;

  @ApiProperty({
    description: 'Array of client IDs to perform the operation on',
    example: ['clx1111111111aaaaaaaa', 'clx2222222222bbbbbbbb'],
    type: [String],
  })
  @IsArray({ message: 'Target client IDs must be an array' })
  @ArrayMinSize(1, { message: 'At least one target client ID is required' })
  @IsString({ each: true, message: 'Each target client ID must be a string' })
  @IsNotEmpty({ message: 'Target client IDs is required' })
  targetClientIds: string[];

  @ApiProperty({
    description: 'Additional payload data for the operation',
    example: { priority: 'high', notify: true },
    required: false,
  })
  @IsObject({ message: 'Payload must be an object' })
  @IsOptional()
  payload?: any;

  @ApiProperty({
    description: 'User ID who initiated the bulk operation',
    example: 'clx9999999999zzzzzzz',
  })
  @IsString({ message: 'Initiated by user ID must be a string' })
  @IsNotEmpty({ message: 'Initiated by user ID is required' })
  initiatedByUserId: string;
}

export class UpdateProgressDto {
  @ApiProperty({
    description: 'Progress percentage (0-100)',
    example: 75,
  })
  @IsNumber({}, { message: 'Progress must be a number' })
  @IsNotEmpty({ message: 'Progress is required' })
  @Min(0, { message: 'Progress must be at least 0' })
  @Max(100, { message: 'Progress must not exceed 100' })
  progress: number;

  @ApiProperty({
    description: 'Number of successfully completed operations',
    example: 15,
  })
  @IsNumber({}, { message: 'Completed count must be a number' })
  @IsNotEmpty({ message: 'Completed count is required' })
  @Min(0, { message: 'Completed count must be at least 0' })
  completedCount: number;

  @ApiProperty({
    description: 'Number of failed operations',
    example: 2,
  })
  @IsNumber({}, { message: 'Failed count must be a number' })
  @IsNotEmpty({ message: 'Failed count is required' })
  @Min(0, { message: 'Failed count must be at least 0' })
  failedCount: number;
}
