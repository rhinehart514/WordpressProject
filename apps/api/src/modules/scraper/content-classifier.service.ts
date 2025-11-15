import { Injectable, Logger } from '@nestjs/common';
import { ScrapedContent } from './scraper.service';

export enum PageType {
  HOMEPAGE = 'homepage',
  MENU = 'menu',
  ABOUT = 'about',
  CONTACT = 'contact',
  GALLERY = 'gallery',
  HOURS = 'hours',
  UNKNOWN = 'unknown',
}

export interface PageClassification {
  pageType: PageType;
  confidence: number;
}

export interface ContentBlock {
  blockType: string;
  content: any;
  position: number;
}

@Injectable()
export class ContentClassifierService {
  private readonly logger = new Logger(ContentClassifierService.name);

  classifyPage(content: ScrapedContent): PageClassification {
    const url = content.url.toLowerCase();
    const text = content.text.toLowerCase();
    const title = content.title?.toLowerCase() || '';

    // Homepage detection
    if (this.isHomepage(url)) {
      return { pageType: PageType.HOMEPAGE, confidence: 0.95 };
    }

    // Menu page detection
    if (this.isMenuPage(url, text, title)) {
      return { pageType: PageType.MENU, confidence: 0.9 };
    }

    // About page detection
    if (this.isAboutPage(url, text, title)) {
      return { pageType: PageType.ABOUT, confidence: 0.85 };
    }

    // Contact page detection
    if (this.isContactPage(url, text, title)) {
      return { pageType: PageType.CONTACT, confidence: 0.85 };
    }

    // Gallery page detection
    if (this.isGalleryPage(url, text, title, content.images.length)) {
      return { pageType: PageType.GALLERY, confidence: 0.8 };
    }

    // Hours page detection
    if (this.isHoursPage(url, text, title)) {
      return { pageType: PageType.HOURS, confidence: 0.8 };
    }

    return { pageType: PageType.UNKNOWN, confidence: 0.5 };
  }

  extractBlocks(content: ScrapedContent, pageType: PageType): ContentBlock[] {
    const blocks: ContentBlock[] = [];

    switch (pageType) {
      case PageType.HOMEPAGE:
        blocks.push(...this.extractHomepageBlocks(content));
        break;
      case PageType.MENU:
        blocks.push(...this.extractMenuBlocks(content));
        break;
      case PageType.ABOUT:
        blocks.push(...this.extractAboutBlocks(content));
        break;
      case PageType.CONTACT:
        blocks.push(...this.extractContactBlocks(content));
        break;
      case PageType.GALLERY:
        blocks.push(...this.extractGalleryBlocks(content));
        break;
      case PageType.HOURS:
        blocks.push(...this.extractHoursBlocks(content));
        break;
      default:
        blocks.push(...this.extractGenericBlocks(content));
    }

    return blocks;
  }

  private isHomepage(url: string): boolean {
    const path = new URL(url).pathname;
    return path === '/' || path === '/home' || path === '/index.html';
  }

  private isMenuPage(url: string, text: string, title: string): boolean {
    const menuKeywords = ['menu', 'food', 'drink', 'appetizer', 'entree', 'dessert'];
    const hasMenuInUrl = url.includes('menu');
    const hasMenuInTitle = title.includes('menu');
    const hasMenuKeywords = menuKeywords.some((keyword) => text.includes(keyword));

    if (hasMenuInUrl) return true;
    if (hasMenuInTitle && hasMenuKeywords) return true;

    // Check for price patterns (indicates menu)
    const pricePattern = /\$\d+(\.\d{2})?/g;
    const priceMatches = text.match(pricePattern);
    if (priceMatches && priceMatches.length > 5) return true;

    return false;
  }

  private isAboutPage(url: string, text: string, title: string): boolean {
    const aboutKeywords = ['about', 'story', 'history', 'our team', 'mission'];
    const hasAboutInUrl = url.includes('about') || url.includes('story');
    const hasAboutInTitle = aboutKeywords.some((keyword) => title.includes(keyword));

    return hasAboutInUrl || hasAboutInTitle;
  }

  private isContactPage(url: string, text: string, title: string): boolean {
    const contactKeywords = ['contact', 'location', 'address', 'phone', 'email'];
    const hasContactInUrl = url.includes('contact') || url.includes('location');
    const hasContactInTitle = contactKeywords.some((keyword) => title.includes(keyword));
    const hasPhonePattern = /\(\d{3}\)\s?\d{3}-\d{4}/.test(text);
    const hasEmailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);

    return hasContactInUrl || hasContactInTitle || (hasPhonePattern && hasEmailPattern);
  }

  private isGalleryPage(url: string, text: string, title: string, imageCount: number): boolean {
    const galleryKeywords = ['gallery', 'photos', 'images', 'pictures'];
    const hasGalleryInUrl = url.includes('gallery') || url.includes('photos');
    const hasGalleryInTitle = galleryKeywords.some((keyword) => title.includes(keyword));
    const hasManyImages = imageCount > 10;

    return hasGalleryInUrl || hasGalleryInTitle || hasManyImages;
  }

  private isHoursPage(url: string, text: string, title: string): boolean {
    const hoursKeywords = ['hours', 'schedule', 'open', 'closed'];
    const hasHoursInUrl = url.includes('hours');
    const hasHoursInTitle = hoursKeywords.some((keyword) => title.includes(keyword));
    const hasDayPattern = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi;
    const dayMatches = text.match(hasDayPattern);

    return hasHoursInUrl || hasHoursInTitle || (dayMatches && dayMatches.length >= 3);
  }

  private extractHomepageBlocks(content: ScrapedContent): ContentBlock[] {
    const blocks: ContentBlock[] = [];

    // Hero section (first large image or banner)
    if (content.images.length > 0) {
      const heroImage = content.images[0];
      blocks.push({
        blockType: 'hero',
        content: {
          image: heroImage.url,
          alt: heroImage.alt,
          title: content.title,
        },
        position: 0,
      });
    }

    // Extract text sections
    const paragraphs = content.text.split('\n').filter((p) => p.trim().length > 50);
    if (paragraphs.length > 0) {
      blocks.push({
        blockType: 'text',
        content: {
          text: paragraphs[0],
        },
        position: 1,
      });
    }

    return blocks;
  }

  private extractMenuBlocks(content: ScrapedContent): ContentBlock[] {
    const blocks: ContentBlock[] = [];

    // Simple menu extraction (looks for items with prices)
    const lines = content.text.split('\n');
    const menuItems: any[] = [];

    lines.forEach((line) => {
      const priceMatch = line.match(/\$(\d+(?:\.\d{2})?)/);
      if (priceMatch && line.length > 10 && line.length < 200) {
        const price = priceMatch[0];
        const name = line.replace(price, '').trim();

        if (name.length > 3) {
          menuItems.push({
            name,
            price,
            description: '',
          });
        }
      }
    });

    if (menuItems.length > 0) {
      blocks.push({
        blockType: 'menu_section',
        content: {
          title: 'Menu',
          items: menuItems,
        },
        position: 0,
      });
    }

    return blocks;
  }

  private extractAboutBlocks(content: ScrapedContent): ContentBlock[] {
    const blocks: ContentBlock[] = [];

    const paragraphs = content.text.split('\n\n').filter((p) => p.trim().length > 50);

    paragraphs.forEach((paragraph, index) => {
      blocks.push({
        blockType: 'text',
        content: {
          text: paragraph.trim(),
        },
        position: index,
      });
    });

    return blocks;
  }

  private extractContactBlocks(content: ScrapedContent): ContentBlock[] {
    const blocks: ContentBlock[] = [];

    // Extract phone number
    const phoneMatch = content.text.match(/\(\d{3}\)\s?\d{3}-\d{4}/);

    // Extract email
    const emailMatch = content.text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

    // Extract address (simplified)
    const addressMatch = content.text.match(/\d+\s+[A-Za-z\s]+,\s+[A-Za-z\s]+,\s+[A-Z]{2}\s+\d{5}/);

    blocks.push({
      blockType: 'contact_info',
      content: {
        phone: phoneMatch?.[0],
        email: emailMatch?.[0],
        address: addressMatch?.[0],
      },
      position: 0,
    });

    return blocks;
  }

  private extractGalleryBlocks(content: ScrapedContent): ContentBlock[] {
    const blocks: ContentBlock[] = [];

    if (content.images.length > 0) {
      blocks.push({
        blockType: 'gallery',
        content: {
          images: content.images.map((img) => ({
            url: img.url,
            alt: img.alt,
          })),
        },
        position: 0,
      });
    }

    return blocks;
  }

  private extractHoursBlocks(content: ScrapedContent): ContentBlock[] {
    const blocks: ContentBlock[] = [];

    // Simple hours extraction
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hoursData: any[] = [];

    daysOfWeek.forEach((day) => {
      const regex = new RegExp(`${day}:?\\s*([\\d:apm\\s-]+)`, 'i');
      const match = content.text.match(regex);

      if (match) {
        hoursData.push({
          day,
          hours: match[1].trim(),
        });
      }
    });

    if (hoursData.length > 0) {
      blocks.push({
        blockType: 'hours',
        content: {
          hours: hoursData,
        },
        position: 0,
      });
    }

    return blocks;
  }

  private extractGenericBlocks(content: ScrapedContent): ContentBlock[] {
    const blocks: ContentBlock[] = [];

    // Just extract text and images
    const paragraphs = content.text.split('\n\n').filter((p) => p.trim().length > 50);

    paragraphs.slice(0, 5).forEach((paragraph, index) => {
      blocks.push({
        blockType: 'text',
        content: {
          text: paragraph.trim(),
        },
        position: index,
      });
    });

    return blocks;
  }
}
