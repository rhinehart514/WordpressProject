import { Injectable, Logger } from '@nestjs/common';
import { OperatingHour } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreateOperatingHourDto {
  restaurantId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime?: string; // HH:MM format
  closeTime?: string; // HH:MM format
  isClosed?: boolean;
}

export interface UpdateOperatingHourDto {
  dayOfWeek?: number;
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
}

@Injectable()
export class OperatingHourRepository {
  private readonly logger = new Logger(OperatingHourRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new operating hour
   */
  async create(data: CreateOperatingHourDto): Promise<OperatingHour> {
    return this.prisma.operatingHour.create({
      data: {
        restaurantId: data.restaurantId,
        dayOfWeek: data.dayOfWeek,
        openTime: data.openTime,
        closeTime: data.closeTime,
        isClosed: data.isClosed ?? false,
      },
    });
  }

  /**
   * Find operating hour by ID
   */
  async findById(id: string): Promise<OperatingHour | null> {
    return this.prisma.operatingHour.findUnique({
      where: { id },
    });
  }

  /**
   * Find all operating hours for a restaurant
   */
  async findByRestaurantId(restaurantId: string): Promise<OperatingHour[]> {
    return this.prisma.operatingHour.findMany({
      where: { restaurantId },
      orderBy: {
        dayOfWeek: 'asc',
      },
    });
  }

  /**
   * Find operating hours for a specific day
   */
  async findByDay(
    restaurantId: string,
    dayOfWeek: number,
  ): Promise<OperatingHour[]> {
    return this.prisma.operatingHour.findMany({
      where: {
        restaurantId,
        dayOfWeek,
      },
    });
  }

  /**
   * Update operating hour
   */
  async update(
    id: string,
    data: UpdateOperatingHourDto,
  ): Promise<OperatingHour> {
    return this.prisma.operatingHour.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete operating hour
   */
  async delete(id: string): Promise<OperatingHour> {
    return this.prisma.operatingHour.delete({
      where: { id },
    });
  }

  /**
   * Bulk create operating hours (for setting up a full week)
   */
  async bulkCreate(hours: CreateOperatingHourDto[]): Promise<number> {
    const result = await this.prisma.operatingHour.createMany({
      data: hours,
    });
    return result.count;
  }

  /**
   * Delete all operating hours for a restaurant
   */
  async deleteAllForRestaurant(restaurantId: string): Promise<number> {
    const result = await this.prisma.operatingHour.deleteMany({
      where: { restaurantId },
    });
    return result.count;
  }

  /**
   * Replace all operating hours for a restaurant
   */
  async replaceAllForRestaurant(
    restaurantId: string,
    hours: CreateOperatingHourDto[],
  ): Promise<number> {
    // Delete existing
    await this.deleteAllForRestaurant(restaurantId);
    // Create new
    return this.bulkCreate(hours);
  }

  /**
   * Check if restaurant is open on a specific day
   */
  async isOpenOnDay(
    restaurantId: string,
    dayOfWeek: number,
  ): Promise<boolean> {
    const hours = await this.findByDay(restaurantId, dayOfWeek);
    return hours.length > 0 && hours.some((h) => !h.isClosed);
  }

  /**
   * Get current day's hours
   */
  async getTodaysHours(restaurantId: string): Promise<OperatingHour[]> {
    const today = new Date().getDay(); // 0-6
    return this.findByDay(restaurantId, today);
  }
}
