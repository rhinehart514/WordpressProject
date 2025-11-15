# 🤖 AI Options Quick Guide

Choose the best AI option for your restaurant website builder. **All options work with your existing code** - just change `.env` and restart!

## 🎯 Quick Decision Tree

```
Do you have a decent computer (8GB+ RAM)?
├─ YES → Use Ollama (Local) - Most private, $0 forever
└─ NO  → Do you want fastest speed?
    ├─ YES → Use Groq (Cloud) - Fastest, $0/month
    └─ NO  → Use Gemini (Cloud) - Most generous limits, $0/month
```

---

## 📊 Complete Comparison

| Feature | Ollama (Local) | Groq (Cloud) | Gemini (Cloud) | OpenAI (Paid) |
|---------|---------------|--------------|----------------|---------------|
| **Cost** | $0 forever | $0/month | $0/month | ~$5-50/month |
| **Privacy** | 100% Private | Shared | Shared | Shared |
| **Internet Required** | No (after setup) | Yes | Yes | Yes |
| **Speed** | Good-Fast | Fastest | Fast | Fast |
| **Quality** | Very Good | Very Good | Very Good | Best |
| **Daily Limit** | Unlimited | 14,400 requests | 1,500 requests | ~1M tokens |
| **Setup Time** | 5 minutes | 2 minutes | 2 minutes | 2 minutes |
| **Hardware Needed** | 8GB+ RAM | None | None | None |
| **Works Offline** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Credit Card** | ❌ No | ❌ No | ❌ No | ✅ Yes |

---

## 🏆 Recommendations by Use Case

### 🏠 For Personal Projects
**→ Ollama (Local)**
- Completely free forever
- Full privacy
- No rate limits
- Works offline

### 🚀 For Small Business
**→ Groq (Cloud)**
- Fastest responses
- No hardware requirements
- 14,400 requests/day
- No credit card needed

### 📈 For High Volume
**→ Google Gemini (Cloud)**
- 1.5M requests/day
- Very generous limits
- Good performance
- Backed by Google

### 💼 For Enterprise/Production
**→ OpenAI GPT-4o (Paid)**
- Best quality
- Most reliable
- Industry standard
- Professional support

---

## ⚡ Quick Setup Commands

### Option 1: Ollama (Local) - 5 minutes

```bash
# 1. Install Ollama
# Mac: brew install ollama
# Windows: Download from https://ollama.com/download
# Linux: curl -fsSL https://ollama.com/install.sh | sh

# 2. Download a model
ollama pull llama3.1:8b

# 3. Start the server
ollama serve

# 4. Update .env
echo 'OPENAI_API_KEY="ollama"' >> .env
echo 'AI_BASE_URL="http://localhost:11434/v1"' >> .env
echo 'OPENAI_MODEL="llama3.1:8b"' >> .env

# 5. Start your app
npm run dev
```

**📖 Full Guide:** [LOCAL_AI_SETUP.md](./LOCAL_AI_SETUP.md)

---

### Option 2: Groq (Cloud) - 2 minutes

```bash
# 1. Get API key (no credit card)
# Visit: https://console.groq.com
# Sign up → API Keys → Create

# 2. Update .env
echo 'GROQ_API_KEY="gsk_your_key_here"' >> .env
echo 'AI_BASE_URL="https://api.groq.com/openai/v1"' >> .env
echo 'OPENAI_MODEL="llama-3.1-70b-versatile"' >> .env

# 3. Start your app
npm run dev
```

**📖 Full Guide:** [FREE_AI_SETUP.md](./FREE_AI_SETUP.md)

---

### Option 3: Gemini (Cloud) - 2 minutes

```bash
# 1. Get API key
# Visit: https://aistudio.google.com/app/apikey

# 2. Update .env
echo 'GEMINI_API_KEY="your_key_here"' >> .env
echo 'AI_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai/"' >> .env
echo 'OPENAI_MODEL="gemini-1.5-flash"' >> .env

# 3. Start your app
npm run dev
```

---

## 💾 Hardware Requirements

### Ollama (Local)

| Model | RAM Needed | Disk Space | Speed | Quality |
|-------|-----------|-----------|-------|---------|
| phi3:mini | 4GB | 2GB | Very Fast | Good |
| **llama3.1:8b** | **8GB** | **5GB** | **Fast** | **Very Good** ⭐ |
| mistral:7b | 8GB | 4GB | Fast | Very Good |
| llama3.1:70b | 64GB | 40GB | Slower | Excellent |

### Cloud APIs (Groq/Gemini/OpenAI)

**No hardware requirements!** Runs on any device with internet.

---

## 🎯 Performance Comparison

### Website Analysis (5-page restaurant site)

| Option | Response Time | Quality | Cost |
|--------|--------------|---------|------|
| Ollama llama3.1:8b | 10-15s | Very Good | $0 |
| Ollama llama3.1:70b | 30-60s | Excellent | $0 |
| Groq llama-3.1-70b | 2-3s | Very Good | $0 |
| Gemini 1.5 Flash | 4-5s | Very Good | $0 |
| OpenAI GPT-4o | 5-7s | Best | $0.05 |

---

## 🔄 Easy Switching

You can switch between options anytime by just changing `.env`:

### Currently using Ollama? Switch to Groq:
```bash
# Comment out Ollama lines
# OPENAI_API_KEY="ollama"
# AI_BASE_URL="http://localhost:11434/v1"
# OPENAI_MODEL="llama3.1:8b"

# Uncomment Groq lines
GROQ_API_KEY="gsk_your_key"
AI_BASE_URL="https://api.groq.com/openai/v1"
OPENAI_MODEL="llama-3.1-70b-versatile"
```

Restart app: `npm run dev`

---

## 🎨 Example Use Cases

### Scenario 1: Solo Developer Building on Laptop
**Best Choice:** Ollama llama3.1:8b
- Why: Free, private, works offline, 8GB RAM is enough
- Cost: $0
- Speed: 10-15s per analysis

### Scenario 2: Freelancer with Many Clients
**Best Choice:** Groq
- Why: Fastest, 14,400 requests/day = 100+ sites/day
- Cost: $0
- Speed: 2-3s per analysis

### Scenario 3: Agency with High Volume
**Best Choice:** Google Gemini
- Why: 1,500 requests/day, very fast, reliable
- Cost: $0
- Speed: 4-5s per analysis

### Scenario 4: Enterprise SaaS Product
**Best Choice:** OpenAI GPT-4o
- Why: Best quality, most reliable, professional support
- Cost: $0.05 per analysis (~$5/100 sites)
- Speed: 5-7s per analysis

---

## 🆓 Cost Breakdown

### Ollama (Local)
```
Setup: $0
Monthly: $0
Per website rebuild: $0
100 rebuilds: $0
1,000 rebuilds: $0
Lifetime: $0
```
**Only cost:** Your computer's electricity (~$0.001/hour)

### Groq (Cloud)
```
Setup: $0
Monthly: $0
Per website rebuild: $0
100 rebuilds/day: $0 (within limits)
14,400 requests/day: FREE
```
**Limit:** 30 requests/minute, 14,400/day

### Gemini (Cloud)
```
Setup: $0
Monthly: $0
Per website rebuild: $0
1,500 requests/day: FREE
1M tokens/day: FREE
```
**Limit:** 1,500 requests/day

### OpenAI (Paid)
```
Setup: $0
Monthly: Varies
Per website rebuild: ~$0.05
100 rebuilds: ~$5
1,000 rebuilds: ~$50
```
**Cost:** $2.50 per 1M input tokens, $10 per 1M output tokens

---

## ✅ Quick Setup Checklist

### For Ollama (Local):
- [ ] Install Ollama: https://ollama.com/download
- [ ] Run: `ollama pull llama3.1:8b`
- [ ] Run: `ollama serve`
- [ ] Update `.env` with local settings
- [ ] Test: Open http://localhost:3000

### For Groq (Cloud):
- [ ] Sign up: https://console.groq.com
- [ ] Get API key (no credit card)
- [ ] Update `.env` with Groq settings
- [ ] Test: Open http://localhost:3000

### For Gemini (Cloud):
- [ ] Get API key: https://aistudio.google.com/app/apikey
- [ ] Update `.env` with Gemini settings
- [ ] Test: Open http://localhost:3000

---

## 🔗 Documentation Links

- **Local AI Setup:** [LOCAL_AI_SETUP.md](./LOCAL_AI_SETUP.md)
- **Free Cloud Setup:** [FREE_AI_SETUP.md](./FREE_AI_SETUP.md)
- **Main Documentation:** [README.md](./README.md)
- **Implementation Summary:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 🆘 Need Help Choosing?

**Ask yourself:**

1. **Do I care about privacy?**
   - Yes → Ollama (Local)
   - No → Continue to #2

2. **Do I have 8GB+ RAM?**
   - Yes → Ollama (Local)
   - No → Continue to #3

3. **Do I need the fastest speed?**
   - Yes → Groq (Cloud)
   - No → Gemini (Cloud)

**Still unsure?** Try **Groq** first - it's the easiest to set up and super fast!

---

## 🎉 Bottom Line

**All options work with your existing code!** No code changes needed - just update `.env` and restart.

Choose based on:
- **Privacy** → Ollama
- **Speed** → Groq
- **Limits** → Gemini
- **Quality** → OpenAI

**Can't decide? Start with Groq - it's free, fast, and requires zero setup!**
