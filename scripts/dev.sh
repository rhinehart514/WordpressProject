#!/bin/bash

# Development helper script
# Provides common development tasks

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

case "$1" in
  start)
    echo -e "${GREEN}Starting development server...${NC}"
    npm run dev
    ;;

  db:reset)
    echo -e "${YELLOW}Resetting database...${NC}"
    npx prisma migrate reset --force
    echo -e "${GREEN}Database reset complete${NC}"
    ;;

  db:seed)
    echo -e "${YELLOW}Seeding database...${NC}"
    npx prisma db seed
    echo -e "${GREEN}Database seeding complete${NC}"
    ;;

  db:studio)
    echo -e "${GREEN}Opening Prisma Studio...${NC}"
    npx prisma studio
    ;;

  docker:up)
    echo -e "${GREEN}Starting Docker services...${NC}"
    docker-compose up -d
    echo -e "${GREEN}Docker services started${NC}"
    docker-compose ps
    ;;

  docker:down)
    echo -e "${YELLOW}Stopping Docker services...${NC}"
    docker-compose down
    echo -e "${GREEN}Docker services stopped${NC}"
    ;;

  docker:logs)
    docker-compose logs -f ${2:-}
    ;;

  ollama:pull)
    echo -e "${GREEN}Pulling Ollama model: ${2:-llama3.1:8b}${NC}"
    if docker ps | grep -q ai-rebuilder-ollama; then
      docker exec ai-rebuilder-ollama ollama pull ${2:-llama3.1:8b}
    else
      ollama pull ${2:-llama3.1:8b}
    fi
    echo -e "${GREEN}Model ready${NC}"
    ;;

  test)
    echo -e "${GREEN}Running tests...${NC}"
    npm run test
    ;;

  build)
    echo -e "${GREEN}Building project...${NC}"
    npm run build
    echo -e "${GREEN}Build complete${NC}"
    ;;

  clean)
    echo -e "${YELLOW}Cleaning build artifacts...${NC}"
    rm -rf apps/*/dist
    rm -rf packages/*/dist
    rm -rf node_modules/.cache
    echo -e "${GREEN}Clean complete${NC}"
    ;;

  reset)
    echo -e "${YELLOW}Resetting entire project...${NC}"
    read -p "This will delete node_modules and reset the database. Continue? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      rm -rf node_modules
      rm -rf apps/*/node_modules
      rm -rf packages/*/node_modules
      npm install
      npx prisma generate
      npx prisma migrate reset --force
      echo -e "${GREEN}Project reset complete${NC}"
    fi
    ;;

  *)
    echo "AI Website Rebuilder - Development Scripts"
    echo ""
    echo "Usage: ./scripts/dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start           Start development server"
    echo "  db:reset        Reset database and run migrations"
    echo "  db:seed         Seed database with sample data"
    echo "  db:studio       Open Prisma Studio (database UI)"
    echo "  docker:up       Start all Docker services"
    echo "  docker:down     Stop all Docker services"
    echo "  docker:logs     View Docker logs (optionally specify service)"
    echo "  ollama:pull     Pull Ollama model (default: llama3.1:8b)"
    echo "  test            Run tests"
    echo "  build           Build all packages"
    echo "  clean           Clean build artifacts"
    echo "  reset           Full project reset (WARNING: destructive)"
    echo ""
    echo "Examples:"
    echo "  ./scripts/dev.sh start"
    echo "  ./scripts/dev.sh docker:up"
    echo "  ./scripts/dev.sh db:seed"
    echo "  ./scripts/dev.sh ollama:pull llama3.2"
    echo "  ./scripts/dev.sh docker:logs api"
    ;;
esac
