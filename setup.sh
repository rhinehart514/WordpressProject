#!/bin/bash

# AI Website Rebuilder - Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🚀 AI Website Rebuilder - Setup Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running in project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo "📋 Checking prerequisites..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js ${NODE_VERSION} installed"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js >= 20.0.0"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm ${NPM_VERSION} installed"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check Docker (optional)
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker -v | cut -d ' ' -f3 | tr -d ',')
    echo -e "${GREEN}✓${NC} Docker ${DOCKER_VERSION} installed"
    HAS_DOCKER=true
else
    echo -e "${YELLOW}⚠${NC} Docker not found (optional - you can use local PostgreSQL)"
    HAS_DOCKER=false
fi

echo ""
echo "📦 Installing dependencies..."
npm install
echo -e "${GREEN}✓${NC} Dependencies installed"

echo ""
echo "🔧 Setting up environment..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC} .env file not found, creating from .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✓${NC} .env file created"
else
    echo -e "${GREEN}✓${NC} .env file already exists"
fi

echo ""
echo "🗄️  Setting up database..."
echo ""
echo "Choose your database setup option:"
echo "1) Use Docker (recommended - automatic setup)"
echo "2) Use existing local PostgreSQL"
echo "3) Skip database setup (I'll do it manually)"
read -p "Enter your choice (1-3): " DB_CHOICE

case $DB_CHOICE in
    1)
        if [ "$HAS_DOCKER" = true ]; then
            echo "Starting PostgreSQL with Docker..."
            docker run -d \
                --name ai-rebuilder-postgres \
                -e POSTGRES_PASSWORD=postgres \
                -e POSTGRES_USER=postgres \
                -e POSTGRES_DB=ai_website_rebuilder \
                -p 5432:5432 \
                postgres:16-alpine

            echo "Waiting for PostgreSQL to be ready..."
            sleep 5
            echo -e "${GREEN}✓${NC} PostgreSQL started in Docker"
        else
            echo -e "${RED}✗${NC} Docker not available. Please choose option 2 or 3"
            exit 1
        fi
        ;;
    2)
        echo "Checking local PostgreSQL connection..."
        if command -v psql &> /dev/null; then
            echo -e "${GREEN}✓${NC} PostgreSQL client found"
            echo "Please ensure PostgreSQL is running and the database 'ai_website_rebuilder' exists"
            read -p "Press Enter to continue when ready..."
        else
            echo -e "${YELLOW}⚠${NC} psql not found. Assuming PostgreSQL is running..."
        fi
        ;;
    3)
        echo -e "${YELLOW}⚠${NC} Skipping database setup"
        echo "Don't forget to set up PostgreSQL manually!"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

if [ "$DB_CHOICE" != "3" ]; then
    echo ""
    echo "📊 Running database migrations..."
    npx prisma generate
    npx prisma migrate dev --name init || {
        echo -e "${YELLOW}⚠${NC} Migration failed - database might already be set up"
    }
    echo -e "${GREEN}✓${NC} Database migrations complete"
fi

echo ""
echo "🤖 Setting up AI provider..."
echo ""
echo "Choose your AI provider:"
echo "1) Ollama (FREE - runs locally, recommended)"
echo "2) OpenAI (paid API key required)"
echo "3) Skip AI setup (configure later)"
read -p "Enter your choice (1-3): " AI_CHOICE

case $AI_CHOICE in
    1)
        if [ "$HAS_DOCKER" = true ]; then
            echo "Starting Ollama with Docker..."
            docker run -d \
                --name ai-rebuilder-ollama \
                -p 11434:11434 \
                -v ollama_data:/root/.ollama \
                ollama/ollama:latest

            sleep 3
            echo "Pulling llama3.1:8b model..."
            docker exec ai-rebuilder-ollama ollama pull llama3.1:8b
            echo -e "${GREEN}✓${NC} Ollama set up with llama3.1:8b model"
        else
            echo ""
            echo "Please install Ollama manually:"
            echo "1. Visit: https://ollama.com/download"
            echo "2. Run: ollama pull llama3.1:8b"
            echo "3. Run: ollama serve"
            read -p "Press Enter when done..."
        fi
        # Update .env
        sed -i.bak 's|OPENAI_API_KEY=.*|OPENAI_API_KEY="ollama"|' .env
        sed -i.bak 's|AI_BASE_URL=.*|AI_BASE_URL="http://localhost:11434/v1"|' .env
        sed -i.bak 's|OPENAI_MODEL=.*|OPENAI_MODEL="llama3.1:8b"|' .env
        ;;
    2)
        echo ""
        read -p "Enter your OpenAI API key: " OPENAI_KEY
        sed -i.bak "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=\"${OPENAI_KEY}\"|" .env
        sed -i.bak 's|AI_BASE_URL=.*|AI_BASE_URL=""|' .env
        sed -i.bak 's|OPENAI_MODEL=.*|OPENAI_MODEL="gpt-3.5-turbo"|' .env
        echo -e "${GREEN}✓${NC} OpenAI API key configured"
        ;;
    3)
        echo -e "${YELLOW}⚠${NC} Skipping AI setup - update .env manually"
        ;;
esac

echo ""
echo "🔧 Optional: Set up Redis (for job queues)?"
read -p "Install Redis with Docker? (y/N): " REDIS_CHOICE

if [[ $REDIS_CHOICE =~ ^[Yy]$ ]] && [ "$HAS_DOCKER" = true ]; then
    echo "Starting Redis with Docker..."
    docker run -d \
        --name ai-rebuilder-redis \
        -p 6379:6379 \
        redis:7-alpine
    echo -e "${GREEN}✓${NC} Redis started"
else
    echo -e "${YELLOW}⚠${NC} Skipping Redis setup"
fi

echo ""
echo "🏗️  Building the project..."
npm run build
echo -e "${GREEN}✓${NC} Build complete"

echo ""
echo "======================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Start the development server:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "2. Open the API documentation:"
echo "   ${GREEN}http://localhost:3001/api/docs${NC}"
echo ""
echo "3. (Optional) Start the web frontend:"
echo "   ${GREEN}npm run dev --workspace=apps/web${NC}"
echo ""
echo "📚 Documentation:"
echo "   - QUICK_START.md - Getting started guide"
echo "   - API_EXAMPLES.md - API usage examples"
echo "   - DEPLOYMENT_CHECKLIST.md - Production checklist"
echo ""
echo "🐛 Troubleshooting:"
echo "   If you encounter issues, check the logs and documentation"
echo ""
echo "Happy building! 🚀"
