import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Slide Agent - Professional Presentations Powered by AI',
  description: 'Create consulting-grade slide decks with AI assistance. Professional presentations in minutes, not hours.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
