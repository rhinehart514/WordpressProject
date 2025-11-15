import { UUID, URL, Timestamp, AnalysisStatus, AggregateRoot } from './common';

// Page Type enum
export enum PageType {
  HOMEPAGE = 'homepage',
  MENU = 'menu',
  ABOUT = 'about',
  CONTACT = 'contact',
  GALLERY = 'gallery',
  HOURS = 'hours',
  UNKNOWN = 'unknown',
}

// Content Block Types
export enum ContentBlockType {
  HERO = 'hero',
  TEXT = 'text',
  IMAGE = 'image',
  GALLERY = 'gallery',
  MENU_SECTION = 'menu_section',
  MENU_ITEM = 'menu_item',
  CONTACT_INFO = 'contact_info',
  HOURS = 'hours',
  CTA = 'cta',
  FOOTER = 'footer',
}

// Site Metadata
export interface SiteMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

// Content Block
export interface ContentBlock {
  id: UUID;
  scrapedPageId: UUID;
  blockType: ContentBlockType;
  content: Record<string, any>;
  position: number;
  createdAt: Timestamp;
}

// Extracted Asset
export interface ExtractedAsset {
  id: UUID;
  url: URL;
  type: 'image' | 'video' | 'file';
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
}

// Scraped Page
export interface ScrapedPage {
  id: UUID;
  siteAnalysisId: UUID;
  url: URL;
  pageType: PageType;
  confidence: number;
  rawContent: any;
  blocks: ContentBlock[];
  assets: ExtractedAsset[];
  createdAt: Timestamp;
}

// Site Analysis (Aggregate Root)
export interface SiteAnalysis extends AggregateRoot {
  url: URL;
  status: AnalysisStatus;
  metadata: SiteMetadata;
  pages: ScrapedPage[];
  errorMessage?: string;
}

// DTOs for API
export interface StartSiteAnalysisDto {
  url: URL;
}

export interface SiteAnalysisResultDto {
  id: UUID;
  url: URL;
  status: AnalysisStatus;
  pageCount: number;
  metadata: SiteMetadata;
  pages: Array<{
    url: URL;
    pageType: PageType;
    confidence: number;
  }>;
}
