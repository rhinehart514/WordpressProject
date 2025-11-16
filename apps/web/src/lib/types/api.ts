// API Response Types
// Import store types for consistency
import type { SiteAnalysisResult, RebuildPreview } from '../store/analysis-store';

export interface AnalysisResponse {
  id: string;
  analysisId?: string;
  status: 'pending' | 'scraping' | 'analyzing' | 'completed' | 'failed';
  url: string;
  createdAt: string;
}

export interface AnalysisStatusResponse extends SiteAnalysisResult {
  status: 'pending' | 'scraping' | 'analyzing' | 'completed' | 'failed';
  progress?: number;
  error?: string;
}

// Re-export store types
export type { SiteAnalysisResult, RebuildPreview };

export interface WordPressConnectionTestResponse {
  success: boolean;
  message: string;
  siteName?: string;
  version?: string;
  siteUrl?: string;
  result?: {
    version?: string;
    siteUrl?: string;
    siteName?: string;
  };
}

export interface WordPressDeploymentResponse {
  id: string;
  deploymentId?: string;
  rebuildId: string;
  wordPressSiteId: string;
  status: 'pending' | 'deploying' | 'completed' | 'failed';
  createdAt: string;
}

export interface DeploymentStatusResponse {
  id: string;
  status: 'pending' | 'preparing' | 'uploading_media' | 'creating_pages' | 'configuring_theme' | 'completed' | 'failed';
  step?: string;
  currentStep?: string;
  progress?: number;
  error?: string;
  pagesDeployed?: number;
  totalPages?: number;
  siteUrl?: string;
  result?: {
    deployedPages?: number;
    deployedMedia?: number;
    siteUrl?: string;
  };
}
