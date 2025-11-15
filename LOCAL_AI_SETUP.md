# Run AI Models Locally - 100% FREE Forever

This guide shows you how to run powerful AI models **on your own computer** - no internet required after setup, no API keys, completely FREE.

## 🎯 Why Run Locally?

| Feature | Local (Ollama) | Cloud APIs |
|---------|---------------|------------|
| **Cost** | $0 forever | $0-50/month |
| **Privacy** | 100% private | Data sent to servers |
| **Internet** | Not needed | Always required |
| **Speed** | Fast (on your hardware) | Depends on connection |
| **Rate Limits** | None | Yes (varies) |
| **Control** | Complete | Limited |

## 🚀 Quick Start with Ollama (5 Minutes)

### Step 1: Install Ollama

**Mac:**
```bash
# Download and install from website
# Visit: https://ollama.com/download
# Or use Homebrew:
brew install ollama
```

**Windows:**
1. Visit: https://ollama.com/download
2. Download the Windows installer
3. Run the installer (one-click setup)

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Download a Model

Open Terminal/Command Prompt and run:

```bash
# Recommended: Llama 3.1 8B (fast, smart, ~5GB)
ollama pull llama3.1:8b

# Alternative: Smaller model (lighter, ~2GB)
ollama pull phi3:mini

# Alternative: Larger model (smarter, ~40GB - needs good GPU)
ollama pull llama3.1:70b
```

**First download will take 5-15 minutes depending on your internet speed.**

### Step 3: Test It Works

```bash
# Start a chat
ollama run llama3.1:8b

# Ask it something
>>> Hello, can you help me analyze a restaurant website?
```

Press `Ctrl+D` or type `/bye` to exit.

### Step 4: Start Ollama Server

```bash
# Start the API server (runs in background)
ollama serve
```

**Important**: Keep this terminal window open, or run it as a background service.

### Step 5: Update Your `.env` File

```env
# Local Ollama (100% FREE, runs on your computer)
OPENAI_API_KEY="ollama"  # Can be any value
AI_BASE_URL="http://localhost:11434/v1"
OPENAI_MODEL="llama3.1:8b"
```

### Step 6: Start Your App

```bash
npm run dev
```

**That's it!** Your chat interface now uses your local AI model. 🎉

---

## 📊 Recommended Models by Hardware

### If You Have: Basic Laptop (8GB RAM)
```bash
ollama pull phi3:mini        # 2GB - Fast, good for chat
ollama pull gemma2:2b        # 2GB - Google's efficient model
```

**Config:**
```env
OPENAI_MODEL="phi3:mini"
```

### If You Have: Good Laptop (16GB RAM)
```bash
ollama pull llama3.1:8b      # 5GB - Best balance ⭐
ollama pull mistral:7b       # 4GB - Great for analysis
```

**Config:**
```env
OPENAI_MODEL="llama3.1:8b"
```

### If You Have: Gaming PC / Workstation (32GB+ RAM, GPU)
```bash
ollama pull llama3.1:70b     # 40GB - Most powerful
ollama pull qwen2.5:72b      # 41GB - Excellent reasoning
```

**Config:**
```env
OPENAI_MODEL="llama3.1:70b"
```

---

## 🎮 Model Comparison

| Model | Size | RAM Needed | Speed | Intelligence | Best For |
|-------|------|-----------|-------|--------------|----------|
| **llama3.1:8b** | 5GB | 8GB | Fast | Very Good | **Recommended** ⭐ |
| phi3:mini | 2GB | 4GB | Very Fast | Good | Budget laptops |
| mistral:7b | 4GB | 8GB | Fast | Very Good | Alternative choice |
| llama3.1:70b | 40GB | 64GB | Slower | Excellent | High-end hardware |
| gemma2:9b | 5GB | 8GB | Fast | Very Good | Google's model |
| qwen2.5:7b | 4GB | 8GB | Fast | Very Good | Alibaba's model |

---

## ⚙️ Integration with Your App

**Good news**: Your existing code already works with Ollama! No changes needed.

Ollama provides an **OpenAI-compatible API** at `http://localhost:11434/v1`, so your current OpenAI SDK code works perfectly.

### Testing the API

```bash
# Test with curl
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:8b",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## 🔧 Advanced Configuration

### Run Ollama as Background Service

**Mac/Linux:**
```bash
# Start on login (automatic)
ollama serve &
```

**Windows:**
Ollama runs as a Windows service automatically after installation.

### Check Available Models

```bash
# List downloaded models
ollama list

# Delete a model to save space
ollama rm llama3.1:70b
```

### GPU Acceleration

Ollama automatically uses your GPU if available:
- **NVIDIA**: CUDA support (automatic)
- **AMD**: ROCm support (automatic)
- **Mac**: Metal support (automatic)
- **CPU only**: Still works, just slower

### Memory Management

```bash
# Set memory limit (example: 8GB)
OLLAMA_MAX_LOADED_MODELS=1 ollama serve
```

---

## 💡 Tips for Best Performance

### 1. Choose Right Model Size
- **4GB RAM**: phi3:mini
- **8GB RAM**: llama3.1:8b
- **16GB RAM**: llama3.1:8b or mistral:7b
- **32GB+ RAM**: llama3.1:70b

### 2. Use GPU if Available
Ollama will automatically use your GPU. Check with:
```bash
ollama ps  # Shows running models and GPU usage
```

### 3. Keep Model Loaded
First request is slower (loads model). Subsequent requests are fast.

### 4. Adjust Context Window
```env
# In your app, set max_tokens lower for faster responses
max_completion_tokens: 1000  # Instead of 4000
```

---

## 🆚 Ollama vs Cloud APIs

### Ollama Advantages:
✅ **100% FREE** - No usage costs ever
✅ **Complete Privacy** - Data never leaves your computer
✅ **No Rate Limits** - Use as much as you want
✅ **Works Offline** - No internet needed
✅ **Full Control** - Choose any model

### Ollama Disadvantages:
❌ Requires decent hardware (8GB+ RAM recommended)
❌ Initial download (5-40GB per model)
❌ Slightly slower than cloud APIs
❌ Models slightly less capable than GPT-4

### When to Use Ollama:
- ✅ You have a decent computer (8GB+ RAM)
- ✅ You care about privacy
- ✅ You want zero costs
- ✅ You need offline capability
- ✅ You're building/testing frequently

### When to Use Cloud APIs (Groq):
- ❌ You have a weak computer (<8GB RAM)
- ❌ You need absolute best quality (GPT-4 level)
- ❌ You don't want to manage anything
- ❌ You rarely use it (cloud free tiers sufficient)

---

## 🐛 Troubleshooting

### "Model not found"
```bash
# Download the model first
ollama pull llama3.1:8b
```

### "Connection refused"
```bash
# Make sure Ollama is running
ollama serve
```

### "Out of memory"
Choose a smaller model:
```bash
ollama pull phi3:mini  # Only 2GB
```

### "Slow responses"
- Use smaller model (phi3:mini instead of llama3.1:70b)
- Close other applications
- Check GPU is being used: `ollama ps`

### "Model stops responding"
```bash
# Restart Ollama
killall ollama
ollama serve
```

---

## 📈 Performance Expectations

### Website Analysis (5-page restaurant site)

| Model | Time | Quality | RAM Used |
|-------|------|---------|----------|
| phi3:mini | 15-20s | Good | 3GB |
| llama3.1:8b | 10-15s | Very Good | 6GB |
| mistral:7b | 10-15s | Very Good | 5GB |
| llama3.1:70b | 30-60s | Excellent | 48GB |

**For comparison:**
- Groq (cloud): 2-3s
- OpenAI GPT-4o: 5-7s

---

## 🔄 Switching Between Options

You can easily switch between local and cloud:

### Use Local Ollama (Free, Private)
```env
AI_BASE_URL="http://localhost:11434/v1"
OPENAI_MODEL="llama3.1:8b"
```

### Use Cloud Groq (Free, Fast)
```env
GROQ_API_KEY="gsk_your_key"
AI_BASE_URL="https://api.groq.com/openai/v1"
OPENAI_MODEL="llama-3.1-70b-versatile"
```

### Use OpenAI (Paid, Best Quality)
```env
OPENAI_API_KEY="sk_your_key"
AI_BASE_URL=""
OPENAI_MODEL="gpt-4o"
```

Just change your `.env` file and restart!

---

## 🎯 Recommended Setup

### For Development:
**Ollama with llama3.1:8b** - Free, fast, private

### For Production:
**Groq** - Free, fastest, no hardware requirements

### For Best Quality:
**OpenAI GPT-4o** - Paid, best results

---

## 📚 More Resources

- **Ollama Website**: https://ollama.com
- **Model Library**: https://ollama.com/library
- **GitHub**: https://github.com/ollama/ollama
- **Discord Community**: https://discord.gg/ollama

---

## 🎉 You're Ready!

You now have THREE completely free options:

1. **Ollama (Local)** - Run on your computer ⭐ Most private
2. **Groq (Cloud)** - Use free cloud API ⚡ Fastest
3. **Gemini (Cloud)** - Google's free tier 🌐 Most generous limits

All work with your existing code! Just change `.env` and restart.

**Build unlimited restaurant websites, completely FREE! 🚀**

---

## 🔗 Quick Links

- [Main Documentation](./README.md)
- [Free Cloud Setup](./FREE_AI_SETUP.md)
- [Ollama Download](https://ollama.com/download)
