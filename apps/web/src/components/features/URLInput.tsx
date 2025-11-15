'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function URLInput() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate URL
    if (!url) {
      setError('Please enter a website URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid website URL (e.g., https://yourrestaurant.com)');
      return;
    }

    setIsLoading(true);

    try {
      // Start analysis
      const response = await fetch('/api/analysis/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to start analysis');
      }

      const { analysisId } = await response.json();

      // Redirect to analysis page
      router.push(`/analyze?id=${analysisId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="url"
            placeholder="https://yourrestaurant.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={error}
            disabled={isLoading}
            className="h-14 text-base"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="sm:w-auto w-full"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5"
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
              Analyzing...
            </>
          ) : (
            'Analyze My Site'
          )}
        </Button>
      </div>

      <p className="mt-3 text-sm text-gray-500 text-center sm:text-left">
        Enter your restaurant website URL to see an instant rebuild preview
      </p>
    </form>
  );
}
