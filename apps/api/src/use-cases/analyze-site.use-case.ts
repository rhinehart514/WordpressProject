import { Injectable, Logger } from '@nestjs/common';
import { SiteAnalysisRepository } from '../repositories';
import { OpenAIService } from '../modules/openai';
import { ScraperService } from '../modules/scraper/scraper.service';
import { PrismaService } from '../prisma';

export interface AnalyzeSiteResult {
  analysisId: string;
  url: string;
  status: 'analyzing' | 'completed' | 'failed';
  restaurantInfo?: {
    name: string;
    description: string;
    primaryColors: string[];
    contactInfo?: any;
  };
  pages?: Array<{
    url: string;
    pageType: string;
    confidence: number;
  }>;
  error?: string;
}

@Injectable()
export class AnalyzeSiteUseCase {
  private readonly logger = new Logger(AnalyzeSiteUseCase.name);

  constructor(
    private readonly siteAnalysisRepo: SiteAnalysisRepository,
    private readonly openaiService: OpenAIService,
    private readonly scraperService: ScraperService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Analyze a website and extract restaurant information
   */
  async execute(url: string): Promise<AnalyzeSiteResult> {
    this.logger.log(`Starting analysis for ${url}`);

    try {
      // Step 1: Create analysis record
      const analysis = await this.siteAnalysisRepo.create({
        url,
        status: 'analyzing',
        metadata: { startedAt: new Date().toISOString() },
      });

      // Step 2: Fetch website content (simplified - in reality would use scraper)
      const scrapedContent = await this.fetchWebsiteContent(url);

      // Step 3: Use OpenAI to analyze the content
      const aiAnalysis = await this.openaiService.analyzeWebsite(
        url,
        scrapedContent,
      );

      // Step 4: Store analysis results
      const updatedAnalysis = await this.siteAnalysisRepo.update(analysis.id, {
        status: 'completed',
        metadata: {
          ...analysis.metadata,
          completedAt: new Date().toISOString(),
          aiAnalysis,
        },
      });

      // Step 5: Create scraped pages
      if (aiAnalysis.pageTypes && Array.isArray(aiAnalysis.pageTypes)) {
        for (const pageType of aiAnalysis.pageTypes) {
          await this.prisma.scrapedPage.create({
            data: {
              siteAnalysisId: analysis.id,
              url: `${url}/${pageType.toLowerCase()}`,
              pageType: pageType,
              confidence: 0.8,
              rawContent: {},
            },
          });
        }
      }

      return {
        analysisId: analysis.id,
        url,
        status: 'completed',
        restaurantInfo: {
          name: aiAnalysis.restaurantName || 'Unknown Restaurant',
          description: aiAnalysis.description || '',
          primaryColors: aiAnalysis.primaryColors || [],
          contactInfo: aiAnalysis.contactInfo,
        },
        pages: aiAnalysis.pageTypes?.map((type: string) => ({
          url: `${url}/${type.toLowerCase()}`,
          pageType: type,
          confidence: 0.8,
        })),
      };
    } catch (error) {
      this.logger.error('Error analyzing site', error);

      return {
        analysisId: '',
        url,
        status: 'failed',
        error: error.message,
      };
    }
  }

  /**
   * Get analysis status
   */
  async getStatus(analysisId: string): Promise<AnalyzeSiteResult> {
    const analysis = await this.siteAnalysisRepo.findByIdWithPages(analysisId);

    if (!analysis) {
      throw new Error('Analysis not found');
    }

    return {
      analysisId: analysis.id,
      url: analysis.url,
      status: analysis.status as any,
      restaurantInfo: analysis.metadata?.aiAnalysis
        ? {
            name: analysis.metadata.aiAnalysis.restaurantName,
            description: analysis.metadata.aiAnalysis.description,
            primaryColors: analysis.metadata.aiAnalysis.primaryColors || [],
            contactInfo: analysis.metadata.aiAnalysis.contactInfo,
          }
        : undefined,
      pages: analysis.pages?.map((page) => ({
        url: page.url,
        pageType: page.pageType,
        confidence: page.confidence,
      })),
    };
  }

  /**
   * Fetch website content using Puppeteer scraper
   */
  private async fetchWebsiteContent(url: string): Promise<any> {
    try {
      const scrapedData = await this.scraperService.scrapePage(url);

      return {
        title: scrapedData.title,
        description: scrapedData.description,
        content: scrapedData.text,
        images: scrapedData.images,
        links: scrapedData.links,
        metadata: scrapedData.metadata,
      };
    } catch (error) {
      this.logger.error(`Error scraping ${url}`, error);
      throw error;
    }
  }
}
