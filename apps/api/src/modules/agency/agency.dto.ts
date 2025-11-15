import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  MaxLength,
} from 'class-validator';

export class CreateAgencyClientDto {
  @ApiProperty({
    description: 'Restaurant ID for the agency client',
    example: 'clx1234567890abcdefgh',
  })
  @IsString({ message: 'Restaurant ID must be a string' })
  @IsNotEmpty({ message: 'Restaurant ID is required' })
  restaurantId: string;

  @ApiProperty({
    description: 'Service tier/plan',
    example: 'premium',
    enum: ['basic', 'standard', 'premium', 'enterprise'],
  })
  @IsString({ message: 'Service tier must be a string' })
  @IsNotEmpty({ message: 'Service tier is required' })
  @IsIn(['basic', 'standard', 'premium', 'enterprise'], {
    message: 'Service tier must be one of: basic, standard, premium, enterprise',
  })
  serviceTier: string;

  @ApiProperty({
    description: 'Client status',
    example: 'active',
    enum: ['active', 'inactive', 'pending', 'suspended'],
  })
  @IsString({ message: 'Status must be a string' })
  @IsNotEmpty({ message: 'Status is required' })
  @IsIn(['active', 'inactive', 'pending', 'suspended'], {
    message: 'Status must be one of: active, inactive, pending, suspended',
  })
  status: string;

  @ApiProperty({
    description: 'ID of the assigned agent/account manager',
    example: 'clx5555555555aaaabbbb',
    required: false,
  })
  @IsString({ message: 'Assigned agent ID must be a string' })
  @IsOptional()
  assignedAgentId?: string;

  @ApiProperty({
    description: 'Notes about the client',
    example: 'Prefers contact via email. Monthly updates on Fridays.',
    required: false,
  })
  @IsString({ message: 'Notes must be a string' })
  @IsOptional()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}

export class UpdateAgencyClientDto {
  @ApiProperty({
    description: 'Service tier/plan',
    example: 'premium',
    enum: ['basic', 'standard', 'premium', 'enterprise'],
    required: false,
  })
  @IsString({ message: 'Service tier must be a string' })
  @IsOptional()
  @IsIn(['basic', 'standard', 'premium', 'enterprise'], {
    message: 'Service tier must be one of: basic, standard, premium, enterprise',
  })
  serviceTier?: string;

  @ApiProperty({
    description: 'Client status',
    example: 'active',
    enum: ['active', 'inactive', 'pending', 'suspended'],
    required: false,
  })
  @IsString({ message: 'Status must be a string' })
  @IsOptional()
  @IsIn(['active', 'inactive', 'pending', 'suspended'], {
    message: 'Status must be one of: active, inactive, pending, suspended',
  })
  status?: string;

  @ApiProperty({
    description: 'ID of the assigned agent/account manager',
    example: 'clx5555555555aaaabbbb',
    required: false,
  })
  @IsString({ message: 'Assigned agent ID must be a string' })
  @IsOptional()
  assignedAgentId?: string;

  @ApiProperty({
    description: 'Notes about the client',
    example: 'Prefers contact via email. Monthly updates on Fridays.',
    required: false,
  })
  @IsString({ message: 'Notes must be a string' })
  @IsOptional()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}
