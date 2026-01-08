# 🚀 START HERE - Get Your App Running!

Follow these steps in order. Each step should take 1-2 minutes.

## ✅ Step 1: Check Prerequisites

Make sure you have:
- [ ] **Node.js 18+** installed - Check with: `node --version`
- [ ] **Docker Desktop** installed and **running** - Check with: `docker ps`

If you don't have these, install them first:
- Node.js: https://nodejs.org/
- Docker: https://www.docker.com/products/docker-desktop/

## ✅ Step 2: Run Automated Setup

Open terminal in the `ai-slide-agent` directory and run:

```bash
./setup.sh
```

This will take 2-3 minutes and will:
- Install all dependencies
- Build the packages
- Start Docker services (PostgreSQL, Redis, MinIO)
- Setup and seed the database
- Create environment files

**Wait for it to finish!** You should see "🎉 Setup complete!"

## ✅ Step 3: Start the Application

### Option A: All-in-One (Recommended)

```bash
pnpm dev
```

This starts all three services (API, Worker, Web) in parallel.

### Option B: Separate Terminals (For Debugging)

**Terminal 1 - API:**
```bash
cd apps/api
pnpm dev
```
Wait for: `Server listening on port 4000`

**Terminal 2 - Worker:**
```bash
cd apps/worker
pnpm dev
```
Wait for: `Worker started`

**Terminal 3 - Web UI:**
```bash
cd apps/web
pnpm dev
```
Wait for: `Ready on http://localhost:3000`

## ✅ Step 4: Access the Application

Open your browser and go to:

**http://localhost:3000**

You should see the AI Slide Agent homepage!

## 🎉 Success!

If you see the homepage, you're all set! Try:
1. Click "Get Started"
2. Click "Create New Deck"
3. Fill in the form and click "Create Deck"

## ❌ Not Working?

### Quick Checks

Run the diagnostic script:
```bash
./diagnose.sh
```

This will tell you exactly what's wrong.

### Common Fixes

**Can't access Web UI (localhost:3000)?**
```bash
# Check if it's running
curl http://localhost:3000
# If not, check logs in the terminal where you ran pnpm dev
```

**Can't access API (localhost:4000)?**
```bash
# Test it
curl http://localhost:4000/health
# Should return: {"status":"ok",...}

# If not working, check:
cd apps/api
pnpm dev
# Look for errors in the output
```

**"Port already in use" error?**
```bash
# Kill processes on that port
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :4000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Docker services not running?**
```bash
docker compose up -d
sleep 10
docker compose ps
# All services should show "Up" or "healthy"
```

**Database errors?**
```bash
cd apps/api
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed
cd ../..
```

**"Cannot find module" errors?**
```bash
# Rebuild packages
cd packages/shared && pnpm build && cd ../..
cd packages/layout-engine && pnpm build && cd ../..
cd packages/quality-gates && pnpm build && cd ../..
cd packages/pptx-renderer && pnpm build && cd ../..
```

**Still stuck?**

See the detailed troubleshooting guide:
```bash
cat TROUBLESHOOTING.md
```

## 🔧 Development Tips

### Restart Everything
```bash
# Stop all services (Ctrl+C in each terminal)
# Or if using pnpm dev, just Ctrl+C once

docker compose restart
pnpm dev
```

### View Logs
```bash
# Docker services
docker compose logs -f postgres
docker compose logs -f redis

# Application logs appear in the terminals
```

### Reset Database
```bash
cd apps/api
pnpm prisma migrate reset
pnpm prisma db seed
cd ../..
```

### Start Fresh
```bash
docker compose down -v
./setup.sh
pnpm dev
```

## 📚 Next Steps

Once you have the app running:

1. **Try creating a deck** - Go to http://localhost:3000/decks and click "Create New Deck"

2. **Read the user guide** - Open `USER_GUIDE.md` to learn all features

3. **Add OpenAI API key** (optional) - Edit `apps/api/.env` and `apps/worker/.env`:
   ```
   OPENAI_API_KEY="sk-your-actual-key"
   ENABLE_AI_FEATURES=true
   ```

4. **Explore the architecture** - Read `ARCHITECTURE.md` to understand how it works

## 🆘 Getting Help

1. Run `./diagnose.sh` to see what's wrong
2. Check `TROUBLESHOOTING.md` for detailed solutions
3. Read `QUICKSTART.md` for alternative setup methods
4. Open an issue on GitHub with the output from `./diagnose.sh`

## ⚡ Quick Reference

```bash
# Setup (first time only)
./setup.sh

# Start app
pnpm dev

# Run diagnostics
./diagnose.sh

# Access points
Web UI:  http://localhost:3000
API:     http://localhost:4000
MinIO:   http://localhost:9001 (admin/miniopassword)

# Stop everything
Ctrl+C (in the terminal running pnpm dev)
docker compose down
```

Good luck! 🎉
