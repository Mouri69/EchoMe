# 🤖 AI Integration Setup Guide

## 🚀 Quick Start Options

### Option 1: Ollama (Recommended - Completely Free)
**Best for: Local AI, privacy, no internet required**

1. **Install Ollama**
   - Go to [ollama.ai](https://ollama.ai)
   - Download and install for your OS
   - Start the Ollama service

2. **Download a Model**
   ```bash
   # Choose one of these models:
   ollama pull llama2        # Good balance of speed/quality
   ollama pull mistral       # Fast and good quality
   ollama pull codellama     # Good for technical conversations
   ```

3. **Test in Echo Me**
   - Click the 🤖 button in the app
   - Select "Ollama (Local)" as provider
   - Choose your downloaded model
   - Click refresh to test connection

### Option 2: Hugging Face (Free API)
**Best for: No local setup, internet required**

1. **Get Free API Token**
   - Go to [huggingface.co](https://huggingface.co)
   - Create free account
   - Go to Settings → Access Tokens
   - Create new token

2. **Add Token to App**
   - Create `.env` file in project root
   - Add: `REACT_APP_HUGGINGFACE_TOKEN=your_token_here`
   - Restart the app

3. **Test in Echo Me**
   - Click the 🤖 button
   - Select "Hugging Face" as provider
   - Choose a model (DialoGPT recommended)

### Option 3: Fallback (No Setup)
**Best for: Quick testing, no AI required**
- Uses the built-in personality engine
- No setup required
- Works offline

## 🎯 Model Recommendations

### For Casual Conversations:
- **Ollama**: `mistral` or `llama2`
- **Hugging Face**: `microsoft/DialoGPT-medium`

### For Technical Discussions:
- **Ollama**: `codellama`
- **Hugging Face**: `EleutherAI/gpt-neo-1.3B`

### For Creative Writing:
- **Ollama**: `llama2-uncensored`
- **Hugging Face**: `microsoft/DialoGPT-large`

## 🔧 Troubleshooting

### Ollama Issues:
- **"Connection refused"**: Make sure Ollama is running
- **"Model not found"**: Run `ollama pull model_name`
- **Slow responses**: Try smaller models like `mistral`

### Hugging Face Issues:
- **"Unauthorized"**: Check your API token
- **"Rate limited"**: Free tier has limits, wait a bit
- **"Model loading"**: Some models take time to load

### General Issues:
- **Fallback mode**: If AI fails, it uses personality engine
- **Check console**: Look for error messages in browser dev tools

## 💡 Tips for Best Results

1. **Start with basic mode** to train the personality
2. **Switch to AI** after 5+ messages for better responses
3. **Use consistent language** to help the AI learn your style
4. **Export your personality** to save your trained bot
5. **Try different models** to find what works best for you

## 🎮 Advanced Features

- **Conversation Memory**: AI remembers previous messages
- **Personality Context**: AI learns your speaking style
- **Fallback System**: Always works even if AI is down
- **Export/Import**: Save and share your trained personalities

---

**Ready to start?** Click the 🤖 button in the app and follow the setup instructions! 