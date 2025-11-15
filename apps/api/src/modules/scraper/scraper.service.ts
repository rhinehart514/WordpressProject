import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

export interface ScrapedContent {
  url: string;
  title?: string;
  description?: string;
  html: string;
  text: string;
  images: Array<{
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  }>;
  links: Array<{
    url: string;
    text: string;
  }>;
  metadata: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    keywords?: string[];
  };
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private browser?: Browser;

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.logger.log('Initializing Puppeteer browser...');
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
    }
  }

  async scrapePage(url: string): Promise<ScrapedContent> {
    await this.initialize();

    this.logger.log(`Scraping page: ${url}`);

    const page = await this.browser!.newPage();

    try {
      // Navigate to the page
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Extract content (runs in browser context where DOM is available)
      // @ts-ignore - This code runs in Puppeteer's browser context
      const content = await page.evaluate(() => {
        // Helper function to get text content
        const getText = (selector: string): string => {
          const element = document.querySelector(selector);
          return element?.textContent?.trim() || '';
        };

        // Helper function to get attribute
        const getAttr = (selector: string, attr: string): string => {
          const element = document.querySelector(selector);
          return element?.getAttribute(attr) || '';
        };

        // Extract images
        const images = Array.from(document.querySelectorAll('img')).map((img) => ({
          url: img.src,
          alt: img.alt,
          width: img.naturalWidth || undefined,
          height: img.naturalHeight || undefined,
        }));

        // Extract links
        const links = Array.from(document.querySelectorAll('a[href]')).map((a) => ({
          url: (a as HTMLAnchorElement).href,
          text: a.textContent?.trim() || '',
        }));

        // Extract metadata
        const keywords = getAttr('meta[name="keywords"]', 'content').split(',');

        return {
          title: document.title,
          description: getAttr('meta[name="description"]', 'content'),
          html: document.documentElement.outerHTML,
          text: document.body.innerText,
          images,
          links,
          metadata: {
            ogTitle: getAttr('meta[property="og:title"]', 'content'),
            ogDescription: getAttr('meta[property="og:description"]', 'content'),
            ogImage: getAttr('meta[property="og:image"]', 'content'),
            keywords: keywords.filter((k) => k.trim().length > 0),
          },
        };
      });

      this.logger.log(`Successfully scraped ${url}`);

      return {
        url,
        ...content,
      };
    } catch (error) {
      this.logger.error(`Failed to scrape ${url}:`, error);
      throw error;
    } finally {
      await page.close();
    }
  }

  async scrapeRestaurantSite(baseUrl: string): Promise<ScrapedContent[]> {
    this.logger.log(`Starting restaurant site scrape: ${baseUrl}`);

    const scrapedPages: ScrapedContent[] = [];

    // Scrape homepage
    const homepage = await this.scrapePage(baseUrl);
    scrapedPages.push(homepage);

    // Find common restaurant pages
    const commonPaths = [
      '/menu',
      '/about',
      '/contact',
      '/gallery',
      '/hours',
      '/location',
    ];

    // Extract links from homepage
    const internalLinks = homepage.links
      .filter((link) => link.url.startsWith(baseUrl))
      .map((link) => link.url);

    // Combine common paths with discovered links
    const urlsToScrape = new Set<string>();

    // Add common paths
    commonPaths.forEach((path) => {
      urlsToScrape.add(`${baseUrl}${path}`);
    });

    // Add discovered internal links
    internalLinks.forEach((link) => {
      // Only add if it's not too deep (max 2 levels)
      const path = link.replace(baseUrl, '');
      const depth = path.split('/').filter((p) => p.length > 0).length;
      if (depth <= 2) {
        urlsToScrape.add(link);
      }
    });

    // Remove homepage (already scraped)
    urlsToScrape.delete(baseUrl);
    urlsToScrape.delete(`${baseUrl}/`);

    // Scrape each URL
    for (const url of Array.from(urlsToScrape)) {
      try {
        const page = await this.scrapePage(url);
        scrapedPages.push(page);
      } catch (error) {
        this.logger.warn(`Failed to scrape ${url}, skipping...`);
      }
    }

    this.logger.log(`Scraped ${scrapedPages.length} pages from ${baseUrl}`);

    return scrapedPages;
  }

  async extractRestaurantInfo(url: string): Promise<{
    name?: string;
    logo?: string;
    primaryColor?: string;
  }> {
    await this.initialize();

    const page = await this.browser!.newPage();

    try {
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // @ts-ignore - This code runs in Puppeteer's browser context
      const info = await page.evaluate(() => {
        // Try to find restaurant name
        const name =
          document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
          document.querySelector('h1')?.textContent?.trim() ||
          document.title;

        // Try to find logo
        const logo =
          document.querySelector('img[class*="logo"]')?.getAttribute('src') ||
          document.querySelector('meta[property="og:image"]')?.getAttribute('content');

        // Try to extract primary color
        const computedStyle = window.getComputedStyle(document.body);
        const primaryColor = computedStyle.getPropertyValue('--primary-color') || '#1a1a1a';

        return { name, logo, primaryColor };
      });

      return info;
    } finally {
      await page.close();
    }
  }
}
