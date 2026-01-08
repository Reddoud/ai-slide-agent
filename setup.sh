#!/bin/bash

set -e

echo "🚀 AI Slide Agent - Setup Script"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}📦 pnpm not found. Installing...${NC}"
    npm install -g pnpm
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install Docker${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
pnpm install

# Setup environment files
echo -e "\n${YELLOW}Setting up environment files...${NC}"

if [ ! -f apps/api/.env ]; then
    cp apps/api/.env.example apps/api/.env
    echo -e "${GREEN}✅ Created apps/api/.env${NC}"
else
    echo -e "${YELLOW}⚠️  apps/api/.env already exists, skipping${NC}"
fi

if [ ! -f apps/worker/.env ]; then
    cp apps/worker/.env.example apps/worker/.env
    echo -e "${GREEN}✅ Created apps/worker/.env${NC}"
else
    echo -e "${YELLOW}⚠️  apps/worker/.env already exists, skipping${NC}"
fi

if [ ! -f apps/web/.env ]; then
    cp apps/web/.env.example apps/web/.env
    echo -e "${GREEN}✅ Created apps/web/.env${NC}"
else
    echo -e "${YELLOW}⚠️  apps/web/.env already exists, skipping${NC}"
fi

# Build shared packages
echo -e "\n${YELLOW}Building shared packages...${NC}"
cd packages/shared && pnpm build && cd ../..
cd packages/layout-engine && pnpm build && cd ../..
cd packages/quality-gates && pnpm build && cd ../..
cd packages/pptx-renderer && pnpm build && cd ../..
echo -e "${GREEN}✅ Packages built${NC}"

# Start Docker services
echo -e "\n${YELLOW}Starting Docker services...${NC}"
docker compose up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 5

# Check if services are running
if docker compose ps | grep -q "healthy"; then
    echo -e "${GREEN}✅ Docker services are running${NC}"
else
    echo -e "${RED}❌ Docker services failed to start. Check with: docker compose logs${NC}"
    exit 1
fi

# Setup database
echo -e "\n${YELLOW}Setting up database...${NC}"
cd apps/api

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# Seed database
pnpm prisma db seed

cd ../..
echo -e "${GREEN}✅ Database ready${NC}"

# Final instructions
echo -e "\n${GREEN}🎉 Setup complete!${NC}"
echo -e "\nTo start the application, run these commands in separate terminals:"
echo -e "\n${YELLOW}Terminal 1 (API):${NC}"
echo -e "  cd ai-slide-agent/apps/api"
echo -e "  pnpm dev"
echo -e "\n${YELLOW}Terminal 2 (Worker):${NC}"
echo -e "  cd ai-slide-agent/apps/worker"
echo -e "  pnpm dev"
echo -e "\n${YELLOW}Terminal 3 (Web):${NC}"
echo -e "  cd ai-slide-agent/apps/web"
echo -e "  pnpm dev"
echo -e "\n${YELLOW}Or use the start script:${NC}"
echo -e "  ./start.sh"
echo -e "\n${YELLOW}Access points:${NC}"
echo -e "  Web UI:  ${GREEN}http://localhost:3000${NC}"
echo -e "  API:     ${GREEN}http://localhost:4000${NC}"
echo -e "  MinIO:   ${GREEN}http://localhost:9001${NC} (admin/miniopassword)"
echo -e "\n${YELLOW}⚠️  Important:${NC}"
echo -e "  Add your OpenAI API key to apps/api/.env and apps/worker/.env"
echo -e "  Or set ENABLE_AI_FEATURES=false for mock mode"
echo ""
