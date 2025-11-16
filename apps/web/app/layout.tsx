import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Website Rebuilder',
  description: 'Rebuild your restaurant website with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-ai-dark-800 text-ai-dark-50">
        {children}
      </body>
    </html>
  );
}
