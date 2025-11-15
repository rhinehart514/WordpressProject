'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { AnalysisProgress } from '@/components/features/AnalysisProgress';
import { Button } from '@/components/ui/button';
import { useAnalysis } from '@/lib/hooks/useAnalysis';

function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('id');

  const {
    currentStep,
    progress,
    siteData,
    rebuildData,
    error,
    hasPreview,
  } = useAnalysis();

  // Redirect to preview when complete
  useEffect(() => {
    if (currentStep === 'complete' && hasPreview && rebuildData) {
      setTimeout(() => {
        router.push(`/preview/${rebuildData.id}`);
      }, 1500);
    }
  }, [currentStep, hasPreview, rebuildData, router]);

  // Handle errors
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Container className="pt-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-lg text-gray-600 mb-8">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
              >
                Back to Home
              </Button>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
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
        {/* URL Display */}
        {siteData && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analyzing Your Website
            </h1>
            <p className="text-lg text-gray-600">
              {siteData.url}
            </p>
          </div>
        )}

        {/* Progress Component */}
        <AnalysisProgress
          currentStep={currentStep}
          progress={progress}
          pageCount={siteData?.pageCount}
        />

        {/* Additional Info */}
        {currentStep !== 'complete' && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              This usually takes 2-3 minutes. Feel free to grab a coffee! ☕
            </p>
          </div>
        )}

        {/* Redirect message */}
        {currentStep === 'complete' && hasPreview && (
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
              <span>Redirecting to preview...</span>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}
