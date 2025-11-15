import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUrl,
  IsArray,
  IsBoolean,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({
    description: 'Restaurant ID that owns this menu item',
    example: 'clx1234567890abcdefgh',
  })
  @IsString({ message: 'Restaurant ID must be a string' })
  @IsNotEmpty({ message: 'Restaurant ID is required' })
  restaurantId: string;

  @ApiProperty({
    description: 'Name of the menu item',
    example: 'Margherita Pizza',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Description of the menu item',
    example: 'Classic tomato sauce, fresh mozzarella, and basil',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'Price in cents',
    example: 1299,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price is required' })
  @Min(0, { message: 'Price must be at least 0' })
  priceCents: number;

  @ApiProperty({
    description: 'URL to the menu item image',
    example: 'https://example.com/images/margherita.jpg',
    required: false,
  })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Category of the menu item',
    example: 'Pizza',
  })
  @IsString({ message: 'Category must be a string' })
  @IsNotEmpty({ message: 'Category is required' })
  @MinLength(2, { message: 'Category must be at least 2 characters long' })
  @MaxLength(50, { message: 'Category must not exceed 50 characters' })
  category: string;

  @ApiProperty({
    description: 'List of allergens in the menu item',
    example: ['gluten', 'dairy'],
    required: false,
    type: [String],
  })
  @IsArray({ message: 'Allergens must be an array' })
  @IsString({ each: true, message: 'Each allergen must be a string' })
  @IsOptional()
  allergens?: string[];

  @ApiProperty({
    description: 'Whether the menu item is currently available',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean({ message: 'isAvailable must be a boolean' })
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Sort order for displaying the menu item',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'Sort order must be a number' })
  @IsOptional()
  @Min(0, { message: 'Sort order must be at least 0' })
  sortOrder?: number;
}

export class UpdateMenuItemDto {
  @ApiProperty({
    description: 'Name of the menu item',
    example: 'Margherita Pizza',
    required: false,
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @ApiProperty({
    description: 'Description of the menu item',
    example: 'Classic tomato sauce, fresh mozzarella, and basil',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'Price in cents',
    example: 1299,
    required: false,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsOptional()
  @Min(0, { message: 'Price must be at least 0' })
  priceCents?: number;

  @ApiProperty({
    description: 'URL to the menu item image',
    example: 'https://example.com/images/margherita.jpg',
    required: false,
  })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Category of the menu item',
    example: 'Pizza',
    required: false,
  })
  @IsString({ message: 'Category must be a string' })
  @IsOptional()
  @MinLength(2, { message: 'Category must be at least 2 characters long' })
  @MaxLength(50, { message: 'Category must not exceed 50 characters' })
  category?: string;

  @ApiProperty({
    description: 'List of allergens in the menu item',
    example: ['gluten', 'dairy'],
    required: false,
    type: [String],
  })
  @IsArray({ message: 'Allergens must be an array' })
  @IsString({ each: true, message: 'Each allergen must be a string' })
  @IsOptional()
  allergens?: string[];

  @ApiProperty({
    description: 'Whether the menu item is currently available',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'isAvailable must be a boolean' })
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Sort order for displaying the menu item',
    example: 1,
    required: false,
  })
  @IsNumber({}, { message: 'Sort order must be a number' })
  @IsOptional()
  @Min(0, { message: 'Sort order must be at least 0' })
  sortOrder?: number;
}
