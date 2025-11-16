# 🔧 Environment Setup Guide

Complete guide for configuring environment variables for the AI Website Rebuilder.

## Table of Contents
- [Quick Start](#quick-start)
- [Database Configuration](#database-configuration)
- [Redis Configuration](#redis-configuration)
- [JWT Authentication](#jwt-authentication)
- [AI/LLM Configuration](#aillm-configuration)
- [WordPress Integration](#wordpress-integration)
- [Storage Configuration](#storage-configuration)
- [Development vs Production](#development-vs-production)

---

## Quick Start

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the required variables (marked with ⚠️ below)

3. For Docker Compose, no changes needed - defaults are configured

4. For local development, ensure PostgreSQL and Redis are running

---

## Database Configuration

### PostgreSQL Connection

**Required:** ⚠️

```bash
DATABASE_URL="postgresql://user:password@host:port/database?schema=public&connection_limit=20&pool_timeout=10"
```

**Components:**
- `user`: PostgreSQL username (default: `postgres`)
- `password`: PostgreSQL password (default: `postgres`)
- `host`: Database host (default: `localhost`)
- `port`: Database port (default: `5432`)
- `database`: Database name (default: `ai_website_rebuilder`)
- `schema`: Prisma schema (default: `public`)
- `connection_limit`: Connection pool size (default: `20`)
- `pool_timeout`: Pool timeout in seconds (default: `10`)

**Examples:**

Development:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_website_rebuilder?schema=public"
```

Docker Compose:
```bash
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/ai_website_rebuilder?schema=public&connection_limit=20&pool_timeout=10"
```

Production:
```bash
DATABASE_URL="postgresql://prod_user:strong_password@db.example.com:5432/ai_rebuilder_prod?schema=public&connection_limit=50&pool_timeout=20&sslmode=require"
```

---

## Redis Configuration

**Required:** ⚠️

Used for job queues (BullMQ) and caching.

```bash
REDIS_URL="redis://host:port"
REDIS_HOST="localhost"  # For BullMQ
REDIS_PORT="6379"       # For BullMQ
```

**Examples:**

Development:
```bash
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT="6379"
```

Docker Compose:
```bash
REDIS_URL="redis://redis:6379"
REDIS_HOST="redis"
REDIS_PORT="6379"
```

Production with auth:
```bash
REDIS_URL="redis://:password@redis.example.com:6379"
REDIS_HOST="redis.example.com"
REDIS_PORT="6379"
REDIS_PASSWORD="your-redis-password"
```

---

## JWT Authentication

**Required:** ⚠️

```bash
JWT_SECRET="your-jwt-secret-at-least-32-characters-long"
JWT_EXPIRATION="7d"
```

**Security Best Practices:**
- Use a strong, random secret (minimum 32 characters)
- Generate with: `openssl rand -base64 32`
- **NEVER** commit secrets to git
- Use different secrets for dev/staging/production

**Expiration Options:**
- `7d` - 7 days (default)
- `1h` - 1 hour
- `30m` - 30 minutes
- `60` - 60 seconds

---

## AI/LLM Configuration

Choose **ONE** of the following options:

### Option 1: Ollama (100% FREE, LOCAL, OFFLINE) ⭐ **RECOMMENDED**

```bash
OPENAI_API_KEY="ollama"
AI_BASE_URL="http://localhost:11434/v1"
OPENAI_MODEL="llama3.1:8b"
```

**Setup:**
1. Install Ollama: https://ollama.com/download
2. Pull model: `ollama pull llama3.1:8b`
3. Start server: `ollama serve`

**Recommended Models:**
- `llama3.1:8b` - Best balance of speed & quality (4.7GB)
- `phi3:mini` - Fastest, smallest (2GB)
- `mistral:7b` - Great for coding tasks (4.1GB)
- `llama3.1:70b` - Best quality, slower (40GB)

**Docker Compose:**
Ollama container is pre-configured in docker-compose.yml

### Option 2: Groq Cloud (100% FREE, FASTEST CLOUD)

```bash
GROQ_API_KEY="your-groq-api-key"
AI_BASE_URL="https://api.groq.com/openai/v1"
OPENAI_MODEL="llama-3.1-70b-versatile"
```

**Setup:**
1. Sign up at https://console.groq.com
2. Get API key (no credit card required)
3. 14,400 requests/day free tier

**Available Models:**
- `llama-3.1-70b-versatile` - Best quality
- `llama-3.1-8b-instant` - Fastest
- `mixtral-8x7b-32768` - Long context

### Option 3: Google Gemini (100% FREE - 1.5M requests/day)

```bash
GEMINI_API_KEY="your-gemini-api-key"
AI_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai/"
OPENAI_MODEL="gemini-1.5-flash"
```

**Setup:**
1. Get key at https://aistudio.google.com/app/apikey
2. 1,500,000 requests/day free tier

### Option 4: OpenRouter (FREE tier available)

```bash
OPENAI_API_KEY="your-openrouter-api-key"
AI_BASE_URL="https://openrouter.ai/api/v1"
OPENAI_MODEL="meta-llama/llama-3.1-70b-instruct:free"
```

### Option 5: OpenAI (PAID - costs money)

```bash
OPENAI_API_KEY="sk-your-openai-key"
AI_BASE_URL=""
OPENAI_MODEL="gpt-4o"
```

---

## WordPress Integration

**Optional** - Only needed when deploying to WordPress

```bash
WORDPRESS_DEFAULT_URL="https://your-wordpress-site.com"
WORDPRESS_API_KEY="your-application-password"
```

**Setup:**
1. Go to WordPress admin: `/wp-admin/profile.php`
2. Scroll to "Application Passwords"
3. Create new application password
4. Copy the generated password

---

## Storage Configuration

### AWS S3 (Optional)

For production file uploads and media storage:

```bash
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET="your-bucket-name"
AWS_REGION="us-east-1"
```

---

## API Configuration

```bash
API_PORT="3001"                           # API server port
ALLOWED_ORIGINS="http://localhost:3000"   # CORS allowed origins (comma-separated)
LOG_LEVEL="debug"                         # Logging level: error, warn, info, debug
NODE_ENV="development"                    # Environment: development, production, test
```

### CORS Configuration

**Development:**
```bash
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```

**Production:**
```bash
ALLOWED_ORIGINS="https://yourdomain.com,https://app.yourdomain.com"
```

---

## Next.js Frontend

```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Development vs Production

### Development (.env)

```bash
NODE_ENV="development"
LOG_LEVEL="debug"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_website_rebuilder"
JWT_SECRET="dev-jwt-secret-change-in-production"
OPENAI_API_KEY="ollama"
AI_BASE_URL="http://localhost:11434/v1"
```

### Production

```bash
NODE_ENV="production"
LOG_LEVEL="info"
DATABASE_URL="postgresql://user:strong_password@prod-db:5432/db?sslmode=require"
JWT_SECRET="$(openssl rand -base64 32)"
# Use proper API keys for production
```

---

## Environment Validation

The API validates all required environment variables on startup.

**Required Variables:**
- `DATABASE_URL`
- `JWT_SECRET` (minimum 32 characters)
- `OPENAI_API_KEY`

**Optional Variables:**
- All others have sensible defaults

---

## Security Checklist

- [ ] Use strong, random JWT_SECRET (minimum 32 chars)
- [ ] Never commit .env to git (.env is in .gitignore)
- [ ] Use different secrets for dev/staging/production
- [ ] Enable SSL for production database (sslmode=require)
- [ ] Use environment-specific CORS origins
- [ ] Rotate secrets regularly
- [ ] Use secret management in production (AWS Secrets Manager, Vault, etc.)

---

## Troubleshooting

### Database Connection Issues

1. Check PostgreSQL is running:
```bash
docker-compose ps postgres
```

2. Test connection:
```bash
psql $DATABASE_URL
```

3. Check logs:
```bash
docker-compose logs postgres
```

### Redis Connection Issues

1. Test Redis:
```bash
redis-cli ping
```

2. Check Redis in Docker:
```bash
docker-compose logs redis
```

### AI/LLM Issues

**Ollama not responding:**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

**API Key errors:**
- Verify API key is correct
- Check rate limits
- Ensure BASE_URL is correct for provider

---

## Support

For issues or questions:
- Check logs: `docker-compose logs api`
- Review API documentation: http://localhost:3001/api/docs
- Check health endpoint: http://localhost:3001/health
