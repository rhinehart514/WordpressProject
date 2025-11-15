import { create } from 'zustand';

export type AnalysisStep = 'idle' | 'scraping' | 'analyzing' | 'generating' | 'complete' | 'error';

export interface PageAnalysis {
  url: string;
  pageType: string;
  confidence: number;
  title: string;
  blockCount: number;
  assetCount: number;
}

export interface SiteAnalysisResult {
  id: string;
  url: string;
  restaurantInfo: {
    name?: string;
    logo?: string;
    primaryColor?: string;
  };
  pageCount: number;
  pages: PageAnalysis[];
  status: string;
}

export interface RebuildPreview {
  id: string;
  previewUrl: string;
  status: string;
  pageCount: number;
}

export interface WordPressConnection {
  baseUrl: string;
  apiKey: string;
  isValid: boolean;
  siteName?: string;
  version?: string;
}

export type DeploymentStep = 'idle' | 'connecting' | 'uploading' | 'publishing' | 'complete' | 'error';

export interface DeploymentStatus {
  id: string;
  step: DeploymentStep;
  progress: number;
  pagesDeployed: number;
  totalPages: number;
  siteUrl?: string;
  error?: string;
}

interface AnalysisStore {
  // State
  currentStep: AnalysisStep;
  analysisId: string | null;
  siteData: SiteAnalysisResult | null;
  rebuildData: RebuildPreview | null;
  error: string | null;
  progress: number;

  // WordPress Connection State
  wordpressConnection: WordPressConnection | null;
  isTestingConnection: boolean;
  connectionError: string | null;

  // Deployment State
  deploymentStatus: DeploymentStatus | null;
  isDeploying: boolean;

  // Actions
  setStep: (step: AnalysisStep) => void;
  setAnalysisId: (id: string) => void;
  setSiteData: (data: SiteAnalysisResult) => void;
  setRebuildData: (data: RebuildPreview) => void;
  setError: (error: string) => void;
  setProgress: (progress: number) => void;
  reset: () => void;

  // WordPress Actions
  setWordPressConnection: (connection: WordPressConnection) => void;
  setTestingConnection: (isTesting: boolean) => void;
  setConnectionError: (error: string | null) => void;
  clearWordPressConnection: () => void;

  // Deployment Actions
  setDeploymentStatus: (status: DeploymentStatus) => void;
  setDeploying: (isDeploying: boolean) => void;
  clearDeployment: () => void;

  // Computed
  isAnalyzing: () => boolean;
  hasError: () => boolean;
  hasPreview: () => boolean;
  isConnected: () => boolean;
  isDeploymentComplete: () => boolean;
}

const initialState = {
  currentStep: 'idle' as AnalysisStep,
  analysisId: null,
  siteData: null,
  rebuildData: null,
  error: null,
  progress: 0,
  wordpressConnection: null,
  isTestingConnection: false,
  connectionError: null,
  deploymentStatus: null,
  isDeploying: false,
};

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  setAnalysisId: (id) => set({ analysisId: id }),

  setSiteData: (data) => set({ siteData: data }),

  setRebuildData: (data) => set({ rebuildData: data }),

  setError: (error) => set({ error, currentStep: 'error' }),

  setProgress: (progress) => set({ progress }),

  reset: () => set(initialState),

  // WordPress Actions
  setWordPressConnection: (connection) => set({ wordpressConnection: connection, connectionError: null }),

  setTestingConnection: (isTesting) => set({ isTestingConnection: isTesting }),

  setConnectionError: (error) => set({ connectionError: error }),

  clearWordPressConnection: () => set({ wordpressConnection: null, connectionError: null }),

  // Deployment Actions
  setDeploymentStatus: (status) => set({ deploymentStatus: status }),

  setDeploying: (isDeploying) => set({ isDeploying }),

  clearDeployment: () => set({ deploymentStatus: null, isDeploying: false }),

  // Computed selectors
  isAnalyzing: () => {
    const { currentStep } = get();
    return ['scraping', 'analyzing', 'generating'].includes(currentStep);
  },

  hasError: () => get().error !== null,

  hasPreview: () => get().rebuildData !== null && get().rebuildData!.previewUrl !== null,

  isConnected: () => get().wordpressConnection !== null && get().wordpressConnection!.isValid,

  isDeploymentComplete: () => {
    const { deploymentStatus } = get();
    return deploymentStatus !== null && deploymentStatus.step === 'complete';
  },
}));
