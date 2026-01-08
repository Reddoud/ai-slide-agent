# Troubleshooting Guide

## Can't Access Web UI or API

Follow these steps in order:

### Step 1: Verify Docker Services

```bash
# Check if Docker is running
docker --version

# Start Docker services
cd ai-slide-agent
docker compose up -d

# Check service status (all should be "healthy" or "running")
docker compose ps
```

Expected output:
```
NAME                  STATUS              PORTS
slidegen-postgres     Up (healthy)        0.0.0.0:5432->5432/tcp
slidegen-redis        Up (healthy)        0.0.0.0:6379->6379/tcp
slidegen-minio        Up (healthy)        0.0.0.0:9000-9001->9000-9001/tcp
```

**If services are not running:**
```bash
# View logs to see what's wrong
docker compose logs postgres
docker compose logs redis
docker compose logs minio

# Stop and restart
docker compose down
docker compose up -d
```

### Step 2: Install Dependencies

```bash
# Make sure you're in the root directory
cd ai-slide-agent

# Install pnpm if you don't have it
npm install -g pnpm

# Install all dependencies
pnpm install
```

### Step 3: Setup Database

```bash
cd apps/api

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# Seed database with demo data
pnpm prisma db seed

cd ../..
```

**If migration fails:**
```bash
# Reset database (WARNING: deletes all data)
cd apps/api
pnpm prisma migrate reset
cd ../..
```

### Step 4: Configure Environment Variables

```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/worker/.env.example apps/worker/.env
cp apps/web/.env.example apps/web/.env
```

**Edit `apps/api/.env`:**
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/slidegen?schema=public"
REDIS_URL="redis://localhost:6379"
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="miniopassword"
OPENAI_API_KEY="sk-your-key-here"  # Add your key or set to empty for mock mode
ENABLE_AI_FEATURES=true
PORT=4000
```

**Edit `apps/worker/.env`:**
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/slidegen?schema=public"
REDIS_URL="redis://localhost:6379"
OPENAI_API_KEY="sk-your-key-here"  # Same as above
ENABLE_AI_FEATURES=true
```

**Edit `apps/web/.env`:**
```bash
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### Step 5: Build Packages

```bash
# Build shared packages first
cd packages/shared
pnpm build
cd ../layout-engine
pnpm build
cd ../quality-gates
pnpm build
cd ../pptx-renderer
pnpm build
cd ../..
```

### Step 6: Start Services Individually (for debugging)

Open **3 separate terminal windows**:

**Terminal 1 - API:**
```bash
cd ai-slide-agent/apps/api
pnpm dev
```

Wait for: `Server listening on port 4000`

**Terminal 2 - Worker:**
```bash
cd ai-slide-agent/apps/worker
pnpm dev
```

Wait for: `Worker started`

**Terminal 3 - Web:**
```bash
cd ai-slide-agent/apps/web
pnpm dev
```

Wait for: `Ready on http://localhost:3000`

### Step 7: Test Each Service

**Test API:**
```bash
curl http://localhost:4000/health
```

Expected: `{"status":"ok","timestamp":"..."}`

**Test Web UI:**
Open browser: http://localhost:3000

Expected: You should see the AI Slide Agent homepage

## Common Issues

### Issue: "Cannot find module '@slide-agent/shared'"

**Solution:**
```bash
# Rebuild shared packages
cd packages/shared
pnpm build
cd ../layout-engine
pnpm build
cd ../..

# Reinstall dependencies
pnpm install
```

### Issue: "Port 3000/4000 already in use"

**Solution:**
```bash
# Find what's using the port
lsof -i :3000
lsof -i :4000

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or use different ports
# For API, edit apps/api/.env:
PORT=4001

# For Web, run:
cd apps/web
pnpm dev -p 3001
```

### Issue: "Prisma Client not generated"

**Solution:**
```bash
cd apps/api
pnpm prisma generate
cd ../..
```

### Issue: "Connection refused - Postgres"

**Solution:**
```bash
# Check if Postgres is running
docker compose ps

# Restart Postgres
docker compose restart postgres

# Wait 10 seconds, then test connection
docker compose exec postgres psql -U postgres -c "SELECT 1"
```

### Issue: "Connection refused - Redis"

**Solution:**
```bash
# Check if Redis is running
docker compose ps

# Restart Redis
docker compose restart redis

# Test connection
redis-cli -h localhost -p 6379 ping
```

Expected: `PONG`

### Issue: "MinIO bucket creation failed"

**Solution:**
```bash
# Access MinIO console
# Open: http://localhost:9001
# Login: minioadmin / miniopassword

# Create bucket manually:
# 1. Click "Buckets" → "Create Bucket"
# 2. Name: slide-assets
# 3. Click "Create Bucket"

# Or via CLI:
docker compose exec minio mc alias set myminio http://localhost:9000 minioadmin miniopassword
docker compose exec minio mc mb myminio/slide-assets
```

### Issue: "OpenAI API errors"

**Solution 1 - Use Mock Mode (no API key needed):**
```bash
# Edit apps/api/.env and apps/worker/.env:
ENABLE_AI_FEATURES=false
# or leave OPENAI_API_KEY empty
```

**Solution 2 - Add Valid API Key:**
```bash
# Edit apps/api/.env and apps/worker/.env:
OPENAI_API_KEY="sk-your-actual-key"
ENABLE_AI_FEATURES=true
```

### Issue: "Next.js build errors"

**Solution:**
```bash
cd apps/web
rm -rf .next
pnpm build
pnpm dev
```

### Issue: "TypeScript compilation errors"

**Solution:**
```bash
# Clean all build artifacts
pnpm clean

# Rebuild everything
pnpm build

# Restart dev servers
pnpm dev
```

## Step-by-Step Fresh Start

If nothing works, try a complete fresh start:

```bash
# 1. Stop all services
docker compose down -v  # WARNING: deletes database data

# 2. Clean everything
cd ai-slide-agent
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf apps/*/.next
rm -rf packages/*/dist
rm -rf apps/api/prisma/dev.db*

# 3. Reinstall
pnpm install

# 4. Build packages
cd packages/shared && pnpm build && cd ../..
cd packages/layout-engine && pnpm build && cd ../..
cd packages/quality-gates && pnpm build && cd ../..
cd packages/pptx-renderer && pnpm build && cd ../..

# 5. Start infrastructure
docker compose up -d

# 6. Wait for services to be healthy
sleep 10
docker compose ps

# 7. Setup database
cd apps/api
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed
cd ../..

# 8. Start API
cd apps/api
pnpm dev
# In new terminal:

# 9. Start Worker
cd apps/worker
pnpm dev
# In new terminal:

# 10. Start Web
cd apps/web
pnpm dev
```

## Verify Everything is Working

### Test 1: API Health Check
```bash
curl http://localhost:4000/health
```

Expected: `{"status":"ok","timestamp":"..."}`

### Test 2: List Decks
```bash
curl http://localhost:4000/api/decks
```

Expected: JSON with demo deck

### Test 3: Create a Test Deck
```bash
curl -X POST http://localhost:4000/api/decks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Deck",
    "startMode": "blank",
    "audience": "executive",
    "goal": "persuade",
    "targetSlides": 5
  }'
```

Expected: JSON with new deck ID

### Test 4: Access Web UI
Open browser: http://localhost:3000

You should see:
- Homepage with "AI Slide Agent" title
- "Get Started" and "Browse Templates" buttons
- Three feature cards

Click "Get Started" → should navigate to http://localhost:3000/decks

## Still Having Issues?

### Collect Debug Information

```bash
# Check versions
node --version    # Should be 18+
pnpm --version    # Should be 8+
docker --version

# Check running processes
lsof -i :3000
lsof -i :4000
lsof -i :5432
lsof -i :6379

# Check Docker logs
docker compose logs --tail=50 postgres
docker compose logs --tail=50 redis
docker compose logs --tail=50 minio

# Check API logs (in api terminal)
# Look for errors in the output

# Check environment
cat apps/api/.env
cat apps/worker/.env
cat apps/web/.env
```

### Report the Issue

If you still can't get it working:

1. Copy the output of all the debug commands above
2. Note which step failed
3. Include error messages
4. Open an issue with this information

## Quick Diagnostic Script

Save this as `diagnose.sh`:

```bash
#!/bin/bash

echo "=== AI Slide Agent Diagnostics ==="

echo -e "\n1. Node/pnpm versions:"
node --version
pnpm --version

echo -e "\n2. Docker services:"
docker compose ps

echo -e "\n3. Port availability:"
lsof -i :3000 | grep LISTEN || echo "Port 3000 available"
lsof -i :4000 | grep LISTEN || echo "Port 4000 available"

echo -e "\n4. Database connection:"
docker compose exec -T postgres psql -U postgres -c "SELECT 1" 2>&1 | head -n 5

echo -e "\n5. Redis connection:"
redis-cli -h localhost -p 6379 ping 2>&1

echo -e "\n6. API health:"
curl -s http://localhost:4000/health 2>&1 | head -n 5

echo -e "\n7. Web UI:"
curl -s http://localhost:3000 2>&1 | head -n 5 | grep -q "AI Slide Agent" && echo "Web UI accessible" || echo "Web UI not accessible"

echo -e "\nDiagnostics complete!"
```

Run it:
```bash
chmod +x diagnose.sh
./diagnose.sh
```
