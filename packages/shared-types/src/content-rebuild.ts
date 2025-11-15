import { UUID, URL, Timestamp, RebuildStatus, AggregateRoot } from './common';
import { PageType } from './site-discovery';

// Template Types
export enum TemplateType {
  RESTAURANT_CLASSIC = 'restaurant_classic',
  RESTAURANT_MODERN = 'restaurant_modern',
  CAFE = 'cafe',
  FINE_DINING = 'fine_dining',
}

// Bricks Element Types
export enum BricksElementType {
  SECTION = 'section',
  CONTAINER = 'container',
  BLOCK = 'block',
  DIV = 'div',
  HEADING = 'heading',
  TEXT = 'text-basic',
  IMAGE = 'image',
  BUTTON = 'button',
  DIVIDER = 'divider',
}

// Bricks Element Configuration
export interface BricksElementSettings {
  _cssId?: string;
  _cssClasses?: string[];
  tag?: string;
  text?: string;
  image?: {
    url: URL;
    alt?: string;
    width?: number;
    height?: number;
  };
  _background?: {
    image?: { url: URL };
    color?: string;
    overlay?: { color: string };
  };
  _padding?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  _margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  [key: string]: any;
}

// Bricks Element
export interface BricksElement {
  id: string;
  name: BricksElementType | string;
  settings: BricksElementSettings;
  children?: BricksElement[];
}

// Bricks Page Structure
export interface BricksPageStructure {
  id: UUID;
  rebuildId: UUID;
  pageType: PageType;
  title: string;
  slug: string;
  elements: BricksElement[];
  createdAt: Timestamp;
}

// Page Template
export interface PageTemplate {
  id: UUID;
  name: string;
  type: TemplateType;
  description?: string;
  heroLayout: string;
  menuLayout: string;
  galleryLayout: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
}

// Preview URLs
export interface PreviewUrls {
  homepage: URL;
  menu?: URL;
  about?: URL;
  contact?: URL;
  gallery?: URL;
}

// Site Rebuild (Aggregate Root)
export interface SiteRebuild extends AggregateRoot {
  siteAnalysisId: UUID;
  templateId: UUID;
  status: RebuildStatus;
  pages: BricksPageStructure[];
  previewUrls?: PreviewUrls;
  errorMessage?: string;
}

// DTOs
export interface StartRebuildDto {
  siteAnalysisId: UUID;
  templateType?: TemplateType;
}

export interface RebuildResultDto {
  id: UUID;
  status: RebuildStatus;
  pageCount: number;
  previewUrls?: PreviewUrls;
  pages: Array<{
    pageType: PageType;
    title: string;
    elementCount: number;
  }>;
}
