'use client';

import Link from 'next/link';
import { Container } from './Container';
import { Button } from '../ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700" />
            <span className="text-xl font-bold">AI Rebuilder</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/#features" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="primary" asChild>
              <Link href="/#analyze">Get Started</Link>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
