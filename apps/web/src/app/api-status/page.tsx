'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'error' | 'unknown';
  message?: string;
  responseTime?: number;
}

export default function ApiStatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'API Server', status: 'unknown' },
    { name: 'Decks Endpoint', status: 'unknown' },
    { name: 'Templates Endpoint', status: 'unknown' },
  ]);
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'Not configured');
    checkServices();
  }, []);

  const checkServices = async () => {
    const newServices: ServiceStatus[] = [];

    // Check API Health
    try {
      const start = Date.now();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      const responseTime = Date.now() - start;

      if (response.ok) {
        const data = await response.json();
        newServices.push({
          name: 'API Server',
          status: 'healthy',
          message: `Status: ${data.status}`,
          responseTime,
        });
      } else {
        newServices.push({
          name: 'API Server',
          status: 'error',
          message: `HTTP ${response.status}`,
        });
      }
    } catch (error) {
      newServices.push({
        name: 'API Server',
        status: 'error',
        message: error instanceof Error ? error.message : 'Connection failed',
      });
    }

    // Check Decks Endpoint
    try {
      const start = Date.now();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/decks`);
      const responseTime = Date.now() - start;

      if (response.ok) {
        const data = await response.json();
        newServices.push({
          name: 'Decks Endpoint',
          status: 'healthy',
          message: `Found ${data.data?.length || 0} decks`,
          responseTime,
        });
      } else {
        newServices.push({
          name: 'Decks Endpoint',
          status: 'error',
          message: `HTTP ${response.status}`,
        });
      }
    } catch (error) {
      newServices.push({
        name: 'Decks Endpoint',
        status: 'error',
        message: error instanceof Error ? error.message : 'Connection failed',
      });
    }

    // Check Templates Endpoint
    try {
      const start = Date.now();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/templates`);
      const responseTime = Date.now() - start;

      if (response.ok) {
        const data = await response.json();
        newServices.push({
          name: 'Templates Endpoint',
          status: 'healthy',
          message: `Found ${data.data?.length || 0} templates`,
          responseTime,
        });
      } else {
        newServices.push({
          name: 'Templates Endpoint',
          status: 'error',
          message: `HTTP ${response.status}`,
        });
      }
    } catch (error) {
      newServices.push({
        name: 'Templates Endpoint',
        status: 'error',
        message: error instanceof Error ? error.message : 'Connection failed',
      });
    }

    setServices(newServices);
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  const allHealthy = services.every(s => s.status === 'healthy');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">API Status</h1>
          <p className="mt-2 text-sm text-gray-600">Check the health of backend services</p>
        </div>

        <div className="space-y-6">
          {/* Overall Status */}
          <Card className={allHealthy ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    {allHealthy ? 'All Systems Operational' : 'Some Issues Detected'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    API URL: <code className="bg-white px-2 py-1 rounded">{apiUrl}</code>
                  </p>
                </div>
                <Button onClick={checkServices} variant="secondary" size="sm">
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Service Status Cards */}
          {services.map((service) => (
            <Card key={service.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                    {service.status === 'healthy' ? 'Healthy' : service.status === 'error' ? 'Error' : 'Checking...'}
                  </span>
                </div>
                {service.message && (
                  <CardDescription className="mt-2">
                    {service.message}
                    {service.responseTime && ` (${service.responseTime}ms)`}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          ))}

          {/* Troubleshooting */}
          {!allHealthy && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-base">Troubleshooting</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Make sure the API server is running: <code className="bg-white px-1 rounded">cd apps/api && pnpm dev</code></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Check Docker services: <code className="bg-white px-1 rounded">docker compose ps</code></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>Verify environment: <code className="bg-white px-1 rounded">cat apps/web/.env</code></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>Test API directly: <code className="bg-white px-1 rounded">curl http://localhost:4000/health</code></span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/health`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-700"
              >
                → Open API Health Endpoint
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/api/decks`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-700"
              >
                → View Decks API Response
              </a>
              <a
                href="http://localhost:9001"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-700"
              >
                → MinIO Console (admin/miniopassword)
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
