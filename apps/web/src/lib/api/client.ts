import type {
  AnalysisResponse,
  AnalysisStatusResponse,
  RebuildPreview,
  WordPressConnectionTestResponse,
  WordPressDeploymentResponse,
  DeploymentStatusResponse,
} from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'API request failed',
      response.status,
      errorData
    );
  }

  return response.json();
}

export const api = {
  // Scraper endpoints
  scraper: {
    analyze: async (url: string): Promise<AnalysisResponse> => {
      return fetchApi<AnalysisResponse>('/scraper/analyze', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });
    },

    getStatus: async (analysisId: string): Promise<AnalysisStatusResponse> => {
      return fetchApi<AnalysisStatusResponse>(`/scraper/status/${analysisId}`);
    },
  },

  // Rebuild endpoints
  rebuild: {
    generate: async (analysisId: string, templateType?: string): Promise<RebuildPreview> => {
      return fetchApi<RebuildPreview>('/rebuild/generate', {
        method: 'POST',
        body: JSON.stringify({ analysisId, templateType }),
      });
    },

    getPreview: async (rebuildId: string): Promise<RebuildPreview> => {
      return fetchApi<RebuildPreview>(`/rebuild/preview/${rebuildId}`);
    },

    refineContent: async (rebuildId: string, instruction: string): Promise<RebuildPreview> => {
      return fetchApi<RebuildPreview>(`/rebuild/refine`, {
        method: 'POST',
        body: JSON.stringify({ rebuildId, instruction }),
      });
    },
  },

  // WordPress deployment endpoints
  wordpress: {
    testConnection: async (baseUrl: string, apiKey: string): Promise<WordPressConnectionTestResponse> => {
      return fetchApi<WordPressConnectionTestResponse>('/wordpress/test-connection', {
        method: 'POST',
        body: JSON.stringify({ baseUrl, apiKey }),
      });
    },

    deploy: async (rebuildId: string, wordPressSiteId: string): Promise<WordPressDeploymentResponse> => {
      return fetchApi<WordPressDeploymentResponse>('/wordpress/deploy', {
        method: 'POST',
        body: JSON.stringify({ rebuildId, wordPressSiteId }),
      });
    },

    getDeploymentStatus: async (deploymentId: string): Promise<DeploymentStatusResponse> => {
      return fetchApi<DeploymentStatusResponse>(`/wordpress/deployment/${deploymentId}`);
    },
  },
};

export { ApiError };
