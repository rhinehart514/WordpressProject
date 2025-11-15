'use client';

import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import type { AnalysisStep } from '@/lib/store/analysis-store';

interface AnalysisProgressProps {
  currentStep: AnalysisStep;
  progress: number;
  pageCount?: number;
}

const stepInfo = {
  idle: {
    title: 'Ready to start',
    description: 'Waiting to begin analysis',
    icon: '⏸️',
  },
  scraping: {
    title: 'Scraping your website',
    description: 'Discovering and downloading pages from your site',
    icon: '🔍',
  },
  analyzing: {
    title: 'Analyzing content with AI',
    description: 'Extracting menu items, images, hours, and other content',
    icon: '🤖',
  },
  generating: {
    title: 'Generating preview',
    description: 'Creating your rebuilt website with modern templates',
    icon: '✨',
  },
  complete: {
    title: 'Complete!',
    description: 'Your preview is ready',
    icon: '🎉',
  },
  error: {
    title: 'Something went wrong',
    description: 'Please try again or contact support',
    icon: '❌',
  },
};

export function AnalysisProgress({ currentStep, progress, pageCount }: AnalysisProgressProps) {
  const info = stepInfo[currentStep];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          {/* Icon and Title */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-pulse">{info.icon}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{info.title}</h2>
            <p className="text-gray-600">{info.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Steps Timeline */}
          <div className="space-y-3">
            {Object.entries(stepInfo)
              .filter(([key]) => !['idle', 'error'].includes(key))
              .map(([key, step], index) => {
                const isActive = currentStep === key;
                const isComplete =
                  ['scraping', 'analyzing', 'generating', 'complete'].indexOf(currentStep) >
                  ['scraping', 'analyzing', 'generating', 'complete'].indexOf(key as AnalysisStep);

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
          {pageCount !== undefined && pageCount > 0 && (
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
                    <strong className="font-semibold">{pageCount}</strong> pages found
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
