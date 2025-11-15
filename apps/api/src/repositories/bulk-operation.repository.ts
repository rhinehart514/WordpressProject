import { Injectable, Logger } from '@nestjs/common';
import { BulkOperation } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreateBulkOperationDto {
  operationType: string; // 'menu_update' | 'hours_update' | etc.
  targetClientIds: string[];
  payload?: any;
  initiatedByUserId: string;
}

export interface UpdateBulkOperationDto {
  status?: string; // 'pending' | 'in_progress' | 'completed' | 'failed'
  progress?: number; // 0-100
  completedCount?: number;
  failedCount?: number;
  errors?: any;
}

@Injectable()
export class BulkOperationRepository {
  private readonly logger = new Logger(BulkOperationRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new bulk operation
   */
  async create(data: CreateBulkOperationDto): Promise<BulkOperation> {
    return this.prisma.bulkOperation.create({
      data: {
        operationType: data.operationType,
        targetClientIds: data.targetClientIds,
        status: 'pending',
        progress: 0,
        completedCount: 0,
        failedCount: 0,
        payload: data.payload,
        initiatedByUserId: data.initiatedByUserId,
      },
    });
  }

  /**
   * Find bulk operation by ID
   */
  async findById(id: string): Promise<BulkOperation | null> {
    return this.prisma.bulkOperation.findUnique({
      where: { id },
    });
  }

  /**
   * Find all bulk operations
   */
  async findAll(limit: number = 50): Promise<BulkOperation[]> {
    return this.prisma.bulkOperation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Find bulk operations by initiator
   */
  async findByInitiator(initiatedByUserId: string): Promise<BulkOperation[]> {
    return this.prisma.bulkOperation.findMany({
      where: { initiatedByUserId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find bulk operations by status
   */
  async findByStatus(status: string): Promise<BulkOperation[]> {
    return this.prisma.bulkOperation.findMany({
      where: { status },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find bulk operations by type
   */
  async findByOperationType(operationType: string): Promise<BulkOperation[]> {
    return this.prisma.bulkOperation.findMany({
      where: { operationType },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update bulk operation
   */
  async update(
    id: string,
    data: UpdateBulkOperationDto,
  ): Promise<BulkOperation> {
    return this.prisma.bulkOperation.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete bulk operation
   */
  async delete(id: string): Promise<BulkOperation> {
    return this.prisma.bulkOperation.delete({
      where: { id },
    });
  }

  /**
   * Update progress
   */
  async updateProgress(
    id: string,
    progress: number,
    completedCount: number,
    failedCount: number,
  ): Promise<BulkOperation> {
    return this.prisma.bulkOperation.update({
      where: { id },
      data: {
        progress,
        completedCount,
        failedCount,
      },
    });
  }

  /**
   * Mark operation as in progress
   */
  async markInProgress(id: string): Promise<BulkOperation> {
    return this.prisma.bulkOperation.update({
      where: { id },
      data: {
        status: 'in_progress',
      },
    });
  }

  /**
   * Mark operation as completed
   */
  async markCompleted(id: string): Promise<BulkOperation> {
    return this.prisma.bulkOperation.update({
      where: { id },
      data: {
        status: 'completed',
        progress: 100,
      },
    });
  }

  /**
   * Mark operation as failed
   */
  async markFailed(id: string, errors: any): Promise<BulkOperation> {
    return this.prisma.bulkOperation.update({
      where: { id },
      data: {
        status: 'failed',
        errors,
      },
    });
  }

  /**
   * Add error to operation
   */
  async addError(id: string, error: { clientId: string; error: string }): Promise<BulkOperation> {
    const operation = await this.findById(id);
    if (!operation) throw new Error('Bulk operation not found');

    const errors = operation.errors as any[] || [];
    errors.push(error);

    return this.prisma.bulkOperation.update({
      where: { id },
      data: {
        errors,
        failedCount: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Find in-progress operations
   */
  async findInProgress(): Promise<BulkOperation[]> {
    return this.prisma.bulkOperation.findMany({
      where: {
        status: {
          in: ['pending', 'in_progress'],
        },
      },
    });
  }

  /**
   * Count operations by status
   */
  async countByStatus(status: string): Promise<number> {
    return this.prisma.bulkOperation.count({
      where: { status },
    });
  }
}
