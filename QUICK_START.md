# 🚀 Quick Start Guide - AI Website Rebuilder

## Prerequisites

Before you start, ensure you have the following installed:

- **Node.js** >= 20.0.0
- **PostgreSQL** >= 14
- **Redis** (optional, for job queues)
- **Ollama** (optional, for free local AI) OR OpenAI API key

---

## 📦 Installation Steps

### 1. Install Dependencies

Already done! All packages are installed.

```bash
# If you need to reinstall:
npm install
```

### 2. Set Up PostgreSQL Database

**Option A: Using Docker (Recommended)**
```bash
docker run --name ai-website-rebuilder-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=ai_website_rebuilder \
  -p 5432:5432 \
  -d postgres:16
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb ai_website_rebuilder

# Or using psql:
psql -U postgres
CREATE DATABASE ai_website_rebuilder;
\q
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will create all the necessary tables:
- `site_analyses` - Website analysis results
- `scraped_pages` - Scraped page content
- `content_blocks` - Extracted content blocks
- `site_rebuilds` - Generated rebuilds
- `bricks_page_structures` - Bricks page data
- `wordpress_deployments` - Deployment tracking
- `conversations` - Chat conversations
- `messages` - Chat messages
- And more...

### 4. (Optional) Set Up Redis

**Using Docker:**
```bash
docker run --name ai-website-rebuilder-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

**Or install locally:**
```bash
# macOS
brew install redis
redis-server

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis
```

### 5. Configure AI Provider

**Option A: FREE Local AI with Ollama (Recommended)**
```bash
# Install Ollama: https://ollama.com/download
# Then pull and run the model:
ollama pull llama3.1:8b
ollama serve
```

Your `.env` is already configured for Ollama:
```env
OPENAI_API_KEY="ollama"
AI_BASE_URL="http://localhost:11434/v1"
OPENAI_MODEL="llama3.1:8b"
```

**Option B: OpenAI (Paid)**
Update `.env`:
```env
OPENAI_API_KEY="sk-your-actual-openai-key-here"
AI_BASE_URL=""  # Leave empty or remove
OPENAI_MODEL="gpt-3.5-turbo"
```

---

## 🏃 Running the Application

### Start the API Server

```bash
npm run dev
```

You should see:
```
🚀 Application started successfully
📍 Environment: development
🌐 API running on http://localhost:3001
📚 API Docs available at http://localhost:3001/api/docs
🔒 Rate limiting: Enabled (10 req/s, 100 req/min, 1000 req/hr)
🔑 Authentication: JWT with 7d expiration
```

### Start the Web Frontend (Optional)

```bash
# In a new terminal:
cd apps/web
npm run dev
```

Frontend will run on http://localhost:3000

---

## 🧪 Testing the API

### 1. Open API Documentation

Visit: http://localhost:3001/api/docs

This interactive Swagger UI lets you test all endpoints.

### 2. Test with cURL

**Health Check:**
```bash
curl http://localhost:3001
```

**Start a Chat Conversation:**
```bash
curl -X POST http://localhost:3001/chat/conversations \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Conversation",
    "userId": "user-123"
  }'
```

**Analyze a Website:**
```bash
curl -X POST http://localhost:3001/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Analyze this website: https://example-restaurant.com",
    "userId": "user-123"
  }'
```

### 3. Test WordPress Deployment

First, you need a WordPress site with:
- REST API enabled
- Application password generated

```bash
# Test WordPress connection
curl -X POST http://localhost:3001/wordpress/test \
  -H "Content-Type: application/json" \
  -d '{
    "baseUrl": "https://your-wordpress-site.com",
    "username": "admin",
    "applicationPassword": "xxxx xxxx xxxx xxxx xxxx xxxx"
  }'
```

---

## 📁 Project Structure

```
WordpressProject/
├── apps/
│   ├── api/          # NestJS API server ✅
│   └── web/          # Next.js frontend
├── packages/
│   ├── domain/       # DDD domain models ✅
│   └── shared-types/ # Shared TypeScript types ✅
├── infrastructure/
│   └── database/     # Prisma schema & migrations
├── services/
│   └── wordpress-plugin/ # WordPress Bricks plugin
└── .env              # Environment variables ✅
```

---

## 🔑 Key Features Implemented

### ✅ Core API
- [x] Chat interface with AI
- [x] Website scraping with Puppeteer
- [x] AI-powered website analysis
- [x] Bricks page generation
- [x] Preview generation
- [x] WordPress deployment

### ✅ Security
- [x] Rate limiting (3-tier: sec/min/hr)
- [x] CORS with origin validation
- [x] Security headers (XSS, HSTS, etc.)
- [x] Input validation on all DTOs
- [x] Environment variable validation
- [x] JWT authentication ready

### ✅ Developer Experience
- [x] Swagger API documentation
- [x] TypeScript throughout (0 errors)
- [x] Structured logging
- [x] Error handling
- [x] Graceful shutdown
- [x] Hot reload in development

---

## 🛠️ Available Commands

### Development
```bash
npm run dev          # Start API in watch mode
npm run build        # Build all packages
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

### Database
```bash
npx prisma migrate dev     # Run migrations
npx prisma studio          # Open Prisma Studio UI
npx prisma generate        # Regenerate Prisma Client
```

### Production
```bash
npm run build
npm run start:prod   # Start API in production mode
```

---

## 🔧 Configuration

All configuration is in `.env`:

```env
# Database (Required)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_website_rebuilder"

# AI Provider (Required)
OPENAI_API_KEY="ollama"              # Or your OpenAI key
AI_BASE_URL="http://localhost:11434/v1"  # For Ollama
OPENAI_MODEL="llama3.1:8b"           # Or "gpt-3.5-turbo"

# Security (Required)
JWT_SECRET="dev-jwt-secret-at-least-32-characters-long-change-in-production"

# Optional
REDIS_URL="redis://localhost:6379"
API_PORT=3001
NODE_ENV="development"
LOG_LEVEL="debug"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running:
docker ps | grep postgres
# Or:
pg_isready

# Restart if needed:
docker restart ai-website-rebuilder-db
```

### Prisma Client Not Found
```bash
npx prisma generate
```

### Port Already in Use
```bash
# Find what's using port 3001:
lsof -i :3001
# Kill the process:
kill -9 <PID>
```

### AI Responses Not Working
- **Ollama**: Make sure `ollama serve` is running
- **OpenAI**: Verify API key is valid

---

## 📚 Next Steps

1. **Run Database Migrations** (see step 3 above)
2. **Start the API server**: `npm run dev`
3. **Open Swagger Docs**: http://localhost:3001/api/docs
4. **Try the Chat API**: Send a message to analyze a website
5. **Generate a Rebuild**: Convert analysis to Bricks pages
6. **Deploy to WordPress**: Push pages to your WordPress site

---

## 🎯 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/docs` | GET | Swagger documentation |
| `/chat/conversations` | POST | Create conversation |
| `/chat/send` | POST | Send message (streaming) |
| `/chat/:id` | GET | Get conversation |
| `/wordpress/test` | POST | Test WordPress connection |
| `/wordpress/deploy` | POST | Deploy to WordPress |
| `/preview/:rebuildId` | GET | Preview generated pages |

---

## 💡 Tips

- **Use Ollama for Free**: No API costs, runs locally
- **Rate Limits**: 10 req/s, 100 req/min, 1000 req/hr (configurable)
- **Streaming Responses**: Chat API streams responses for better UX
- **Error Handling**: All errors return proper HTTP status codes
- **Logging**: Check console for detailed logs (LOG_LEVEL=debug)

---

## 🤝 Support

- **API Docs**: http://localhost:3001/api/docs
- **Issues**: Check the RUTHLESS_AUDIT_REPORT.md for known issues
- **Architecture**: See PROJECT_SUMMARY.md

---

**Ready to build? Start the API and open the docs!** 🚀
