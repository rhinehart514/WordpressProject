'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalysisStore } from '@/lib/store/analysis-store';

export default function SuccessPage() {
  const router = useRouter();
  const { deploymentStatus, siteData, wordpressConnection, reset } = useAnalysisStore();

  useEffect(() => {
    // Redirect if no deployment completed
    if (!deploymentStatus || deploymentStatus.step !== 'complete') {
      router.push('/');
    }
  }, [deploymentStatus, router]);

  const handleStartOver = () => {
    reset();
    router.push('/');
  };

  if (!deploymentStatus || !deploymentStatus.siteUrl) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Container className="pt-20 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 Your Website is Live!
            </h1>
            <p className="text-xl text-gray-600">
              Your new restaurant website has been successfully deployed to WordPress
            </p>
          </div>

          {/* Site Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your New Website</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Site URL */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Live Site URL</p>
                    <a
                      href={deploymentStatus.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {deploymentStatus.siteUrl}
                    </a>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    asChild
                  >
                    <a href={deploymentStatus.siteUrl} target="_blank" rel="noopener noreferrer">
                      View Site
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {deploymentStatus.pagesDeployed}
                    </div>
                    <div className="text-sm text-gray-600">Pages Deployed</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {siteData?.pageCount || deploymentStatus.totalPages}
                    </div>
                    <div className="text-sm text-gray-600">Total Pages</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>

                {/* Site Details */}
                {(siteData?.restaurantInfo?.name || wordpressConnection?.siteName) && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Site Name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {siteData?.restaurantInfo?.name || wordpressConnection?.siteName}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">Review Your Website</h3>
                    <p className="text-sm text-gray-600">
                      Visit your live site and make sure everything looks good. You can make changes
                      anytime through your WordPress admin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">Customize Your Site</h3>
                    <p className="text-sm text-gray-600">
                      Log in to your WordPress dashboard to customize colors, fonts, add more content,
                      or install additional plugins.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      asChild
                    >
                      <a
                        href={`${wordpressConnection?.baseUrl}/wp-admin`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Go to WordPress Admin
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">Share Your New Site</h3>
                    <p className="text-sm text-gray-600">
                      Update your social media, Google My Business, and other listings with your new
                      website URL.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="mb-6 bg-primary-50 border-primary-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Need Help?</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Our support team is here to help you get the most out of your new website.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Contact Support
                    </Button>
                    <Button variant="outline" size="sm">
                      View Documentation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              asChild
            >
              <a href={deploymentStatus.siteUrl} target="_blank" rel="noopener noreferrer">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Your Live Site
              </a>
            </Button>
            <Button variant="outline" size="lg" onClick={handleStartOver} className="flex-1">
              Rebuild Another Site
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
