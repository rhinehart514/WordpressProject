import { Injectable, Logger } from '@nestjs/common';
import { AgencyClient } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreateAgencyClientDto {
  restaurantId: string;
  serviceTier: string; // 'basic' | 'pro' | 'enterprise'
  status: string; // 'active' | 'inactive' | 'suspended'
  assignedAgentId?: string;
  notes?: string;
}

export interface UpdateAgencyClientDto {
  serviceTier?: string;
  status?: string;
  assignedAgentId?: string;
  monthlyUpdateCount?: number;
  notes?: string;
  lastUpdated?: Date;
}

@Injectable()
export class AgencyClientRepository {
  private readonly logger = new Logger(AgencyClientRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new agency client
   */
  async create(data: CreateAgencyClientDto): Promise<AgencyClient> {
    return this.prisma.agencyClient.create({
      data: {
        restaurantId: data.restaurantId,
        serviceTier: data.serviceTier,
        status: data.status,
        assignedAgentId: data.assignedAgentId,
        notes: data.notes,
      },
    });
  }

  /**
   * Find agency client by ID
   */
  async findById(id: string): Promise<AgencyClient | null> {
    return this.prisma.agencyClient.findUnique({
      where: { id },
    });
  }

  /**
   * Find agency client by restaurant ID
   */
  async findByRestaurantId(restaurantId: string): Promise<AgencyClient | null> {
    return this.prisma.agencyClient.findUnique({
      where: { restaurantId },
    });
  }

  /**
   * Find agency client with all relations
   */
  async findByIdWithRelations(id: string) {
    return this.prisma.agencyClient.findUnique({
      where: { id },
      include: {
        restaurant: true,
        healthChecks: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 10,
        },
        maintenanceSchedule: true,
      },
    });
  }

  /**
   * Find all agency clients
   */
  async findAll(limit: number = 100): Promise<AgencyClient[]> {
    return this.prisma.agencyClient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Find clients by status
   */
  async findByStatus(status: string): Promise<AgencyClient[]> {
    return this.prisma.agencyClient.findMany({
      where: { status },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find clients by service tier
   */
  async findByServiceTier(serviceTier: string): Promise<AgencyClient[]> {
    return this.prisma.agencyClient.findMany({
      where: { serviceTier },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find clients assigned to an agent
   */
  async findByAssignedAgent(assignedAgentId: string): Promise<AgencyClient[]> {
    return this.prisma.agencyClient.findMany({
      where: { assignedAgentId },
      include: {
        restaurant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update agency client
   */
  async update(
    id: string,
    data: UpdateAgencyClientDto,
  ): Promise<AgencyClient> {
    return this.prisma.agencyClient.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete agency client
   */
  async delete(id: string): Promise<AgencyClient> {
    return this.prisma.agencyClient.delete({
      where: { id },
    });
  }

  /**
   * Increment monthly update count
   */
  async incrementUpdateCount(id: string): Promise<AgencyClient> {
    return this.prisma.agencyClient.update({
      where: { id },
      data: {
        monthlyUpdateCount: {
          increment: 1,
        },
        lastUpdated: new Date(),
      },
    });
  }

  /**
   * Reset monthly update counts (run at start of month)
   */
  async resetMonthlyUpdateCounts(): Promise<number> {
    const result = await this.prisma.agencyClient.updateMany({
      data: {
        monthlyUpdateCount: 0,
      },
    });
    return result.count;
  }

  /**
   * Count clients by service tier
   */
  async countByServiceTier(serviceTier: string): Promise<number> {
    return this.prisma.agencyClient.count({
      where: { serviceTier },
    });
  }

  /**
   * Count active clients
   */
  async countActive(): Promise<number> {
    return this.prisma.agencyClient.count({
      where: { status: 'active' },
    });
  }

  /**
   * Find clients needing health checks
   */
  async findNeedingHealthCheck(): Promise<AgencyClient[]> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return this.prisma.agencyClient.findMany({
      where: {
        OR: [
          { lastUpdated: null },
          {
            lastUpdated: {
              lt: weekAgo,
            },
          },
        ],
        status: 'active',
      },
      include: {
        restaurant: true,
      },
    });
  }
}
