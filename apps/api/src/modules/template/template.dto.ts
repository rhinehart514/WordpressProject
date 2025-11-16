import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsObject,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({
    description: 'Template name',
    example: 'Modern Restaurant',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Template type',
    example: 'restaurant',
  })
  @IsString({ message: 'Type must be a string' })
  @IsNotEmpty({ message: 'Type is required' })
  @MinLength(2, { message: 'Type must be at least 2 characters long' })
  @MaxLength(50, { message: 'Type must not exceed 50 characters' })
  type: string;

  @ApiProperty({
    description: 'Template description',
    example: 'A modern, responsive restaurant template with menu integration',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'Template configuration object',
    example: {
      colors: { primary: '#FF6B6B', secondary: '#4ECDC4' },
      layout: 'grid',
      sections: ['hero', 'menu', 'contact'],
    },
  })
  @IsObject({ message: 'Config must be an object' })
  @IsNotEmpty({ message: 'Config is required' })
  config: any;

  @ApiProperty({
    description: 'Whether the template is active',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;
}

export class UpdateTemplateDto {
  @ApiProperty({
    description: 'Template name',
    example: 'Modern Restaurant',
    required: false,
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @ApiProperty({
    description: 'Template type',
    example: 'restaurant',
    required: false,
  })
  @IsString({ message: 'Type must be a string' })
  @IsOptional()
  @MinLength(2, { message: 'Type must be at least 2 characters long' })
  @MaxLength(50, { message: 'Type must not exceed 50 characters' })
  type?: string;

  @ApiProperty({
    description: 'Template description',
    example: 'A modern, responsive restaurant template with menu integration',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'Template configuration object',
    example: {
      colors: { primary: '#FF6B6B', secondary: '#4ECDC4' },
      layout: 'grid',
      sections: ['hero', 'menu', 'contact'],
    },
    required: false,
  })
  @IsObject({ message: 'Config must be an object' })
  @IsOptional()
  config?: any;

  @ApiProperty({
    description: 'Whether the template is active',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;
}
