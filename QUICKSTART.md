# Quick Start Guide

Get AI Slide Agent running in 5 minutes!

## Prerequisites

Make sure you have installed:
- **Node.js 18+** ([download](https://nodejs.org/))
- **Docker Desktop** ([download](https://www.docker.com/products/docker-desktop/))

## Automated Setup (Recommended)

### Step 1: Run Setup Script

```bash
cd ai-slide-agent
chmod +x setup.sh start.sh
./setup.sh
```

This will:
- ✅ Install dependencies
- ✅ Build packages
- ✅ Start Docker services (Postgres, Redis, MinIO)
- ✅ Setup database and seed demo data
- ✅ Create environment files

### Step 2: Add OpenAI API Key (Optional)

If you want AI features:

```bash
# Edit these files and add your OpenAI API key:
nano apps/api/.env
nano apps/worker/.env

# Set this line:
OPENAI_API_KEY="sk-your-key-here"
ENABLE_AI_FEATURES=true
```

**Don't have an API key?** No problem! The system works in mock mode.

### Step 3: Start the Application

```bash
./start.sh
```

Or manually in 3 separate terminals:

**Terminal 1:**
```bash
cd apps/api
pnpm dev
```

**Terminal 2:**
```bash
cd apps/worker
pnpm dev
```

**Terminal 3:**
```bash
cd apps/web
pnpm dev
```

### Step 4: Access the Application

Open your browser:
- **Web UI**: http://localhost:3000
- **API**: http://localhost:4000/health
- **MinIO Console**: http://localhost:9001 (login: admin/miniopassword)

## Manual Setup

If automated setup doesn't work, follow these steps:

### 1. Install Dependencies

```bash
cd ai-slide-agent
npm install -g pnpm
pnpm install
```

### 2. Build Packages

```bash
cd packages/shared && pnpm build && cd ../..
cd packages/layout-engine && pnpm build && cd ../..
cd packages/quality-gates && pnpm build && cd ../..
cd packages/pptx-renderer && pnpm build && cd ../..
```

### 3. Start Docker Services

```bash
docker compose up -d

# Wait for services to be healthy
docker compose ps
```

### 4. Setup Environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/worker/.env.example apps/worker/.env
cp apps/web/.env.example apps/web/.env
```

### 5. Setup Database

```bash
cd apps/api
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed
cd ../..
```

### 6. Start Services

**Terminal 1 - API:**
```bash
cd apps/api
pnpm dev
```

**Terminal 2 - Worker:**
```bash
cd apps/worker
pnpm dev
```

**Terminal 3 - Web:**
```bash
cd apps/web
pnpm dev
```

## Verify It's Working

### Test API
```bash
curl http://localhost:4000/health
```

Expected: `{"status":"ok",...}`

### Test Web UI
Open http://localhost:3000 - you should see the homepage

### Create Your First Deck
1. Go to http://localhost:3000/decks
2. Click "Create New Deck"
3. Fill in the form
4. Click "Create Deck"

## Troubleshooting

If something doesn't work, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Common Issues

**"Port already in use":**
```bash
# Kill processes on ports
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :4000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**"Cannot find module":**
```bash
# Rebuild packages
pnpm clean
pnpm install
cd packages/shared && pnpm build && cd ../..
# ... repeat for other packages
```

**"Database connection failed":**
```bash
# Restart Docker services
docker compose down
docker compose up -d
sleep 10
```

**"Prisma errors":**
```bash
cd apps/api
pnpm prisma generate
pnpm prisma migrate deploy
cd ../..
```

## Next Steps

Once everything is running:

1. 📖 Read the [USER_GUIDE.md](./USER_GUIDE.md) to learn how to use the application
2. 🏗️ Check [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system design
3. 🎨 Create your first deck!

## Development Tips

### Restart a Single Service

If you need to restart just one service:

```bash
# In the terminal running that service, press Ctrl+C
# Then run pnpm dev again
```

### View Logs

```bash
# Docker logs
docker compose logs -f postgres
docker compose logs -f redis

# Application logs appear in the terminal where you ran pnpm dev
```

### Reset Database

```bash
cd apps/api
pnpm prisma migrate reset
pnpm prisma db seed
cd ../..
```

### Clean Everything

```bash
# Stop all services
docker compose down -v

# Clean build artifacts
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -rf apps/*/.next packages/*/dist

# Start fresh
pnpm install
./setup.sh
```

## Quick Commands Reference

```bash
# Setup (first time only)
./setup.sh

# Start application
./start.sh

# Start Docker services
docker compose up -d

# Stop Docker services
docker compose down

# View Docker logs
docker compose logs -f

# Reset database
cd apps/api && pnpm prisma migrate reset && cd ../..

# Rebuild packages
cd packages/shared && pnpm build && cd ../..

# Run API only
cd apps/api && pnpm dev

# Run Worker only
cd apps/worker && pnpm dev

# Run Web only
cd apps/web && pnpm dev
```

## Getting Help

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed debugging steps
- Look at [README.md](./README.md) for full documentation
- Open an issue on GitHub if you're still stuck

Happy slide creating! 🎉
