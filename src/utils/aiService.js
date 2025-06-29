// AI Service for integrating with free AI models
// Supports Ollama, Hugging Face, and other free AI providers

export class AIService {
  constructor() {
    this.provider = 'ollama'; // 'ollama', 'huggingface', 'local'
    this.model = 'llama2'; // 'llama2', 'mistral', 'codellama'
    this.baseUrl = 'http://localhost:11434'; // Ollama default URL
    this.conversationHistory = [];
    this.maxHistory = 10; // Keep last 10 messages for context
  }

  // Set AI provider and model
  setProvider(provider, model = null) {
    this.provider = provider;
    if (model) this.model = model;
    
    // Set appropriate base URL
    switch (provider) {
      case 'ollama':
        this.baseUrl = 'http://localhost:11434';
        break;
      case 'huggingface':
        this.baseUrl = 'https://api-inference.huggingface.co/models';
        break;
      default:
        this.baseUrl = 'http://localhost:11434';
    }
  }

  // Add message to conversation history
  addToHistory(role, content) {
    this.conversationHistory.push({ role, content });
    
    // Keep only recent messages
    if (this.conversationHistory.length > this.maxHistory * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistory * 2);
    }
  }

  // Generate AI response using Ollama
  async generateOllamaResponse(userMessage, personality) {
    try {
      const prompt = this.buildPrompt(userMessage, personality);
      
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 200
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || 'Sorry, I couldn\'t generate a response.';
    } catch (error) {
      console.error('Ollama API error:', error);
      return this.getFallbackResponse(personality, userMessage);
    }
  }

  // Generate AI response using Hugging Face
  async generateHuggingFaceResponse(userMessage, personality) {
    try {
      const prompt = this.buildPrompt(userMessage, personality);
      
      const response = await fetch(`${this.baseUrl}/${this.model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_HUGGINGFACE_TOKEN || ''}`
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.9
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      return data[0]?.generated_text || 'Sorry, I couldn\'t generate a response.';
    } catch (error) {
      console.error('Hugging Face API error:', error);
      return this.getFallbackResponse(personality, userMessage);
    }
  }

  // Build context-aware prompt
  buildPrompt(userMessage, personality) {
    const { topWords, slangWords, formalityScore, messageCount } = personality;
    
    // Create personality context
    let personalityContext = '';
    if (messageCount > 5) {
      personalityContext = `You are an AI that has learned to speak like the user. `;
      
      if (topWords.length > 0) {
        personalityContext += `The user frequently uses words like: ${topWords.slice(0, 3).map(w => w.word).join(', ')}. `;
      }
      
      if (slangWords.length > 0) {
        personalityContext += `The user uses slang like: ${Array.from(slangWords).slice(0, 3).join(', ')}. `;
      }
      
      if (formalityScore < 40) {
        personalityContext += `The user speaks very casually and informally. `;
      } else if (formalityScore > 70) {
        personalityContext += `The user speaks formally and professionally. `;
      }
      
      personalityContext += `Mirror their speaking style, vocabulary, and tone. `;
    }

    // Build conversation history
    const history = this.conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Create the full prompt
    const prompt = `${personalityContext}

Conversation History:
${history}

User: ${userMessage}
Assistant:`;

    return prompt;
  }

  // Fallback response when AI is unavailable
  getFallbackResponse(personality, userMessage) {
    // Use the existing personality engine as fallback
    const { PersonalityEngine } = require('./personalityEngine');
    const engine = new PersonalityEngine();
    return engine.generateResponse(personality, userMessage);
  }

  // Main method to generate AI response
  async generateResponse(userMessage, personality) {
    // Add user message to history
    this.addToHistory('user', userMessage);

    let response = '';
    
    try {
      switch (this.provider) {
        case 'ollama':
          response = await this.generateOllamaResponse(userMessage, personality);
          break;
        case 'huggingface':
          response = await this.generateHuggingFaceResponse(userMessage, personality);
          break;
        default:
          response = this.getFallbackResponse(personality, userMessage);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      response = this.getFallbackResponse(personality, userMessage);
    }

    // Add AI response to history
    this.addToHistory('assistant', response);
    
    return response;
  }

  // Check if Ollama is available
  async checkOllamaStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Get available models from Ollama
  async getAvailableModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        return data.models || [];
      }
      return [];
    } catch (error) {
      return [];
    }
  }
} 