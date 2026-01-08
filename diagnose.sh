#!/bin/bash

echo "🔍 AI Slide Agent - Diagnostics"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Check Node and pnpm
echo -e "\n${YELLOW}1. Checking Node.js and pnpm...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
fi

if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✅ pnpm: $PNPM_VERSION${NC}"
else
    echo -e "${RED}❌ pnpm not found${NC}"
fi

# 2. Check Docker
echo -e "\n${YELLOW}2. Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✅ Docker: $DOCKER_VERSION${NC}"
else
    echo -e "${RED}❌ Docker not found${NC}"
fi

# 3. Check Docker services
echo -e "\n${YELLOW}3. Checking Docker services...${NC}"
if docker compose ps &> /dev/null; then
    echo "Docker Compose Status:"
    docker compose ps

    # Check individual services
    if docker compose ps | grep -q "postgres.*Up"; then
        echo -e "${GREEN}✅ PostgreSQL is running${NC}"
    else
        echo -e "${RED}❌ PostgreSQL is not running${NC}"
    fi

    if docker compose ps | grep -q "redis.*Up"; then
        echo -e "${GREEN}✅ Redis is running${NC}"
    else
        echo -e "${RED}❌ Redis is not running${NC}"
    fi

    if docker compose ps | grep -q "minio.*Up"; then
        echo -e "${GREEN}✅ MinIO is running${NC}"
    else
        echo -e "${RED}❌ MinIO is not running${NC}"
    fi
else
    echo -e "${RED}❌ Docker Compose not running${NC}"
fi

# 4. Check ports
echo -e "\n${YELLOW}4. Checking port availability...${NC}"

check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t &> /dev/null; then
        echo -e "${GREEN}✅ Port $port in use by $service${NC}"
    else
        echo -e "${YELLOW}⚠️  Port $port is available (service not running)${NC}"
    fi
}

check_port 3000 "Web UI"
check_port 4000 "API"
check_port 5432 "PostgreSQL"
check_port 6379 "Redis"
check_port 9000 "MinIO API"
check_port 9001 "MinIO Console"

# 5. Check database connection
echo -e "\n${YELLOW}5. Testing database connection...${NC}"
if docker compose exec -T postgres psql -U postgres -c "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Cannot connect to database${NC}"
fi

# 6. Check Redis connection
echo -e "\n${YELLOW}6. Testing Redis connection...${NC}"
if command -v redis-cli &> /dev/null; then
    if redis-cli -h localhost -p 6379 ping &> /dev/null; then
        echo -e "${GREEN}✅ Redis connection successful${NC}"
    else
        echo -e "${RED}❌ Cannot connect to Redis${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  redis-cli not installed, skipping test${NC}"
fi

# 7. Check API health
echo -e "\n${YELLOW}7. Testing API health endpoint...${NC}"
if curl -f -s http://localhost:4000/health &> /dev/null; then
    HEALTH=$(curl -s http://localhost:4000/health)
    echo -e "${GREEN}✅ API is responding${NC}"
    echo "Response: $HEALTH"
else
    echo -e "${RED}❌ API is not responding${NC}"
fi

# 8. Check Web UI
echo -e "\n${YELLOW}8. Testing Web UI...${NC}"
if curl -f -s http://localhost:3000 &> /dev/null; then
    echo -e "${GREEN}✅ Web UI is responding${NC}"
else
    echo -e "${RED}❌ Web UI is not responding${NC}"
fi

# 9. Check environment files
echo -e "\n${YELLOW}9. Checking environment files...${NC}"

if [ -f apps/api/.env ]; then
    echo -e "${GREEN}✅ apps/api/.env exists${NC}"
    if grep -q "OPENAI_API_KEY=" apps/api/.env; then
        if grep -q "OPENAI_API_KEY=\"\"" apps/api/.env || grep -q "OPENAI_API_KEY=sk-your" apps/api/.env; then
            echo -e "${YELLOW}⚠️  OpenAI API key not configured (using mock mode)${NC}"
        else
            echo -e "${GREEN}✅ OpenAI API key configured${NC}"
        fi
    fi
else
    echo -e "${RED}❌ apps/api/.env missing${NC}"
fi

if [ -f apps/worker/.env ]; then
    echo -e "${GREEN}✅ apps/worker/.env exists${NC}"
else
    echo -e "${RED}❌ apps/worker/.env missing${NC}"
fi

if [ -f apps/web/.env ]; then
    echo -e "${GREEN}✅ apps/web/.env exists${NC}"
else
    echo -e "${RED}❌ apps/web/.env missing${NC}"
fi

# 10. Check if packages are built
echo -e "\n${YELLOW}10. Checking package builds...${NC}"

check_build() {
    local package=$1
    if [ -d "packages/$package/dist" ]; then
        echo -e "${GREEN}✅ packages/$package built${NC}"
    else
        echo -e "${RED}❌ packages/$package not built${NC}"
    fi
}

check_build "shared"
check_build "layout-engine"
check_build "quality-gates"
check_build "pptx-renderer"

# Summary
echo -e "\n${YELLOW}==================================${NC}"
echo -e "${YELLOW}Diagnostics Summary${NC}"
echo -e "${YELLOW}==================================${NC}"

if docker compose ps | grep -q "Up" && curl -f -s http://localhost:4000/health &> /dev/null && curl -f -s http://localhost:3000 &> /dev/null; then
    echo -e "${GREEN}✅ System appears to be running correctly!${NC}"
    echo -e "\nAccess points:"
    echo -e "  Web UI:  http://localhost:3000"
    echo -e "  API:     http://localhost:4000"
    echo -e "  MinIO:   http://localhost:9001"
else
    echo -e "${RED}❌ System has issues. Follow these steps:${NC}"
    echo -e "\n1. Start Docker services:"
    echo -e "   docker compose up -d"
    echo -e "\n2. Run setup if not done:"
    echo -e "   ./setup.sh"
    echo -e "\n3. Start application:"
    echo -e "   ./start.sh"
    echo -e "\nOr see TROUBLESHOOTING.md for detailed help"
fi

echo ""
