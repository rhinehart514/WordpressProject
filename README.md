# AI Website Rebuilder - OpenAI Chat Interface

Conversational AI platform for automated restaurant website rebuilding using an OpenAI-style chat interface.

## 🎯 Overview

This platform provides a **ChatGPT-style conversational interface** for:
1. **Analyzing** existing restaurant websites through natural conversation
2. **Rebuilding** them using modern templates (Bricks Builder)
3. **Previewing** generated sites in real-time
4. **Deploying** to WordPress with AI assistance
5. **Maintaining** sites with automated updates

**Chat-First Approach:**
- Natural language website analysis requests
- Real-time streaming AI responses
- Conversation history with context awareness
- OpenAI-inspired dark theme UI

## 🏗 Architecture

Domain-Driven Design (DDD) **monorepo** with modern AI chat capabilities:

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15.1.8 + React 19 + Tailwind CSS |
| **Chat UI** | Zustand + Server-Sent Events (SSE) |
| **AI Integration** | OpenAI SDK v6.1.0 + Streaming |
| **Backend API** | NestJS 10.3 + TypeScript 5.7 |
| **Database** | PostgreSQL + Prisma 6.2.0 ORM |
| **Deployment Target** | WordPress + Bricks Builder |
| **Monorepo** | Turborepo |
| **Scraper** | Puppeteer |

## 📁 Project Structure

```
wordpress-project/
├── apps/
│   ├── web/                    # Next.js (Self-serve + Agency UI)
│   └── api/                    # NestJS Backend API
├── packages/
│   ├── shared-types/           # TypeScript interfaces (all domains)
│   ├── domain/                 # DDD base classes + domain models
│   └── ui/                     # Shared React components
├── services/
│   └── wordpress-plugin/       # Bricks API Bridge (PHP)
└── infrastructure/
    └── database/               # Prisma schema & migrations
```

## 🧱 Bounded Contexts (DDD)

### Core Domains
1. **Site Discovery** - Web scraping & content extraction
2. **Content Rebuild** - Transform to Bricks elements
3. **WordPress Deployment** - Push via REST API

### Supporting Domains
4. **Restaurant Management** - Menu/hours/gallery updates
5. **Agency Operations** - Multi-client dashboard
6. **Billing & Subscriptions** - Payment processing

## ✨ Chat Interface Features

### Conversational Workflow
- **Natural Language Input**: "Analyze https://restaurant-example.com"
- **Streaming Responses**: Real-time AI responses with typing indicators
- **Context Awareness**: Maintains conversation history for follow-up questions
- **Intent Detection**: Automatically triggers website analysis, rebuild, or deployment

### UI Components
- **ChatInput**: Auto-resizing textarea with Enter/Shift+Enter support
- **ChatMessages**: Markdown rendering with code syntax highlighting
- **ChatSidebar**: Conversation history with search and filtering
- **Streaming Cursor**: Animated typing indicator during AI responses

### OpenAI-Inspired Theme
- Dark mode color palette matching ChatGPT
- Smooth animations (fadeIn, slideUp, slideInRight)
- Responsive three-column layout
- Accessible keyboard navigation

## 🚀 Quick Start

### Prerequisites

- **Node.js** >=20.0.0
- **PostgreSQL** >=15
- **WordPress** site with **Bricks Builder** installed
- **AI Option** - Choose ONE (all have FREE options):
  - 🖥️ **Ollama** - Run AI on YOUR computer ([LOCAL_AI_SETUP.md](./LOCAL_AI_SETUP.md)) ⭐ Most private
  - ☁️ **Groq** - Free cloud API ([FREE_AI_SETUP.md](./FREE_AI_SETUP.md)) ⚡ Fastest
  - ☁️ **Google Gemini** - 1.5M requests/day free
  - ☁️ **OpenRouter** - Multiple free models
  - 💵 **OpenAI** - Paid option (~$5/month)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_website_rebuilder"

# AI - Choose a 100% FREE option! (See FREE_AI_SETUP.md for details)
# Option 1: Groq (RECOMMENDED - fastest, free, no credit card)
GROQ_API_KEY="gsk_your_groq_key_here"
AI_BASE_URL="https://api.groq.com/openai/v1"
OPENAI_MODEL="llama-3.1-70b-versatile"

# Option 2: Google Gemini (1.5M requests/day free)
# GEMINI_API_KEY="your-gemini-key"
# AI_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai/"
# OPENAI_MODEL="gemini-1.5-flash"

# Option 3: OpenAI (PAID - costs money)
# OPENAI_API_KEY="sk-..."
# OPENAI_MODEL="gpt-4o"

# NestJS API
API_PORT=3001
JWT_SECRET="your-jwt-secret"

# WordPress
WORDPRESS_DEFAULT_URL="https://your-wordpress-site.com"
WORDPRESS_API_KEY="your-api-key"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

**💡 Choose Your FREE AI Option:**
- 🖥️ **[Run Locally with Ollama](./LOCAL_AI_SETUP.md)** - 100% private, works offline
- ☁️ **[Use Free Cloud API](./FREE_AI_SETUP.md)** - Groq/Gemini, no hardware needed

### Quick Comparison

| Option | Cost | Speed | Privacy | Setup Time | Hardware Needed |
|--------|------|-------|---------|------------|-----------------|
| **Ollama (Local)** | $0 | Good | 100% Private | 5 min | 8GB+ RAM |
| **Groq (Cloud)** | $0 | Fastest | Shared | 2 min | None |
| **Gemini (Cloud)** | $0 | Fast | Shared | 2 min | None |
| **OpenAI (Paid)** | ~$5/mo | Fast | Shared | 2 min | None |

### 3. Set Up Database

```bash
# Generate Prisma client
cd infrastructure/database
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (creates templates)
npm run db:seed
```

### 4. Install WordPress Plugin

1. Copy `services/wordpress-plugin/` to your WordPress `/wp-content/plugins/` directory
2. Activate "Bricks API Bridge" in WordPress admin
3. Set API token:
   ```php
   update_option('bricks_api_bridge_token', 'your-secure-token-here');
   ```

### 5. Start Development Servers

```bash
# From project root
npm run dev
```

This starts:
- **Next.js** (web): `http://localhost:3000`
- **NestJS API**: `http://localhost:3001`
- **API Docs (Swagger)**: `http://localhost:3001/api/docs`

## 📚 API Documentation

### NestJS API Endpoints

**Base URL:** `http://localhost:3001`

#### Chat Endpoints

```bash
# Send message with streaming response (SSE)
POST /chat/message/stream
Content-Type: application/json

{
  "content": "Analyze https://restaurant-example.com",
  "conversationId": "uuid-optional",
  "userId": "uuid-optional"
}

# SSE Response Stream:
data: {"type":"conversation_id","data":"uuid"}
data: {"type":"message_id","data":"uuid"}
data: {"type":"content","data":"I'll analyze that website..."}
data: {"type":"content","data":" Let me scrape it first."}
data: {"type":"done","data":null}

# Get conversation history
GET /chat/conversations
Query: ?userId=uuid&limit=20

# Response:
{
  "conversations": [
    {
      "id": "uuid",
      "title": "Restaurant Analysis",
      "createdAt": "2025-01-14T...",
      "messages": [...]
    }
  ]
}

# Get single conversation with messages
GET /chat/conversations/:id

# Delete conversation
DELETE /chat/conversations/:id
```

#### Preview Endpoints

```bash
# Preview entire rebuild (all pages)
GET /preview/:rebuildId

# Returns: HTML page with navigation and all pages

# Preview single page
GET /preview/:rebuildId/:pageSlug

# Returns: HTML rendering of Bricks elements
```

#### Scraper Endpoints

```bash
# Analyze restaurant website
POST /scraper/analyze
Content-Type: application/json

{
  "url": "https://restaurant-example.com"
}

# Response:
{
  "success": true,
  "pageCount": 5,
  "restaurantInfo": {
    "name": "Mario's Restaurant",
    "logo": "...",
    "primaryColor": "#1a1a1a"
  },
  "pages": [...]
}
```

### WordPress API Endpoints

**Base URL:** `https://your-site.com/wp-json/bricks-api/v1`

```bash
# Create restaurant page
POST /create-restaurant-page
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json

{
  "name": "Mario's Italian Restaurant",
  "hero_image": "https://...",
  "menu_items": [...],
  "gallery_images": [...]
}
```

See [WordPress Plugin README](./services/wordpress-plugin/README.md) for full API docs.

## 🛠 Development Commands

```bash
# Development
npm run dev              # Start all apps in dev mode
npm run build            # Build all packages
npm run lint             # Lint code
npm run test             # Run tests

# Database
cd infrastructure/database
npm run db:migrate       # Run migrations
npm run db:push          # Push schema (dev)
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database

# Individual apps
cd apps/web && npm run dev      # Next.js only
cd apps/api && npm run dev      # NestJS only
```

## 💬 Chat Workflow

### Example Conversation

```
User: Analyze https://marios-restaurant.com

AI: I'll analyze that website for you. Let me scrape the content first...
    [Streaming response with analysis results]

    Analysis complete! I found:
    - Homepage with hero section and menu preview
    - Menu page with 12 items
    - About page with restaurant history
    - Contact page with hours and location

    Would you like me to generate a rebuild?

User: Yes, generate the rebuild

AI: I'll generate a modern Bricks Builder structure for your site...
    [Streaming response with rebuild details]

    Rebuild complete! I've created 4 pages with modern layouts.
    You can preview at: http://localhost:3001/preview/uuid

    Ready to deploy to WordPress?

User: Show me the preview first

AI: Here's the preview link: http://localhost:3001/preview/uuid
    [Preview opens showing the generated HTML with navigation]
```

### Intent Detection

The chat interface automatically detects user intents:

1. **Website Analysis Intent**
   - Triggers: "analyze [url]", "scrape [url]", "check out [url]"
   - Action: Calls `AnalyzeSiteUseCase` → Scrapes site → AI analysis

2. **Rebuild Generation Intent**
   - Triggers: "generate rebuild", "create pages", "build the site"
   - Action: Calls `GenerateRebuildUseCase` → Creates Bricks elements

3. **Deployment Intent**
   - Triggers: "deploy", "push to wordpress", "publish"
   - Action: Calls WordPress deployment workflow

4. **General Chat**
   - Triggers: Everything else
   - Action: Standard OpenAI chat completion

## 🎨 Domain Models

### Chat Aggregate (NEW)

```typescript
Conversation (Aggregate Root)
  ├── id: string (UUID)
  ├── title: string | null
  ├── userId: string | null
  ├── metadata: Json | null
  └── messages: Message[] (Entities)
       ├── role: MessageRole (USER | ASSISTANT | SYSTEM)
       ├── content: string (Text)
       └── metadata: Json | null
```

### Site Discovery Aggregate

```typescript
SiteAnalysis (Aggregate Root)
  ├── URL (Value Object)
  ├── SiteMetadata
  └── ScrapedPage[] (Entities)
       ├── PageType (Value Object)
       ├── ContentBlock[] (Entities)
       └── ExtractedAsset[] (Entities)
```

### Content Rebuild Aggregate

```typescript
SiteRebuild (Aggregate Root)
  ├── PageTemplate (Entity)
  └── BricksPageStructure[] (Entities)
       └── BricksElement[] (Value Objects)
            ├── name: string (heading, image, button, etc.)
            ├── settings: Json (styles, content)
            └── children: BricksElement[] (recursive)
```

### WordPress Deployment Aggregate

```typescript
DeploymentJob (Aggregate Root)
  ├── WordPressSite (Entity)
  └── DeployedPageInfo[] (Map)
```

## 🔐 Security

- **JWT authentication** for NestJS API
- **Bearer token auth** for WordPress REST API
- **Input sanitization** on all endpoints
- **WordPress capability checks** (edit_posts)
- **Encrypted API keys** in database

## 📖 Documentation

- [Architecture Deep Dive](./docs/architecture.md) *(coming soon)*
- [WordPress Plugin Guide](./services/wordpress-plugin/README.md) ✅
- [Domain Models Reference](./docs/domain-models.md) *(coming soon)*
- [Deployment Guide](./docs/deployment.md) *(coming soon)*

## 🧪 Testing

```bash
# Run all tests
npm run test

# Test chat streaming
curl -X POST http://localhost:3001/chat/message/stream \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, can you help me rebuild a website?"}'

# Test conversation history
curl http://localhost:3001/chat/conversations

# Test scraper
curl -X POST http://localhost:3001/scraper/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example-restaurant.com"}'

# Test preview generation
curl http://localhost:3001/preview/REBUILD_ID

# Test WordPress API
curl -X GET https://your-site.com/wp-json/bricks-api/v1/health
```

### Manual UI Testing

1. **Open chat interface**: Navigate to `http://localhost:3000`
2. **Send a message**: Type "Hello" and press Enter
3. **Check streaming**: Verify AI response streams in real-time
4. **Test website analysis**: Type "Analyze https://example-restaurant.com"
5. **View sidebar**: Check conversation history in left sidebar
6. **Test markdown**: Send code blocks and verify syntax highlighting
7. **Test multi-line**: Hold Shift+Enter for new lines

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database (PostgreSQL)
- [ ] Set secure JWT secrets
- [ ] **Set OpenAI API key** with production rate limits
- [ ] **Set OpenAI model** (e.g., `gpt-4-turbo-preview`)
- [ ] Configure S3 for preview assets
- [ ] Set up Redis for job queues (optional)
- [ ] Configure Stripe for billing (if needed)
- [ ] Deploy Next.js to Vercel
- [ ] Deploy NestJS to Railway/Fly.io/Render
- [ ] Set up monitoring (Sentry)
- [ ] Configure CORS for production domains
- [ ] **Test SSE streaming** in production environment
- [ ] Set up database backups
- [ ] Configure rate limiting for API endpoints

## 🔧 Technology Stack

### Frontend
- **Next.js 15.1.8**: App Router, Server Components, streaming
- **React 19**: Latest concurrent features
- **Zustand**: State management (chat store)
- **Tailwind CSS 3.4**: Utility-first styling with custom theme
- **Framer Motion 11**: Smooth animations
- **React Markdown**: Markdown rendering with syntax highlighting
- **TextareaAutosize**: Auto-resizing chat input

### Backend
- **NestJS 10.3**: Modular architecture, dependency injection
- **OpenAI SDK 6.1.0**: Streaming chat completions
- **Prisma 6.2.0**: Type-safe ORM with PostgreSQL
- **Puppeteer**: Headless browser for web scraping
- **TypeScript 5.7**: Full-stack type safety

### Infrastructure
- **PostgreSQL 15+**: Primary database
- **Turborepo**: Monorepo build orchestration
- **Server-Sent Events (SSE)**: Real-time streaming

## 🐛 Troubleshooting

### Chat not streaming
- Verify `OPENAI_API_KEY` is set in `.env`
- Check browser console for SSE connection errors
- Ensure API is running on port 3001

### Database connection errors
- Verify PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` in `.env`
- Run migrations: `npx prisma migrate dev`

### Preview not showing
- Verify rebuild exists in database
- Check `BricksPageStructure` has `elements` JSON
- Inspect browser console for errors

### Scraper timing out
- Increase timeout in `ScraperService`
- Check if target website blocks headless browsers
- Try with `headless: false` for debugging

## 🤝 Contributing

This is an MVP project. Follow these principles:

1. **MAINTAIN COMPLEXITY** - Preserve sophisticated architecture
2. **REUSE EXISTING CODE** - Check headers before creating new functions
3. **COMPREHENSIVE TESTING** - Every function needs tests
4. **USE NAMED CONSTANTS** - No magic strings/numbers
5. **DDD PATTERNS** - Follow aggregate/entity/value object structure
6. **ASYNC/AWAIT PATTERNS** - Use generators for streaming
7. **REPOSITORY PATTERN** - All database access through repositories
8. **USE CASE ORCHESTRATION** - Business logic in use cases, not controllers

## 📝 License

Proprietary - All Rights Reserved

## 🙋 Support

For issues and questions:
- Open a GitHub issue
- Email: support@aiwebsiterebuilder.com
