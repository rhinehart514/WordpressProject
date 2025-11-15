'use client';

import { Container } from '@/components/layout/Container';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: '01',
    title: 'Enter Your URL',
    description: 'Paste your restaurant website URL and let our AI analyze it',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'AI Scans Your Site',
    description: 'We extract your menu, photos, hours, and content automatically',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'See Instant Preview',
    description: 'View your rebuilt site with modern design and mobile-responsive layout',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Publish to WordPress',
    description: 'Connect your WordPress site and publish with one click',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

export function StepAnimation() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your restaurant website, rebuilt and live in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent -ml-4 z-0" />
              )}

              <Card className="relative z-10 border-2 hover:border-primary-200 transition-all hover:shadow-lg group">
                <CardContent className="p-6">
                  {/* Step number */}
                  <div className="text-5xl font-bold text-primary-100 group-hover:text-primary-200 transition-colors mb-4">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 inline-flex rounded-lg bg-primary-100 p-3 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready to see your rebuilt site?
          </p>
          <a
            href="#analyze"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Try It Now
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </Container>
    </section>
  );
}
