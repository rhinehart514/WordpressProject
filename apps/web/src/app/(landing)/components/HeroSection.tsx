'use client';

import { Container } from '@/components/layout/Container';
import { URLInput } from '@/components/features/URLInput';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 pt-20 pb-16 sm:pt-24 sm:pb-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 sm:translate-x-0">
          <div className="h-96 w-96 rounded-full bg-primary-100 opacity-20 blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 sm:-translate-x-0">
          <div className="h-96 w-96 rounded-full bg-primary-100 opacity-20 blur-3xl" />
        </div>
      </div>

      <Container>
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Powered by AI
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Your Restaurant Website
            <span className="block bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Rebuilt & Updated Automatically
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-gray-600 sm:text-xl mb-10 max-w-2xl mx-auto">
            AI scans your existing site, rebuilds it with a modern template, and keeps it updated automatically.
            No coding required.
          </p>

          {/* URL Input */}
          <div className="flex justify-center mb-8" id="analyze">
            <URLInput />
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Free preview in 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Publish in one click</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
