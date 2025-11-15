'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { LivePreview } from '@/components/features/LivePreview';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalysis } from '@/lib/hooks/useAnalysis';

interface PreviewPageProps {
  params: {
    id: string;
  };
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const router = useRouter();
  const { rebuildData, siteData } = useAnalysis();
  const [showRefinement, setShowRefinement] = useState(false);

  // Mock preview URL (in production, this would come from rebuildData)
  const previewUrl = rebuildData?.previewUrl || `https://example.com/preview/${params.id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Preview</h1>
              <p className="text-sm text-gray-600">
                {siteData?.restaurantInfo?.name || 'Restaurant Website'}
              </p>
            </div>

            {/* Summary Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Content Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pages found:</span>
                    <Badge>{siteData?.pageCount || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="success">Ready</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detected Content */}
            {siteData?.pages && siteData.pages.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-base">Detected Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {siteData.pages.map((page, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-sm font-medium capitalize">{page.pageType}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round(page.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Refinement */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Need Changes?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Use AI to refine your content with natural language instructions.
                </p>
                {!showRefinement ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowRefinement(true)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Refine with AI
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      placeholder="e.g., 'Make it sound more upscale' or 'Add more Italian flair'"
                    />
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" className="flex-1">
                        Apply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRefinement(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={() => router.push('/connect')}
              >
                Looks Good! Connect WordPress
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>

              <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
                Start Over
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1">
          <LivePreview previewUrl={previewUrl} />
        </div>
      </div>
    </div>
  );
}
