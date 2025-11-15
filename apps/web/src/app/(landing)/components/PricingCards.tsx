'use client';

import { Container } from '@/components/layout/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'Self-Serve',
    price: '$49',
    period: '/month',
    description: 'Perfect for single restaurant owners',
    features: [
      'Instant website rebuild',
      'Monthly menu updates',
      'Hours sync with Google',
      'Photo gallery updates',
      'Mobile-responsive design',
      'Basic analytics',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'OWSH Unlimited',
    price: '$199',
    period: '/month',
    description: 'Full-service website care by our team',
    features: [
      'Everything in Self-Serve',
      'Dedicated account manager',
      'Unlimited content updates',
      'Custom design requests',
      'Priority support',
      'SEO optimization',
      'Performance monitoring',
      'Monthly reports',
    ],
    cta: 'Get Started',
    popular: true,
  },
];

export function PricingCards() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-2 border-primary-500 shadow-xl'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="info" className="px-4 py-1 text-sm font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </Container>
    </section>
  );
}
