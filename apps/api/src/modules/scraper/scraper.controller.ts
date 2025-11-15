import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';
import { ContentClassifierService } from './content-classifier.service';

class ScrapeUrlDto {
  url: string;
}

@ApiTags('Scraper')
@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly classifierService: ContentClassifierService,
  ) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analyze a restaurant website' })
  @ApiResponse({ status: 200, description: 'Site analysis completed' })
  async analyzeSite(@Body() dto: ScrapeUrlDto) {
    // Scrape the site
    const pages = await this.scraperService.scrapeRestaurantSite(dto.url);

    // Extract restaurant info
    const restaurantInfo = await this.scraperService.extractRestaurantInfo(dto.url);

    // Classify each page and extract blocks
    const analyzedPages = pages.map((page) => {
      const classification = this.classifierService.classifyPage(page);
      const blocks = this.classifierService.extractBlocks(page, classification.pageType);

      return {
        url: page.url,
        pageType: classification.pageType,
        confidence: classification.confidence,
        title: page.title,
        blockCount: blocks.length,
        assetCount: page.images.length,
        blocks,
        images: page.images,
      };
    });

    return {
      success: true,
      url: dto.url,
      restaurantInfo,
      pageCount: analyzedPages.length,
      pages: analyzedPages,
    };
  }

  @Post('scrape-page')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Scrape a single page' })
  @ApiResponse({ status: 200, description: 'Page scraped successfully' })
  async scrapePage(@Body() dto: ScrapeUrlDto) {
    const content = await this.scraperService.scrapePage(dto.url);
    const classification = this.classifierService.classifyPage(content);
    const blocks = this.classifierService.extractBlocks(content, classification.pageType);

    return {
      success: true,
      url: dto.url,
      pageType: classification.pageType,
      confidence: classification.confidence,
      title: content.title,
      description: content.description,
      blocks,
      images: content.images,
      metadata: content.metadata,
    };
  }
}
