import { useCallback } from 'react';
import { useAnalysisStore, DeploymentStep } from '../store/analysis-store';
import { api } from '../api/client';

// Helper to map API status to DeploymentStep
function mapToDeploymentStep(status: string): DeploymentStep {
  const statusMap: Record<string, DeploymentStep> = {
    'pending': 'idle',
    'preparing': 'connecting',
    'uploading_media': 'uploading',
    'creating_pages': 'uploading',
    'configuring_theme': 'publishing',
    'completed': 'complete',
    'failed': 'error',
  };
  return statusMap[status] || 'idle';
}

export function useWordPress() {
  const {
    wordpressConnection,
    isTestingConnection,
    connectionError,
    deploymentStatus,
    isDeploying,
    rebuildData,
    setWordPressConnection,
    setTestingConnection,
    setConnectionError,
    setDeploymentStatus,
    setDeploying,
    clearWordPressConnection,
    clearDeployment,
    isConnected,
    isDeploymentComplete,
  } = useAnalysisStore();

  /**
   * Test WordPress connection with provided credentials
   */
  const testConnection = useCallback(
    async (baseUrl: string, apiKey: string) => {
      setTestingConnection(true);
      setConnectionError(null);

      try {
        const result = await api.wordpress.testConnection(baseUrl, apiKey);

        setWordPressConnection({
          baseUrl,
          apiKey,
          isValid: true,
          siteName: result.result?.siteName,
          version: result.result?.version,
        });

        return { success: true, data: result };
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to connect to WordPress site';
        setConnectionError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setTestingConnection(false);
      }
    },
    [setTestingConnection, setConnectionError, setWordPressConnection]
  );

  /**
   * Start deployment to WordPress
   */
  const startDeployment = useCallback(async () => {
    if (!rebuildData || !wordpressConnection?.isValid) {
      throw new Error('No rebuild data or invalid WordPress connection');
    }

    setDeploying(true);

    try {
      const result = await api.wordpress.deploy(rebuildData.id, wordpressConnection.baseUrl);

      setDeploymentStatus({
        id: result.id,
        step: 'connecting',
        progress: 10,
        pagesDeployed: 0,
        totalPages: rebuildData.pageCount || 0,
      });

      return { success: true, deploymentId: result.id };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to start deployment';

      setDeploymentStatus({
        id: 'error',
        step: 'error',
        progress: 0,
        pagesDeployed: 0,
        totalPages: rebuildData.pageCount || 0,
        error: errorMessage,
      });

      return { success: false, error: errorMessage };
    } finally {
      setDeploying(false);
    }
  }, [rebuildData, wordpressConnection, setDeploying, setDeploymentStatus]);

  /**
   * Poll deployment status
   */
  const pollDeploymentStatus = useCallback(
    async (deploymentId: string) => {
      try {
        const status = await api.wordpress.getDeploymentStatus(deploymentId);

        setDeploymentStatus({
          id: deploymentId,
          step: status.step ? mapToDeploymentStep(status.step) : mapToDeploymentStep(status.status),
          progress: status.progress || 0,
          pagesDeployed: status.pagesDeployed || status.result?.deployedPages || 0,
          totalPages: status.totalPages || status.result?.deployedPages || 0,
          siteUrl: status.siteUrl || status.result?.siteUrl,
          error: status.error,
        });

        return { success: true, status };
      } catch (error: any) {
        console.error('Failed to poll deployment status:', error);
        return { success: false, error: error.message };
      }
    },
    [setDeploymentStatus]
  );

  /**
   * Disconnect WordPress
   */
  const disconnect = useCallback(() => {
    clearWordPressConnection();
  }, [clearWordPressConnection]);

  /**
   * Reset deployment state
   */
  const resetDeployment = useCallback(() => {
    clearDeployment();
  }, [clearDeployment]);

  return {
    // State
    wordpressConnection,
    isTestingConnection,
    connectionError,
    deploymentStatus,
    isDeploying,

    // Computed
    isConnected,
    isDeploymentComplete,

    // Actions
    testConnection,
    disconnect,
    startDeployment,
    pollDeploymentStatus,
    resetDeployment,
  };
}
