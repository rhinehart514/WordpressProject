import { Injectable, Logger } from '@nestjs/common';
import { Restaurant } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreateRestaurantDto {
  name: string;
  originalUrl?: string;
  currentSiteUrl?: string;
  logoUrl?: string;
  status: string; // 'active' | 'inactive' | 'pending'
  ownerUserId: string;
}

export interface UpdateRestaurantDto {
  name?: string;
  originalUrl?: string;
  currentSiteUrl?: string;
  logoUrl?: string;
  status?: string;
}

@Injectable()
export class RestaurantRepository {
  private readonly logger = new Logger(RestaurantRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new restaurant
   */
  async create(data: CreateRestaurantDto): Promise<Restaurant> {
    return this.prisma.restaurant.create({
      data: {
        name: data.name,
        originalUrl: data.originalUrl,
        currentSiteUrl: data.currentSiteUrl,
        logoUrl: data.logoUrl,
        status: data.status,
        ownerUserId: data.ownerUserId,
      },
    });
  }

  /**
   * Find restaurant by ID
   */
  async findById(id: string): Promise<Restaurant | null> {
    return this.prisma.restaurant.findUnique({
      where: { id },
    });
  }

  /**
   * Find restaurant by ID with all relations
   */
  async findByIdWithRelations(id: string) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: true,
        location: true,
        hours: true,
        gallery: true,
        wordPressSites: true,
        agencyClient: true,
      },
    });
  }

  /**
   * Find all restaurants for a user
   */
  async findByUserId(userId: string): Promise<Restaurant[]> {
    return this.prisma.restaurant.findMany({
      where: { ownerUserId: userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find all restaurants
   */
  async findAll(limit: number = 50): Promise<Restaurant[]> {
    return this.prisma.restaurant.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Update restaurant
   */
  async update(id: string, data: UpdateRestaurantDto): Promise<Restaurant> {
    return this.prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete restaurant
   */
  async delete(id: string): Promise<Restaurant> {
    return this.prisma.restaurant.delete({
      where: { id },
    });
  }

  /**
   * Count restaurants by status
   */
  async countByStatus(status: string): Promise<number> {
    return this.prisma.restaurant.count({
      where: { status },
    });
  }

  /**
   * Search restaurants by name
   */
  async searchByName(name: string, limit: number = 20): Promise<Restaurant[]> {
    return this.prisma.restaurant.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      take: limit,
    });
  }
}
