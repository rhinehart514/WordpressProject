import { Injectable, Logger } from '@nestjs/common';
import { SiteAnalysis, ScrapedPage } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreateSiteAnalysisDto {
  url: string;
  status: string; // 'pending' | 'scraping' | 'analyzing' | 'completed' | 'failed'
  metadata?: any;
}

export interface UpdateSiteAnalysisDto {
  status?: string;
  metadata?: any;
  errorMessage?: string;
}

export interface SiteAnalysisWithPages extends SiteAnalysis {
  pages: ScrapedPage[];
}

@Injectable()
export class SiteAnalysisRepository {
  private readonly logger = new Logger(SiteAnalysisRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new site analysis
   */
  async create(data: CreateSiteAnalysisDto): Promise<SiteAnalysis> {
    return this.prisma.siteAnalysis.create({
      data: {
        url: data.url,
        status: data.status,
        metadata: data.metadata,
      },
    });
  }

  /**
   * Find site analysis by ID
   */
  async findById(id: string): Promise<SiteAnalysis | null> {
    return this.prisma.siteAnalysis.findUnique({
      where: { id },
    });
  }

  /**
   * Find site analysis by ID with pages
   */
  async findByIdWithPages(id: string): Promise<SiteAnalysisWithPages | null> {
    return this.prisma.siteAnalysis.findUnique({
      where: { id },
      include: {
        pages: {
          include: {
            blocks: true,
            assets: true,
          },
        },
      },
    });
  }

  /**
   * Find site analysis by URL
   */
  async findByUrl(url: string): Promise<SiteAnalysis | null> {
    return this.prisma.siteAnalysis.findFirst({
      where: { url },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find all site analyses
   */
  async findAll(limit: number = 20): Promise<SiteAnalysis[]> {
    return this.prisma.siteAnalysis.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Update site analysis
   */
  async update(
    id: string,
    data: UpdateSiteAnalysisDto,
  ): Promise<SiteAnalysis> {
    return this.prisma.siteAnalysis.update({
      where: { id },
      data: {
        status: data.status,
        metadata: data.metadata,
        errorMessage: data.errorMessage,
      },
    });
  }

  /**
   * Delete site analysis
   */
  async delete(id: string): Promise<SiteAnalysis> {
    return this.prisma.siteAnalysis.delete({
      where: { id },
    });
  }

  /**
   * Count site analyses by status
   */
  async countByStatus(status: string): Promise<number> {
    return this.prisma.siteAnalysis.count({
      where: { status },
    });
  }

  /**
   * Find recent analyses for a URL
   */
  async findRecentByUrl(
    url: string,
    limit: number = 5,
  ): Promise<SiteAnalysis[]> {
    return this.prisma.siteAnalysis.findMany({
      where: { url },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }
}
