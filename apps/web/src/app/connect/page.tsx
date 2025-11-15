'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalysisStore } from '@/lib/store/analysis-store';
import { api } from '@/lib/api/client';

export default function ConnectPage() {
  const router = useRouter();
  const {
    rebuildData,
    wordpressConnection,
    isTestingConnection,
    connectionError,
    setWordPressConnection,
    setTestingConnection,
    setConnectionError,
  } = useAnalysisStore();

  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // Validate WordPress URL format
  const isValidUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const canTest = baseUrl.trim() !== '' && apiKey.trim() !== '' && isValidUrl(baseUrl);

  const handleTestConnection = async () => {
    if (!canTest) return;

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
    } catch (error: any) {
      setConnectionError(error.message || 'Failed to connect to WordPress site');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleDeploy = () => {
    if (!wordpressConnection?.isValid || !rebuildData) return;

    router.push('/deploy');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Container className="pt-20 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connect Your WordPress Site
            </h1>
            <p className="text-lg text-gray-600">
              Enter your WordPress credentials to deploy your new website
            </p>
          </div>

          {/* Connection Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>WordPress Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* WordPress URL */}
                <div>
                  <Input
                    label="WordPress Site URL"
                    placeholder="https://your-restaurant.com"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    disabled={isTestingConnection || wordpressConnection?.isValid}
                    error={baseUrl && !isValidUrl(baseUrl) ? 'Please enter a valid URL' : undefined}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The full URL to your WordPress site
                  </p>
                </div>

                {/* API Key */}
                <div>
                  <div className="relative">
                    <Input
                      label="Application Password / API Key"
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={isTestingConnection || wordpressConnection?.isValid}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                      disabled={isTestingConnection || wordpressConnection?.isValid}
                    >
                      {showApiKey ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    You can create an Application Password in WordPress under Users → Profile
                  </p>
                </div>

                {/* Error Message */}
                {connectionError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <svg
                      className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">Connection Failed</p>
                      <p className="text-sm text-red-700 mt-1">{connectionError}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {wordpressConnection?.isValid && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">Connected Successfully!</p>
                      <p className="text-sm text-green-700 mt-1">
                        {wordpressConnection.siteName && `Site: ${wordpressConnection.siteName}`}
                        {wordpressConnection.version && ` (WordPress ${wordpressConnection.version})`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Test Connection Button */}
                {!wordpressConnection?.isValid && (
                  <Button
                    variant="primary"
                    className="w-full"
                    size="lg"
                    onClick={handleTestConnection}
                    disabled={!canTest || isTestingConnection}
                  >
                    {isTestingConnection ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                        Testing Connection...
                      </>
                    ) : (
                      'Test Connection'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* How to get credentials */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">How to get your Application Password</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Badge className="flex-shrink-0">1</Badge>
                  <span>Log in to your WordPress admin dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="flex-shrink-0">2</Badge>
                  <span>Go to <strong>Users → Profile</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="flex-shrink-0">3</Badge>
                  <span>Scroll down to <strong>Application Passwords</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="flex-shrink-0">4</Badge>
                  <span>Enter a name (e.g., "AI Website Rebuilder") and click <strong>Add New Application Password</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge className="flex-shrink-0">5</Badge>
                  <span>Copy the generated password and paste it above</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/preview/${rebuildData?.id}`)}
              className="flex-1"
            >
              Back to Preview
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleDeploy}
              disabled={!wordpressConnection?.isValid}
              className="flex-1"
            >
              Deploy to WordPress
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
