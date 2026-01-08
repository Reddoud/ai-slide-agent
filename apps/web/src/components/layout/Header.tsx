import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-xl font-bold">AI Slide Agent</span>
            </Link>
            <nav className="hidden md:flex md:gap-6">
              <Link
                href="/decks"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                Presentations
              </Link>
              <Link
                href="/templates"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                Templates
              </Link>
              <Link
                href="/api-status"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
              >
                Status
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/decks/new">
              <Button>Create Deck</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
