import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsObject,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateWordPressSiteDto {
  @ApiProperty({
    description: 'Restaurant ID to associate the WordPress site with',
    example: 'clx1234567890abcdefgh',
    required: false,
  })
  @IsString({ message: 'Restaurant ID must be a string' })
  @IsOptional()
  restaurantId?: string;

  @ApiProperty({
    description: 'Base URL of the WordPress site',
    example: 'https://myrestaurant.com',
  })
  @IsUrl({}, { message: 'Base URL must be a valid URL' })
  @IsNotEmpty({ message: 'Base URL is required' })
  baseUrl: string;

  @ApiProperty({
    description: 'WordPress username for authentication',
    example: 'admin',
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(60, { message: 'Username must not exceed 60 characters' })
  username: string;

  @ApiProperty({
    description: 'WordPress application password for API authentication',
    example: 'xxxx xxxx xxxx xxxx xxxx xxxx',
  })
  @IsString({ message: 'Application password must be a string' })
  @IsNotEmpty({ message: 'Application password is required' })
  @MinLength(20, { message: 'Application password must be at least 20 characters long' })
  applicationPassword: string;
}

export class UpdateWordPressSiteDto {
  @ApiProperty({
    description: 'Base URL of the WordPress site',
    example: 'https://myrestaurant.com',
    required: false,
  })
  @IsUrl({}, { message: 'Base URL must be a valid URL' })
  @IsOptional()
  baseUrl?: string;

  @ApiProperty({
    description: 'Encrypted API key/credentials',
    example: 'encrypted_credentials_here',
    required: false,
  })
  @IsString({ message: 'API key must be a string' })
  @IsOptional()
  apiKeyEncrypted?: string;

  @ApiProperty({
    description: 'Additional metadata about the WordPress site',
    example: { version: '6.4', theme: 'twentytwentyfour' },
    required: false,
  })
  @IsObject({ message: 'Site metadata must be an object' })
  @IsOptional()
  siteMetadata?: any;
}

export class TestConnectionDto {
  @ApiProperty({
    description: 'Base URL of the WordPress site to test',
    example: 'https://myrestaurant.com',
  })
  @IsUrl({}, { message: 'Base URL must be a valid URL' })
  @IsNotEmpty({ message: 'Base URL is required' })
  baseUrl: string;

  @ApiProperty({
    description: 'WordPress username for authentication',
    example: 'admin',
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @ApiProperty({
    description: 'WordPress application password for API authentication',
    example: 'xxxx xxxx xxxx xxxx xxxx xxxx',
  })
  @IsString({ message: 'Application password must be a string' })
  @IsNotEmpty({ message: 'Application password is required' })
  @MinLength(20, { message: 'Application password must be at least 20 characters long' })
  applicationPassword: string;
}
