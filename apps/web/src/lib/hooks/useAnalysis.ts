import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisStore } from '../store/analysis-store';
import { api } from '../api/client';

export function useAnalysis() {
  const router = useRouter();
  const store = useAnalysisStore();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start analysis
  const startAnalysis = useCallback(async (url: string) => {
    try {
      store.setStep('scraping');
      store.setProgress(10);
      store.setError('');

      // Call scraper API
      const result = await api.scraper.analyze(url);

      const analysisId = result.id || result.analysisId || '';
      store.setAnalysisId(analysisId);
      store.setProgress(30);

      // Start polling for completion
      if (analysisId) {
        pollAnalysisStatus(analysisId);
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start analysis';
      store.setError(message);
      throw error;
    }
  }, [store]);

  // Poll analysis status
  const pollAnalysisStatus = useCallback((analysisId: string) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const status = await api.scraper.getStatus(analysisId);

        // Update progress based on status
        if (status.status === 'scraping') {
          store.setStep('scraping');
          store.setProgress(40);
        } else if (status.status === 'analyzing') {
          store.setStep('analyzing');
          store.setProgress(60);
        } else if (status.status === 'completed') {
          store.setStep('generating');
          store.setProgress(80);
          store.setSiteData(status);

          // Clear polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }

          // Generate rebuild preview
          await generatePreview(analysisId);
        } else if (status.status === 'failed') {
          store.setError(status.error || 'Analysis failed');
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
        // Don't stop polling on network errors, but stop after too many failures
      }
    }, 2000); // Poll every 2 seconds
  }, [store]);

  // Generate preview
  const generatePreview = useCallback(async (analysisId: string) => {
    try {
      store.setStep('generating');
      store.setProgress(90);

      const preview = await api.rebuild.generate(analysisId);

      store.setRebuildData(preview);
      store.setStep('complete');
      store.setProgress(100);

      return preview;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate preview';
      store.setError(message);
      throw error;
    }
  }, [store]);

  // Refine content with AI
  const refineContent = useCallback(async (instruction: string) => {
    const rebuildId = store.rebuildData?.id;
    if (!rebuildId) {
      throw new Error('No rebuild data available');
    }

    try {
      store.setStep('generating');

      const result = await api.rebuild.refineContent(rebuildId, instruction);

      store.setRebuildData(result);
      store.setStep('complete');

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to refine content';
      store.setError(message);
      throw error;
    }
  }, [store]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return {
    // State
    currentStep: store.currentStep,
    analysisId: store.analysisId,
    siteData: store.siteData,
    rebuildData: store.rebuildData,
    error: store.error,
    progress: store.progress,

    // Computed
    isAnalyzing: store.isAnalyzing(),
    hasError: store.hasError(),
    hasPreview: store.hasPreview(),

    // Actions
    startAnalysis,
    refineContent,
    reset: store.reset,
  };
}
