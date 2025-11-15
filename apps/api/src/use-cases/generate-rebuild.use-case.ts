import { Injectable, Logger } from '@nestjs/common';
import { SiteAnalysisRepository } from '../repositories';
import { OpenAIService } from '../modules/openai';
import { PrismaClient } from '@prisma/client';

export interface GenerateRebuildResult {
  rebuildId: string;
  siteAnalysisId: string;
  status: 'generating' | 'completed' | 'failed';
  pages?: Array<{
    id: string;
    pageType: string;
    title: string;
    slug: string;
    elementsCount: number;
  }>;
  previewUrl?: string;
  error?: string;
}

@Injectable()
export class GenerateRebuildUseCase {
  private readonly logger = new Logger(GenerateRebuildUseCase.name);

  constructor(
    private readonly siteAnalysisRepo: SiteAnalysisRepository,
    private readonly openaiService: OpenAIService,
    private readonly prisma: PrismaClient,
  ) {}

  /**
   * Generate a Bricks rebuild from a site analysis
   */
  async execute(siteAnalysisId: string): Promise<GenerateRebuildResult> {
    this.logger.log(`Generating rebuild for analysis ${siteAnalysisId}`);

    try {
      // Step 1: Get the site analysis with pages
      const analysis = await this.siteAnalysisRepo.findByIdWithPages(
        siteAnalysisId,
      );

      if (!analysis) {
        throw new Error('Site analysis not found');
      }

      // Step 2: Get or create a page template
      let template = await this.prisma.pageTemplate.findFirst({
        where: { type: 'restaurant', isActive: true },
      });

      if (!template) {
        template = await this.prisma.pageTemplate.create({
          data: {
            name: 'Default Restaurant Template',
            type: 'restaurant',
            description: 'Modern restaurant template',
            config: {
              heroLayout: 'full-width',
              menuLayout: 'grid',
              colorScheme: 'modern',
            },
          },
        });
      }

      // Step 3: Create rebuild record
      const rebuild = await this.prisma.siteRebuild.create({
        data: {
          siteAnalysisId,
          templateId: template.id,
          status: 'generating',
        },
      });

      // Step 4: Generate Bricks pages for each scraped page
      const generatedPages = [];

      for (const scrapedPage of analysis.pages || []) {
        // Get content blocks for this page
        const blocks = await this.prisma.contentBlock.findMany({
          where: { scrapedPageId: scrapedPage.id },
        });

        // Use OpenAI to generate Bricks elements
        const bricksElements = await this.openaiService.generateBricksElements(
          scrapedPage.pageType,
          {
            blocks,
            metadata: analysis.metadata,
            pageType: scrapedPage.pageType,
          },
        );

        // Create Bricks page structure
        const pageStructure = await this.prisma.bricksPageStructure.create({
          data: {
            rebuildId: rebuild.id,
            pageType: scrapedPage.pageType,
            title: this.generatePageTitle(scrapedPage.pageType),
            slug: this.generateSlug(scrapedPage.pageType),
            elements: bricksElements,
          },
        });

        generatedPages.push({
          id: pageStructure.id,
          pageType: pageStructure.pageType,
          title: pageStructure.title,
          slug: pageStructure.slug,
          elementsCount: Array.isArray(bricksElements)
            ? bricksElements.length
            : 0,
        });
      }

      // Step 5: Update rebuild status
      const previewUrl = `http://localhost:3000/preview/${rebuild.id}`;

      await this.prisma.siteRebuild.update({
        where: { id: rebuild.id },
        data: {
          status: 'completed',
          previewUrls: { main: previewUrl },
        },
      });

      return {
        rebuildId: rebuild.id,
        siteAnalysisId,
        status: 'completed',
        pages: generatedPages,
        previewUrl,
      };
    } catch (error) {
      this.logger.error('Error generating rebuild', error);

      return {
        rebuildId: '',
        siteAnalysisId,
        status: 'failed',
        error: error.message,
      };
    }
  }

  /**
   * Get rebuild status
   */
  async getStatus(rebuildId: string): Promise<GenerateRebuildResult> {
    const rebuild = await this.prisma.siteRebuild.findUnique({
      where: { id: rebuildId },
      include: {
        pages: true,
      },
    });

    if (!rebuild) {
      throw new Error('Rebuild not found');
    }

    return {
      rebuildId: rebuild.id,
      siteAnalysisId: rebuild.siteAnalysisId,
      status: rebuild.status as any,
      pages: rebuild.pages.map((page) => ({
        id: page.id,
        pageType: page.pageType,
        title: page.title,
        slug: page.slug,
        elementsCount: Array.isArray(page.elements)
          ? (page.elements as any[]).length
          : 0,
      })),
      previewUrl: rebuild.previewUrls?.main,
    };
  }

  /**
   * Generate page title from type
   */
  private generatePageTitle(pageType: string): string {
    const titles: Record<string, string> = {
      home: 'Home',
      menu: 'Our Menu',
      about: 'About Us',
      contact: 'Contact Us',
      gallery: 'Gallery',
      hours: 'Hours & Location',
    };

    return titles[pageType.toLowerCase()] || pageType;
  }

  /**
   * Generate slug from type
   */
  private generateSlug(pageType: string): string {
    return pageType.toLowerCase().replace(/\s+/g, '-');
  }
}
