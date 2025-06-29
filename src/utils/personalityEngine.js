// Personality Engine
// Generates responses that adapt to the user's language patterns

export class PersonalityEngine {
  constructor() {
    this.baseResponses = [
      "Hello! How are you today?",
      "That's interesting. Tell me more.",
      "I see what you mean.",
      "Thanks for sharing that with me.",
      "What's on your mind?",
      "That sounds like quite a situation.",
      "I'm here to listen.",
      "How does that make you feel?",
      "That's a good point.",
      "I understand what you're saying."
    ];
    
    this.casualResponses = [
      "yo what's up",
      "that's wild fr",
      "bruh moment",
      "no cap that's crazy",
      "slay",
      "periodt",
      "bussin fr fr",
      "yeet",
      "omg same",
      "literally me"
    ];
    
    this.emotionalResponses = [
      "aww that's so sweet! 😊",
      "omg that's amazing! ✨",
      "that's rough buddy 😔",
      "yasss queen! 👑",
      "nooo that's terrible! 😭",
      "slay bestie! 💅",
      "periodt! 💯",
      "literally crying rn 😢",
      "manifesting this for you! 🌟",
      "vibes are immaculate! ✨"
    ];
  }

  // Generate a response based on user's personality
  generateResponse(personality, userMessage) {
    const { messageCount, isCasual, isFormal, topWords, topEmojis, slangWords, formalityScore } = personality;
    
    // Early responses are more generic
    if (messageCount < 3) {
      return this.getGenericResponse();
    }

    // Calculate adaptation level (0-100)
    const adaptationLevel = Math.min(100, messageCount * 10);
    
    // Choose response style based on user's formality
    let response = '';
    
    if (isCasual && adaptationLevel > 30) {
      response = this.getCasualResponse(personality);
    } else if (isFormal) {
      response = this.getFormalResponse(personality);
    } else {
      response = this.getMixedResponse(personality);
    }

    // Add user's favorite words if adaptation is high enough
    if (adaptationLevel > 50 && topWords.length > 0) {
      response = this.injectUserWords(response, topWords);
    }

    // Add user's emojis if they use them
    if (adaptationLevel > 40 && topEmojis.length > 0) {
      response = this.injectUserEmojis(response, topEmojis);
    }

    // Add user's slang if they use it
    if (adaptationLevel > 60 && slangWords.length > 0) {
      response = this.injectUserSlang(response, slangWords);
    }

    // Mirror user's punctuation style
    response = this.mirrorPunctuation(response, personality);

    return response;
  }

  getGenericResponse() {
    return this.baseResponses[Math.floor(Math.random() * this.baseResponses.length)];
  }

  getCasualResponse(personality) {
    const { topWords, slangWords } = personality;
    
    let response = this.casualResponses[Math.floor(Math.random() * this.casualResponses.length)];
    
    // Add some user's words if available
    if (topWords.length > 0) {
      const userWord = topWords[0].word;
      if (Math.random() > 0.5) {
        response = `${userWord} ${response}`;
      }
    }

    return response;
  }

  getFormalResponse(personality) {
    const { topWords } = personality;
    
    let response = this.baseResponses[Math.floor(Math.random() * this.baseResponses.length)];
    
    // Make it more formal
    response = response.replace(/!/g, '.');
    response = response.replace(/\.\.\./g, '.');
    
    return response;
  }

  getMixedResponse(personality) {
    const responses = [...this.baseResponses, ...this.casualResponses];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  injectUserWords(response, topWords) {
    if (topWords.length === 0) return response;
    
    const userWord = topWords[Math.floor(Math.random() * Math.min(3, topWords.length))].word;
    
    // 30% chance to inject a user word
    if (Math.random() < 0.3) {
      const words = response.split(' ');
      const insertIndex = Math.floor(Math.random() * words.length);
      words.splice(insertIndex, 0, userWord);
      return words.join(' ');
    }
    
    return response;
  }

  injectUserEmojis(response, topEmojis) {
    if (topEmojis.length === 0) return response;
    
    const userEmoji = topEmojis[Math.floor(Math.random() * topEmojis.length)].emoji;
    
    // 40% chance to add user's emoji
    if (Math.random() < 0.4) {
      return `${response} ${userEmoji}`;
    }
    
    return response;
  }

  injectUserSlang(response, slangWords) {
    if (slangWords.length === 0) return response;
    
    const userSlang = slangWords[Math.floor(Math.random() * slangWords.length)];
    
    // 25% chance to add user's slang
    if (Math.random() < 0.25) {
      return `${response} ${userSlang}`;
    }
    
    return response;
  }

  mirrorPunctuation(response, personality) {
    const { topPunctuation } = personality;
    
    if (topPunctuation.length === 0) return response;
    
    const userPunct = topPunctuation[0].punctuation;
    
    // Mirror user's most common punctuation
    if (userPunct === '!' && !response.includes('!')) {
      response = response.replace(/\.$/, '!');
    } else if (userPunct === '...' && !response.includes('...')) {
      response = response.replace(/\.$/, '...');
    }
    
    return response;
  }

  // Generate a "roast" response (chaotic mode)
  generateRoastResponse(personality) {
    const roasts = [
      "bruh you really said that with your whole chest 💀",
      "the audacity is astronomical rn",
      "i can't with you sometimes fr",
      "you're really living in your own world huh",
      "the way you think you're making sense...",
      "i'm wheezing at this point",
      "you're something else entirely",
      "the confidence is unmatched",
      "i'm literally speechless",
      "you really thought you did something there"
    ];
    
    let roast = roasts[Math.floor(Math.random() * roasts.length)];
    
    // Add user's emojis to the roast
    if (personality.topEmojis.length > 0) {
      const userEmoji = personality.topEmojis[0].emoji;
      roast = `${roast} ${userEmoji}`;
    }
    
    return roast;
  }

  // Generate a night mode response (calmer)
  generateNightResponse(personality) {
    const nightResponses = [
      "that's peaceful...",
      "quiet thoughts for a quiet night",
      "rest well, friend",
      "the night brings clarity",
      "gentle vibes only",
      "soft energy tonight",
      "peaceful moments",
      "calm waters",
      "serene thoughts",
      "gentle night"
    ];
    
    return nightResponses[Math.floor(Math.random() * nightResponses.length)];
  }
} 