'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Deck {
  id: string;
  title: string;
  status: string;
  audience: string;
  goal: string;
  targetSlides: number;
  createdAt: string;
  updatedAt: string;
}

interface Slide {
  id: string;
  title: string;
  type: string;
  order: number;
}

type GenerationState = 'loading' | 'generating' | 'completed' | 'timeout' | 'error';

export default function EditDeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [generationState, setGenerationState] = useState<GenerationState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const maxPollingTime = 90000; // 90 seconds timeout
  const pollingInterval = 3000; // Poll every 3 seconds

  // Fetch deck data
  const fetchDeck = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/decks/${deckId}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to load deck');
      }

      const deckData = data.data;
      setDeck(deckData);
      setSlides(deckData.slides || []);

      // Determine generation state
      const slideCount = deckData.slides?.length || 0;
      const status = deckData.status;

      if (slideCount > 0) {
        // Slides exist - generation complete
        setGenerationState('completed');
      } else if (status === 'FAILED' || status === 'ERROR') {
        // Generation failed
        setGenerationState('error');
        setError('Deck generation failed. Please try creating a new deck.');
      } else if (status === 'PLANNING' || status === 'LAYOUT' || status === 'CONTENT') {
        // Still generating
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed > maxPollingTime) {
          // Timeout - stop polling
          setGenerationState('timeout');
          setError('Generation is taking longer than expected. Please refresh or contact support.');
        } else {
          // Keep generating
          setGenerationState('generating');
          setPollingAttempts(prev => prev + 1);
        }
      } else {
        // Unknown state
        setGenerationState('completed');
      }

      return true;
    } catch (err) {
      console.error('Failed to fetch deck:', err);
      setError(err instanceof Error ? err.message : 'Failed to load deck');
      setGenerationState('error');
      return false;
    }
  }, [deckId]);

  // Store fetchDeck in ref so interval always calls latest version
  const fetchDeckRef = useRef(fetchDeck);
  useEffect(() => {
    fetchDeckRef.current = fetchDeck;
  }, [fetchDeck]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Start polling
  const startPolling = useCallback(() => {
    stopPolling(); // Clear any existing
    pollingIntervalRef.current = setInterval(() => {
      fetchDeckRef.current(); // Use ref to get latest fetchDeck
    }, pollingInterval);
  }, [stopPolling]);

  // Initial load
  useEffect(() => {
    if (!deckId) return;

    startTimeRef.current = Date.now();
    fetchDeck();

    return () => stopPolling();
  }, [deckId, fetchDeck, stopPolling]);

  // Start/stop polling based on generation state
  useEffect(() => {
    if (generationState === 'generating') {
      // Only start if not already polling
      if (!pollingIntervalRef.current) {
        startPolling();
      }
    } else {
      // Stop for any other state
      stopPolling();
    }

    return () => stopPolling();
  }, [generationState, startPolling, stopPolling]);

  // Manual refresh
  const handleRefresh = useCallback(() => {
    startTimeRef.current = Date.now(); // Reset timeout
    setPollingAttempts(0);
    setError(null);
    setGenerationState('loading');
    fetchDeck();
  }, [fetchDeck]);

  // Delete deck
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/decks/${deckId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        router.push('/decks');
      } else {
        throw new Error(data.error || 'Failed to delete deck');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete deck');
      setIsDeleting(false);
    }
  };

  // Export PPTX
  const handleExport = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/export/${deckId}/pptx`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        alert(`Export started! Job ID: ${data.data.jobId}`);
      } else {
        alert('Export failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Loading state
  if (generationState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading deck...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (generationState === 'error' && !deck) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Failed to load deck</h3>
              <p className="mt-2 text-sm text-gray-600">{error || 'The deck could not be loaded.'}</p>
              <div className="mt-6 flex gap-3 justify-center">
                <Link href="/decks">
                  <Button variant="secondary">Back to Decks</Button>
                </Link>
                <Button onClick={handleRefresh}>Try Again</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!deck) return null;

  // Calculate elapsed time for progress indicator
  const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
  const estimatedSeconds = deck.targetSlides * 5; // Rough estimate: 5s per slide

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/decks" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to presentations
          </Link>

          <div className="mt-4 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{deck.title}</h1>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  generationState === 'completed' ? 'bg-green-100 text-green-800' :
                  generationState === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                  generationState === 'timeout' || generationState === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {generationState === 'generating' ? 'Generating' : deck.status.toLowerCase()}
                </span>
                <span>{slides.length} / {deck.targetSlides} slides</span>
                <span>Updated {new Date(deck.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                variant="secondary"
                onClick={handleExport}
                disabled={slides.length === 0}
              >
                Export PPTX
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Slide List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Slides</CardTitle>
                <CardDescription>
                  {generationState === 'generating'
                    ? `Generating... (${pollingAttempts} checks)`
                    : 'Click a slide to edit'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {slides.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-600">
                      {generationState === 'generating' ? (
                        <>
                          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent mb-2"></div>
                          <p>Generating slides...</p>
                          <p className="mt-1 text-xs">Elapsed: {elapsedSeconds}s / ~{estimatedSeconds}s</p>
                        </>
                      ) : generationState === 'timeout' ? (
                        <>
                          <p className="text-red-600">Generation timeout</p>
                          <p className="mt-1 text-xs">Taking longer than expected</p>
                        </>
                      ) : (
                        <>
                          <p>No slides yet</p>
                          <p className="mt-1 text-xs">Check status above</p>
                        </>
                      )}
                    </div>
                  ) : (
                    slides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-sm font-medium text-gray-600">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">{slide.title}</p>
                          <p className="text-xs text-gray-500 capitalize">{slide.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-9">
            <Card>
              <CardContent className="p-8">
                {slides.length === 0 ? (
                  <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center max-w-md">
                      {generationState === 'generating' ? (
                        <>
                          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">Generating your deck...</h3>
                          <p className="mt-2 text-sm text-gray-600">
                            AI is creating {deck.targetSlides} slides based on your input.
                          </p>
                          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min((elapsedSeconds / estimatedSeconds) * 100, 95)}%`
                              }}
                            ></div>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            Elapsed: {elapsedSeconds}s | Checking every {pollingInterval/1000}s (attempt #{pollingAttempts})
                          </p>
                          <div className="mt-6 flex gap-3 justify-center">
                            <Button variant="secondary" onClick={handleRefresh}>
                              Refresh Now
                            </Button>
                            <Button variant="ghost" onClick={handleDelete}>
                              Cancel & Delete
                            </Button>
                          </div>
                        </>
                      ) : generationState === 'timeout' ? (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-yellow-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">Generation Taking Longer Than Expected</h3>
                          <p className="mt-2 text-sm text-gray-600">
                            This is unusual. The generation has been running for over {Math.floor(maxPollingTime/1000)} seconds.
                          </p>
                          <div className="mt-6 flex gap-3 justify-center">
                            <Button onClick={handleRefresh}>
                              Check Again
                            </Button>
                            <Button variant="secondary" onClick={() => router.push('/decks')}>
                              Back to Decks
                            </Button>
                            <Button variant="ghost" onClick={handleDelete}>
                              Delete This Deck
                            </Button>
                          </div>
                        </>
                      ) : generationState === 'error' ? (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          <h3 className="mt-4 text-lg font-medium text-gray-900">Generation Failed</h3>
                          <p className="mt-2 text-sm text-gray-600">
                            {error || 'The deck generation encountered an error.'}
                          </p>
                          <div className="mt-6 flex gap-3 justify-center">
                            <Button onClick={() => router.push('/decks/new')}>
                              Create New Deck
                            </Button>
                            <Button variant="secondary" onClick={() => router.push('/decks')}>
                              Back to Decks
                            </Button>
                            <Button variant="ghost" onClick={handleDelete}>
                              Delete This Deck
                            </Button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
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
                        <p className="mt-2 text-sm text-gray-600">
                          Slide preview coming soon
                        </p>
                        <p className="text-xs text-gray-500">
                          Full editor with AI controls is under development
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Deck created successfully!</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>Your deck has been created with {slides.length} slides.</p>
                            <p className="mt-1">Click "Export PPTX" above to download your presentation.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
