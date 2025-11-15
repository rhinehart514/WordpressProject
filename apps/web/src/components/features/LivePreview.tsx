'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface LivePreviewProps {
  previewUrl: string;
  className?: string;
}

export function LivePreview({ previewUrl, className }: LivePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isLoading, setIsLoading] = useState(true);

  const devices = {
    desktop: { width: '100%', height: '100%', icon: '🖥️', label: 'Desktop' },
    tablet: { width: '768px', height: '1024px', icon: '📱', label: 'Tablet' },
    mobile: { width: '375px', height: '667px', icon: '📱', label: 'Mobile' },
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Device Toggle */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Preview:</span>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {Object.entries(devices).map(([key, { icon, label }]) => (
              <button
                key={key}
                onClick={() => setDevice(key as DeviceType)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  device === key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                title={label}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLoading(true)}
            title="Refresh preview"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" title="Open in new tab">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      {/* Preview Frame */}
      <div className="flex-1 bg-gray-100 p-4 sm:p-8 overflow-auto">
        <div
          className={cn(
            'mx-auto bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300',
            device === 'desktop' && 'w-full h-full',
            device === 'tablet' && 'w-[768px] h-[1024px]',
            device === 'mobile' && 'w-[375px] h-[667px]'
          )}
          style={{
            maxWidth: devices[device].width,
            maxHeight: devices[device].height,
          }}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mb-4" />
                <p className="text-sm text-gray-600">Loading preview...</p>
              </div>
            </div>
          )}

          {/* Iframe */}
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            sandbox="allow-scripts allow-same-origin"
            title="Website Preview"
          />
        </div>
      </div>
    </div>
  );
}
