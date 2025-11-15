import { Injectable, Logger } from '@nestjs/common';
import { DeploymentJob } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreateDeploymentJobDto {
  rebuildId: string;
  wordPressSiteId: string;
  status: string; // 'pending' | 'in_progress' | 'completed' | 'failed' | 'partial'
  deployedPages?: any;
  errorLog?: string[];
}

export interface UpdateDeploymentJobDto {
  status?: string;
  deployedPages?: any;
  errorLog?: string[];
  completedAt?: Date;
}

@Injectable()
export class DeploymentJobRepository {
  private readonly logger = new Logger(DeploymentJobRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new deployment job
   */
  async create(data: CreateDeploymentJobDto): Promise<DeploymentJob> {
    return this.prisma.deploymentJob.create({
      data: {
        rebuildId: data.rebuildId,
        wordPressSiteId: data.wordPressSiteId,
        status: data.status,
        deployedPages: data.deployedPages,
        errorLog: data.errorLog,
      },
    });
  }

  /**
   * Find deployment job by ID
   */
  async findById(id: string): Promise<DeploymentJob | null> {
    return this.prisma.deploymentJob.findUnique({
      where: { id },
    });
  }

  /**
   * Find deployment job with relations
   */
  async findByIdWithRelations(id: string) {
    return this.prisma.deploymentJob.findUnique({
      where: { id },
      include: {
        rebuild: true,
        wordPressSite: true,
      },
    });
  }

  /**
   * Find all deployment jobs for a rebuild
   */
  async findByRebuildId(rebuildId: string): Promise<DeploymentJob[]> {
    return this.prisma.deploymentJob.findMany({
      where: { rebuildId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find all deployment jobs for a WordPress site
   */
  async findByWordPressSiteId(
    wordPressSiteId: string,
  ): Promise<DeploymentJob[]> {
    return this.prisma.deploymentJob.findMany({
      where: { wordPressSiteId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find all deployment jobs
   */
  async findAll(limit: number = 50): Promise<DeploymentJob[]> {
    return this.prisma.deploymentJob.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Update deployment job
   */
  async update(
    id: string,
    data: UpdateDeploymentJobDto,
  ): Promise<DeploymentJob> {
    return this.prisma.deploymentJob.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete deployment job
   */
  async delete(id: string): Promise<DeploymentJob> {
    return this.prisma.deploymentJob.delete({
      where: { id },
    });
  }

  /**
   * Find deployment jobs by status
   */
  async findByStatus(status: string): Promise<DeploymentJob[]> {
    return this.prisma.deploymentJob.findMany({
      where: { status },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find in-progress deployments
   */
  async findInProgress(): Promise<DeploymentJob[]> {
    return this.prisma.deploymentJob.findMany({
      where: {
        status: {
          in: ['pending', 'in_progress'],
        },
      },
    });
  }

  /**
   * Mark deployment as completed
   */
  async markCompleted(id: string): Promise<DeploymentJob> {
    return this.prisma.deploymentJob.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }

  /**
   * Mark deployment as failed
   */
  async markFailed(id: string, error: string): Promise<DeploymentJob> {
    return this.prisma.deploymentJob.update({
      where: { id },
      data: {
        status: 'failed',
        errorLog: { push: error },
        completedAt: new Date(),
      },
    });
  }
}
