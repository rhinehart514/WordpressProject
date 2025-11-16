import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { PreviewService } from './preview.service';
import { PrismaService } from '../../prisma';

@Controller('preview')
export class PreviewController {
  constructor(
    private readonly previewService: PreviewService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Generate HTML preview for a rebuild
   */
  @Get(':rebuildId')
  async getPreview(@Param('rebuildId') rebuildId: string, @Res() res: Response) {
    // Get the rebuild with pages
    const rebuild = await this.prisma.siteRebuild.findUnique({
      where: { id: rebuildId },
      include: {
        pages: true,
        siteAnalysis: true,
      },
    });

    if (!rebuild) {
      throw new NotFoundException(`Rebuild ${rebuildId} not found`);
    }

    // Get restaurant name from metadata or default
    const metadata = rebuild.siteAnalysis?.metadata as any;
    const restaurantName =
      metadata?.aiAnalysis?.restaurantName ||
      'Restaurant Preview';

    // Convert pages to preview format
    const pages = rebuild.pages.map((page) => ({
      title: page.title,
      slug: page.slug,
      elements: page.elements,
    }));

    // Generate HTML
    const html = this.previewService.generatePreviewPage(pages, restaurantName);

    // Send HTML response
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  /**
   * Generate HTML preview for a single page
   */
  @Get(':rebuildId/:pageSlug')
  async getPagePreview(
    @Param('rebuildId') rebuildId: string,
    @Param('pageSlug') pageSlug: string,
    @Res() res: Response,
  ) {
    // Get the page
    const page = await this.prisma.bricksPageStructure.findFirst({
      where: {
        rebuildId,
        slug: pageSlug,
      },
    });

    if (!page) {
      throw new NotFoundException(
        `Page ${pageSlug} not found in rebuild ${rebuildId}`,
      );
    }

    // Generate HTML
    const elements = Array.isArray(page.elements) ? page.elements : [];
    const html = this.previewService.generateHTML(elements as any[], page.title);

    // Send HTML response
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
