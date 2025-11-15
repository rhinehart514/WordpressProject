import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700" />
                <span className="text-lg font-bold">AI Rebuilder</span>
              </div>
              <p className="text-sm text-gray-600">
                Automated restaurant website rebuilding and maintenance platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/#features" className="text-gray-600 hover:text-gray-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="text-gray-600 hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/examples" className="text-gray-600 hover:text-gray-900">
                    Examples
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-600 hover:text-gray-900">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} AI Website Rebuilder. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
