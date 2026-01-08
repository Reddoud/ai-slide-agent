#!/bin/bash

echo "🚀 Starting AI Slide Agent..."
echo "==============================="

# Check if setup has been run
if [ ! -f apps/api/.env ]; then
    echo "❌ Setup not complete. Please run ./setup.sh first"
    exit 1
fi

# Check if Docker services are running
if ! docker compose ps | grep -q "Up"; then
    echo "📦 Starting Docker services..."
    docker compose up -d
    sleep 5
fi

# Use trap to handle Ctrl+C
trap "echo 'Stopping services...'; exit" INT TERM

echo "Starting all services..."
echo "Press Ctrl+C to stop all services"
echo ""

# Start all services in the background using pnpm
pnpm dev
