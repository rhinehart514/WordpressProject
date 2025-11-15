'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAnalysisStore } from '@/lib/store/analysis-store';
import { api } from '@/lib/api/client';
import type { DeploymentStep } from '@/lib/store/analysis-store';

const stepInfo: Record<DeploymentStep, { title: string; description: string; icon: string }> = {
  idle: {
    title: 'Ready to deploy',
    description: 'Waiting to begin deployment',
    icon: '⏸️',
  },
  connecting: {
    title: 'Connecting to WordPress',
    description: 'Establishing connection with your WordPress site',
    icon: '🔌',
  },
  uploading: {
    title: 'Uploading content',
    description: 'Creating pages, uploading images, and setting up your site',
    icon: '📤',
  },
  publishing: {
    title: 'Publishing pages',
    description: 'Making your new website live',
    icon: '🚀',
  },
  complete: {
    title: 'Deployment Complete!',
    description: 'Your new website is live',
    icon: '🎉',
  },
  error: {
    title: 'Deployment failed',
    description: 'Something went wrong during deployment',
    icon: '❌',
  },
};

export default function DeployPage() {
  const router = useRouter();
  const {
    rebuildData,
    wordpressConnection,
    deploymentStatus,
    isDeploying,
    setDeploymentStatus,
    setDeploying,
  } = useAnalysisStore();

  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Start deployment on mount
  useEffect(() => {
    if (!rebuildData || !wordpressConnection?.isValid) {
      router.push('/connect');
      return;
    }

    // Start deployment if not already started
    if (!deploymentStatus && !isDeploying) {
      startDeployment();
    }
  }, []);

  // Poll deployment status
  useEffect(() => {
    if (deploymentStatus && deploymentStatus.step !== 'complete' && deploymentStatus.step !== 'error') {
      const interval = setInterval(() => {
        pollDeploymentStatus(deploymentStatus.id);
      }, 2000); // Poll every 2 seconds

      setPollingInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    } else if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [deploymentStatus]);

  // Redirect to success page when complete
  useEffect(() => {
    if (deploymentStatus?.step === 'complete' && deploymentStatus.siteUrl) {
      setTimeout(() => {
        router.push('/success');
      }, 2000);
    }
  }, [deploymentStatus, router]);

  const startDeployment = async () => {
    if (!rebuildData || !wordpressConnection) return;

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
    } catch (error: any) {
      setDeploymentStatus({
        id: 'error',
        step: 'error',
        progress: 0,
        pagesDeployed: 0,
        totalPages: rebuildData.pageCount,
        error: error.message || 'Failed to start deployment',
      });
    } finally {
      setDeploying(false);
    }
  };

  const pollDeploymentStatus = async (deploymentId: string) => {
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
    } catch (error: any) {
      console.error('Failed to poll deployment status:', error);
    }
  };

  const currentStepInfo = deploymentStatus ? stepInfo[deploymentStatus.step] : stepInfo.idle;

  // Handle errors
  if (deploymentStatus?.step === 'error') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Container className="pt-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Deployment Failed</h1>
            <p className="text-lg text-gray-600 mb-8">
              {deploymentStatus.error || 'An unexpected error occurred during deployment'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.push('/connect')}>
                Back to Connection
              </Button>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Container className="pt-20 pb-20">
        {/* Site Info */}
        {wordpressConnection && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Deploying Your Website</h1>
            <p className="text-lg text-gray-600">{wordpressConnection.baseUrl}</p>
          </div>
        )}

        {/* Progress Component */}
        <div className="w-full max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              {/* Icon and Title */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-pulse">{currentStepInfo.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepInfo.title}</h2>
                <p className="text-gray-600">{currentStepInfo.description}</p>
              </div>

              {/* Progress Bar */}
              {deploymentStatus && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-700">
                      {deploymentStatus.progress}%
                    </span>
                  </div>
                  <Progress value={deploymentStatus.progress} className="h-3" />
                </div>
              )}

              {/* Steps Timeline */}
              <div className="space-y-3">
                {Object.entries(stepInfo)
                  .filter(([key]) => !['idle', 'error'].includes(key))
                  .map(([key, step], index) => {
                    const stepKey = key as DeploymentStep;
                    const isActive = deploymentStatus?.step === stepKey;
                    const stepOrder = ['connecting', 'uploading', 'publishing', 'complete'];
                    const currentIndex = stepOrder.indexOf(deploymentStatus?.step || 'idle');
                    const thisIndex = stepOrder.indexOf(stepKey);
                    const isComplete = currentIndex > thisIndex;

                    return (
                      <div key={key} className="flex items-center gap-3">
                        {/* Status indicator */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isComplete
                              ? 'bg-green-500 text-white'
                              : isActive
                              ? 'bg-primary-600 text-white animate-pulse'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isComplete ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>

                        {/* Step info */}
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              isActive ? 'text-gray-900' : 'text-gray-600'
                            }`}
                          >
                            {step.title}
                          </p>
                          {isActive && (
                            <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                          )}
                        </div>

                        {/* Status badge */}
                        {isActive && (
                          <Badge variant="info" className="animate-pulse">
                            In Progress
                          </Badge>
                        )}
                        {isComplete && <Badge variant="success">Done</Badge>}
                      </div>
                    );
                  })}
              </div>

              {/* Stats */}
              {deploymentStatus && deploymentStatus.totalPages > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-700">
                        <strong className="font-semibold">{deploymentStatus.pagesDeployed}</strong> of{' '}
                        <strong className="font-semibold">{deploymentStatus.totalPages}</strong> pages
                        deployed
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info message */}
        {deploymentStatus?.step !== 'complete' && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              This usually takes 3-5 minutes depending on your site size. Please don't close this page.
            </p>
          </div>
        )}

        {/* Redirect message */}
        {deploymentStatus?.step === 'complete' && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-full">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Redirecting to success page...</span>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
