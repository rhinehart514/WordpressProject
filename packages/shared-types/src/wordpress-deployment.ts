import { UUID, URL, Timestamp, DeploymentStatus, AggregateRoot, Entity } from './common';
import { BricksElement } from './content-rebuild';

// WordPress Endpoint Configuration
export interface WordPressEndpoint {
  baseUrl: URL;
  apiKey: string;
  siteId?: string;
}

// Media Asset
export interface MediaAsset extends Entity {
  url: URL;
  wordpressMediaId?: number;
  fileName: string;
  mimeType: string;
  fileSize?: number;
  alt?: string;
  title?: string;
}

// Bricks Page for Deployment
export interface BricksPageDeploy {
  type: string;
  title: string;
  slug: string;
  elements: BricksElement[];
  assets: MediaAsset[];
  status: 'draft' | 'publish';
  headerTemplateId?: string;
  footerTemplateId?: string;
}

// Deployed Page Info
export interface DeployedPageInfo {
  pageType: string;
  wordpressPageId: number;
  url: URL;
  editUrl: URL;
}

// WordPress Site Configuration
export interface WordPressSite extends Entity {
  restaurantId: UUID;
  baseUrl: URL;
  apiKeyEncrypted: string;
  siteMetadata: {
    siteName?: string;
    adminEmail?: string;
    wpVersion?: string;
    bricksVersion?: string;
    themeActive?: string;
  };
  lastHealthCheck?: Timestamp;
  healthStatus?: 'healthy' | 'warning' | 'error';
}

// Deployment Job (Aggregate Root)
export interface DeploymentJob extends AggregateRoot {
  rebuildId: UUID;
  wordPressSiteId: UUID;
  status: DeploymentStatus;
  deployedPages: Map<string, DeployedPageInfo>;
  errorLog?: string[];
  completedAt?: Timestamp;
}

// DTOs
export interface StartDeploymentDto {
  rebuildId: UUID;
  wordPressSiteId: UUID;
  publishImmediately?: boolean;
}

export interface DeploymentResultDto {
  id: UUID;
  status: DeploymentStatus;
  deployedPages: DeployedPageInfo[];
  errors?: string[];
  completedAt?: Timestamp;
}

export interface WordPressConnectionDto {
  baseUrl: URL;
  apiKey: string;
}

export interface WordPressConnectionTestResult {
  success: boolean;
  siteInfo?: {
    siteName: string;
    wpVersion: string;
    bricksVersion?: string;
  };
  error?: string;
}
