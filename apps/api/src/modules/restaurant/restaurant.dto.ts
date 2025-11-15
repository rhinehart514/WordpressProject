import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsObject,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'The Italian Kitchen', description: 'Restaurant name' })
  @IsString()
  @IsNotEmpty({ message: 'Restaurant name is required' })
  @MaxLength(200, { message: 'Name must not exceed 200 characters' })
  name: string;

  @ApiProperty({
    example: 'https://example-restaurant.com',
    description: 'Original website URL',
  })
  @IsUrl({}, { message: 'Please provide a valid URL' })
  @IsNotEmpty({ message: 'Original URL is required' })
  originalUrl: string;

  @ApiProperty({
    example: 'Authentic Italian cuisine in downtown',
    description: 'Restaurant description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @ApiProperty({
    example: 'Italian',
    description: 'Type of cuisine',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Cuisine type must not exceed 100 characters' })
  cuisineType?: string;

  @ApiProperty({
    example: { phone: '+1-555-0123', email: 'info@restaurant.com' },
    description: 'Additional metadata',
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class UpdateRestaurantDto {
  @ApiProperty({ example: 'The Italian Kitchen', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Name must not exceed 200 characters' })
  name?: string;

  @ApiProperty({
    example: 'Authentic Italian cuisine',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @ApiProperty({
    example: 'Italian',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Cuisine type must not exceed 100 characters' })
  cuisineType?: string;

  @ApiProperty({
    example: { phone: '+1-555-0123' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
