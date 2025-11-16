import { PrismaClient, Restaurant } from '@prisma/client';

export interface CreateRestaurantOptions {
  name?: string;
  originalUrl?: string;
  description?: string;
  cuisineType?: string;
  metadata?: any;
}

export class RestaurantFactory {
  private static counter = 0;

  /**
   * Create a test restaurant
   */
  static async create(
    prisma: PrismaClient,
    options: CreateRestaurantOptions = {},
  ): Promise<Restaurant> {
    this.counter++;

    return prisma.restaurant.create({
      data: {
        name: options.name || `Test Restaurant ${this.counter}`,
        originalUrl:
          options.originalUrl ||
          `https://test-restaurant-${this.counter}.example.com`,
        description:
          options.description || `Test restaurant description ${this.counter}`,
        cuisineType: options.cuisineType || 'Italian',
        metadata: options.metadata || {},
      },
    });
  }

  /**
   * Create multiple test restaurants
   */
  static async createMany(
    prisma: PrismaClient,
    count: number,
    options: CreateRestaurantOptions = {},
  ): Promise<Restaurant[]> {
    const restaurants: Restaurant[] = [];
    for (let i = 0; i < count; i++) {
      restaurants.push(await this.create(prisma, options));
    }
    return restaurants;
  }

  /**
   * Create restaurant with menu items
   */
  static async createWithMenu(
    prisma: PrismaClient,
    menuItemCount: number = 5,
    options: CreateRestaurantOptions = {},
  ): Promise<Restaurant> {
    const restaurant = await this.create(prisma, options);

    // Create menu items
    for (let i = 1; i <= menuItemCount; i++) {
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          name: `Menu Item ${i}`,
          description: `Description for item ${i}`,
          price: 10.99 + i,
          category: i % 2 === 0 ? 'Entrees' : 'Appetizers',
          available: true,
          sortOrder: i,
        },
      });
    }

    return restaurant;
  }

  /**
   * Create restaurant with location
   */
  static async createWithLocation(
    prisma: PrismaClient,
    options: CreateRestaurantOptions = {},
  ): Promise<Restaurant> {
    const restaurant = await this.create(prisma, options);

    await prisma.location.create({
      data: {
        restaurantId: restaurant.id,
        address: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'USA',
        phoneNumber: '+1-555-0123',
        email: `contact${this.counter}@test-restaurant.com`,
      },
    });

    return restaurant;
  }

  /**
   * Reset counter (useful between test suites)
   */
  static resetCounter(): void {
    this.counter = 0;
  }
}
