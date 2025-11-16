import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Website Rebuilder - Restaurant Edition',
  description: 'Automated restaurant website rebuilding and maintenance platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
