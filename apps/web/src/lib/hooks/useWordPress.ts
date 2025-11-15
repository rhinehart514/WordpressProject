import { useCallback } from 'react';
import { useAnalysisStore } from '../store/analysis-store';
import { api } from '../api/client';

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
          siteName: result.siteName,
          version: result.version,
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
        id: result.deploymentId,
        step: 'connecting',
        progress: 10,
        pagesDeployed: 0,
        totalPages: rebuildData.pageCount,
      });

      return { success: true, deploymentId: result.deploymentId };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to start deployment';

      setDeploymentStatus({
        id: 'error',
        step: 'error',
        progress: 0,
        pagesDeployed: 0,
        totalPages: rebuildData.pageCount,
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
          step: status.step,
          progress: status.progress,
          pagesDeployed: status.pagesDeployed,
          totalPages: status.totalPages,
          siteUrl: status.siteUrl,
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
