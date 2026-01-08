import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AI-Powered Slide Decks
            <span className="block text-blue-600">Built for Professionals</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Create consulting-grade presentations with AI assistance. From outline to export,
            get professional slides in minutes, not hours.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/decks">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="secondary">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-24">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <CardTitle>AI-Powered Generation</CardTitle>
                <CardDescription>
                  Intelligent content creation with quality gates and consulting-grade output
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <CardTitle>Full Control</CardTitle>
                <CardDescription>
                  Human-in-the-loop editing with per-element AI controls and locked regions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                </div>
                <CardTitle>Export Ready</CardTitle>
                <CardDescription>
                  Clean PowerPoint files with editable elements and professional formatting
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="mt-24 rounded-2xl bg-blue-600 px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to create your first deck?</h2>
          <p className="mt-4 text-lg text-blue-100">
            Join professionals who trust AI Slide Agent for their presentations
          </p>
          <div className="mt-8">
            <Link href="/decks/new">
              <Button size="lg" variant="secondary">
                Create Your First Deck
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
