import { Injectable, Logger } from '@nestjs/common';
import { SiteRebuild } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreateSiteRebuildDto {
  siteAnalysisId: string;
  templateId: string;
  status: string; // 'pending' | 'generating' | 'completed' | 'failed'
  previewUrls?: any;
}

export interface UpdateSiteRebuildDto {
  status?: string;
  previewUrls?: any;
  errorMessage?: string;
}

@Injectable()
export class SiteRebuildRepository {
  private readonly logger = new Logger(SiteRebuildRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new site rebuild
   */
  async create(data: CreateSiteRebuildDto): Promise<SiteRebuild> {
    return this.prisma.siteRebuild.create({
      data: {
        siteAnalysisId: data.siteAnalysisId,
        templateId: data.templateId,
        status: data.status,
        previewUrls: data.previewUrls,
      },
    });
  }

  /**
   * Find site rebuild by ID
   */
  async findById(id: string): Promise<SiteRebuild | null> {
    return this.prisma.siteRebuild.findUnique({
      where: { id },
    });
  }

  /**
   * Find site rebuild with all relations
   */
  async findByIdWithRelations(id: string) {
    return this.prisma.siteRebuild.findUnique({
      where: { id },
      include: {
        siteAnalysis: true,
        template: true,
        pages: true,
        deployments: true,
      },
    });
  }

  /**
   * Find all rebuilds for a site analysis
   */
  async findBySiteAnalysisId(siteAnalysisId: string): Promise<SiteRebuild[]> {
    return this.prisma.siteRebuild.findMany({
      where: { siteAnalysisId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find all site rebuilds
   */
  async findAll(limit: number = 50): Promise<SiteRebuild[]> {
    return this.prisma.siteRebuild.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Update site rebuild
   */
  async update(id: string, data: UpdateSiteRebuildDto): Promise<SiteRebuild> {
    return this.prisma.siteRebuild.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete site rebuild
   */
  async delete(id: string): Promise<SiteRebuild> {
    return this.prisma.siteRebuild.delete({
      where: { id },
    });
  }

  /**
   * Find rebuilds by status
   */
  async findByStatus(status: string): Promise<SiteRebuild[]> {
    return this.prisma.siteRebuild.findMany({
      where: { status },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Count rebuilds by status
   */
  async countByStatus(status: string): Promise<number> {
    return this.prisma.siteRebuild.count({
      where: { status },
    });
  }

  /**
   * Find latest rebuild for a site analysis
   */
  async findLatestBySiteAnalysisId(
    siteAnalysisId: string,
  ): Promise<SiteRebuild | null> {
    const rebuilds = await this.prisma.siteRebuild.findMany({
      where: { siteAnalysisId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });
    return rebuilds[0] || null;
  }
}
