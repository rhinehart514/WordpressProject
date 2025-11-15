import { Injectable, Logger } from '@nestjs/common';
import { WordPressSite } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreateWordPressSiteDto {
  restaurantId?: string;
  baseUrl: string;
  apiKeyEncrypted: string;
  siteMetadata: any;
  healthStatus?: string; // 'healthy' | 'warning' | 'error'
}

export interface UpdateWordPressSiteDto {
  baseUrl?: string;
  apiKeyEncrypted?: string;
  siteMetadata?: any;
  lastHealthCheck?: Date;
  healthStatus?: string;
}

@Injectable()
export class WordPressSiteRepository {
  private readonly logger = new Logger(WordPressSiteRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new WordPress site
   */
  async create(data: CreateWordPressSiteDto): Promise<WordPressSite> {
    return this.prisma.wordPressSite.create({
      data: {
        restaurantId: data.restaurantId,
        baseUrl: data.baseUrl,
        apiKeyEncrypted: data.apiKeyEncrypted,
        siteMetadata: data.siteMetadata,
        healthStatus: data.healthStatus,
      },
    });
  }

  /**
   * Find WordPress site by ID
   */
  async findById(id: string): Promise<WordPressSite | null> {
    return this.prisma.wordPressSite.findUnique({
      where: { id },
    });
  }

  /**
   * Find WordPress site by ID with deployments
   */
  async findByIdWithDeployments(id: string) {
    return this.prisma.wordPressSite.findUnique({
      where: { id },
      include: {
        deployments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        restaurant: true,
      },
    });
  }

  /**
   * Find all WordPress sites for a restaurant
   */
  async findByRestaurantId(restaurantId: string): Promise<WordPressSite[]> {
    return this.prisma.wordPressSite.findMany({
      where: { restaurantId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find WordPress site by base URL
   */
  async findByBaseUrl(baseUrl: string): Promise<WordPressSite | null> {
    return this.prisma.wordPressSite.findFirst({
      where: { baseUrl },
    });
  }

  /**
   * Find all WordPress sites
   */
  async findAll(limit: number = 50): Promise<WordPressSite[]> {
    return this.prisma.wordPressSite.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Update WordPress site
   */
  async update(id: string, data: UpdateWordPressSiteDto): Promise<WordPressSite> {
    return this.prisma.wordPressSite.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete WordPress site
   */
  async delete(id: string): Promise<WordPressSite> {
    return this.prisma.wordPressSite.delete({
      where: { id },
    });
  }

  /**
   * Update health check status
   */
  async updateHealthCheck(
    id: string,
    healthStatus: string,
  ): Promise<WordPressSite> {
    return this.prisma.wordPressSite.update({
      where: { id },
      data: {
        lastHealthCheck: new Date(),
        healthStatus,
      },
    });
  }

  /**
   * Find sites with failed health checks
   */
  async findUnhealthySites(): Promise<WordPressSite[]> {
    return this.prisma.wordPressSite.findMany({
      where: {
        healthStatus: {
          in: ['warning', 'error'],
        },
      },
    });
  }
}
