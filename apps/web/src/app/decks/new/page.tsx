'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CreateDeckPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startMode: 'blank',
    audience: 'executive',
    goal: 'persuade',
    targetSlides: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/decks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/decks/${data.data.id}/edit`);
      } else {
        alert('Failed to create deck');
        setLoading(false);
      }
    } catch (error) {
      alert('Failed to create deck');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/decks" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to presentations
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Create New Deck</h1>
          <p className="mt-2 text-sm text-gray-600">
            Set up your presentation and let AI help you build it
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Deck Details</CardTitle>
              <CardDescription>Basic information about your presentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Q4 Product Strategy Review"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief overview of what this deck covers..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="audience">Audience</Label>
                  <Select
                    id="audience"
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  >
                    <option value="executive">Executive</option>
                    <option value="technical">Technical</option>
                    <option value="general">General</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Goal</Label>
                  <Select
                    id="goal"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  >
                    <option value="persuade">Persuade</option>
                    <option value="inform">Inform</option>
                    <option value="educate">Educate</option>
                    <option value="report">Report</option>
                  </Select>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startMode">Start Mode</Label>
                  <Select
                    id="startMode"
                    value={formData.startMode}
                    onChange={(e) => setFormData({ ...formData, startMode: e.target.value })}
                  >
                    <option value="blank">Start Blank</option>
                    <option value="outline">Paste Outline</option>
                    <option value="document">Upload Document</option>
                    <option value="table">Import Table</option>
                    <option value="meeting_notes">Meeting Notes</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetSlides">Target Slides</Label>
                  <Input
                    id="targetSlides"
                    type="number"
                    min="3"
                    max="50"
                    value={formData.targetSlides}
                    onChange={(e) =>
                      setFormData({ ...formData, targetSlides: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex items-center justify-end gap-4">
            <Link href="/decks">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit" size="lg" disabled={loading || !formData.title}>
              {loading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Deck'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
