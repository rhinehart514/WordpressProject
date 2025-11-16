import { Injectable, Logger } from '@nestjs/common';
import { PageTemplate } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreatePageTemplateDto {
  name: string;
  type: string; // 'restaurant' | 'menu' | 'about' | 'contact' | etc.
  description?: string;
  config: any; // Template configuration JSON
  isActive?: boolean;
}

export interface UpdatePageTemplateDto {
  name?: string;
  type?: string;
  description?: string;
  config?: any;
  isActive?: boolean;
}

@Injectable()
export class PageTemplateRepository {
  private readonly logger = new Logger(PageTemplateRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new page template
   */
  async create(data: CreatePageTemplateDto): Promise<PageTemplate> {
    return this.prisma.pageTemplate.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        config: data.config,
        isActive: data.isActive ?? true,
      },
    });
  }

  /**
   * Find page template by ID
   */
  async findById(id: string): Promise<PageTemplate | null> {
    return this.prisma.pageTemplate.findUnique({
      where: { id },
    });
  }

  /**
   * Find all active page templates
   */
  async findAllActive(): Promise<PageTemplate[]> {
    return this.prisma.pageTemplate.findMany({
      where: { isActive: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find page templates by type
   */
  async findByType(type: string): Promise<PageTemplate[]> {
    return this.prisma.pageTemplate.findMany({
      where: {
        type,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find all page templates
   */
  async findAll(limit: number = 100): Promise<PageTemplate[]> {
    return this.prisma.pageTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Update page template
   */
  async update(
    id: string,
    data: UpdatePageTemplateDto,
  ): Promise<PageTemplate> {
    return this.prisma.pageTemplate.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete page template
   */
  async delete(id: string): Promise<PageTemplate> {
    return this.prisma.pageTemplate.delete({
      where: { id },
    });
  }

  /**
   * Deactivate template
   */
  async deactivate(id: string): Promise<PageTemplate> {
    return this.prisma.pageTemplate.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Activate template
   */
  async activate(id: string): Promise<PageTemplate> {
    return this.prisma.pageTemplate.update({
      where: { id },
      data: { isActive: true },
    });
  }

  /**
   * Count templates by type
   */
  async countByType(type: string): Promise<number> {
    return this.prisma.pageTemplate.count({
      where: { type, isActive: true },
    });
  }
}
