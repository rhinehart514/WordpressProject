import { Injectable, Logger } from '@nestjs/common';
import { RestaurantRepository } from '../../repositories';
import { DuplicateResourceException } from '../../common/exceptions';

export interface CreateRestaurantInput {
  name: string;
  originalUrl: string;
  description?: string;
  cuisineType?: string;
  ownerUserId: string;
  metadata?: any;
}

@Injectable()
export class CreateRestaurantUseCase {
  private readonly logger = new Logger(CreateRestaurantUseCase.name);

  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async execute(input: CreateRestaurantInput) {
    this.logger.log(`Creating restaurant: ${input.name}`);

    // Check if restaurant with same URL already exists for this user
    const existingRestaurants = await this.restaurantRepository.findByUserId(
      input.ownerUserId,
    );

    const duplicateUrl = existingRestaurants.find(
      (r) => r.originalUrl === input.originalUrl,
    );

    if (duplicateUrl) {
      throw new DuplicateResourceException('Restaurant', 'originalUrl');
    }

    // Create the restaurant
    const restaurant = await this.restaurantRepository.create({
      name: input.name,
      originalUrl: input.originalUrl,
      description: input.description,
      cuisineType: input.cuisineType,
      ownerUserId: input.ownerUserId,
      metadata: input.metadata,
    });

    this.logger.log(`Restaurant created with ID: ${restaurant.id}`);

    return restaurant;
  }
}
