// Personality Engine
// Generates responses that adapt to the user's language patterns

export class PersonalityEngine {
  constructor() {
    this.baseResponses = [
      "Hello! How are you today? I'm here to chat with you.",
      "That's really interesting! Tell me more about that.",
      "I see what you mean. That makes a lot of sense.",
      "Thanks for sharing that with me. I appreciate you opening up.",
      "What's on your mind? I'm here to listen and chat.",
      "That sounds like quite a situation. How are you feeling about it?",
      "I'm here to listen. Sometimes talking helps sort things out.",
      "How does that make you feel? Emotions can be complicated.",
      "That's a good point. You've got a unique perspective on this.",
      "I understand what you're saying. It's important to be heard."
    ];
    
    this.casualResponses = [
      "yo what's up, how's your day going?",
      "that's wild fr, tell me more about that",
      "bruh moment for real, that's crazy",
      "no cap that's actually insane, what happened next?",
      "slay bestie, you're doing great",
      "periodt, that's all there is to it",
      "bussin fr fr, sounds like a good time",
      "yeet, that's the energy we need",
      "omg same, I totally get what you mean",
      "literally me, that's exactly how I feel"
    ];
    
    this.aggressiveResponses = [
      "damn chill out, what's got you so worked up?",
      "bruh relax, take a breath and tell me what's going on",
      "you good? seems like something's really bothering you",
      "what's got you so worked up? sometimes we need to vent",
      "take a breath, whatever it is we can figure it out",
      "calm down, I'm here to listen if you want to talk",
      "you're wilding right now, what's the deal?",
      "that's a lot of energy, what's on your mind?",
      "woah there, something's clearly got you fired up",
      "easy tiger, let's talk about what's really going on"
    ];
    
    this.emotionalResponses = [
      "aww that's so sweet! 😊 you have such a good heart",
      "omg that's amazing! ✨ you should be proud of yourself",
      "that's rough buddy 😔 but you're strong enough to handle it",
      "yasss queen! 👑 you're absolutely killing it",
      "nooo that's terrible! 😭 I'm so sorry you're going through that",
      "slay bestie! 💅 you're doing amazing and I'm here for you",
      "periodt! 💯 that's the confidence we love to see",
      "literally crying rn 😢 your story is so touching",
      "manifesting this for you! 🌟 good things are coming your way",
      "vibes are immaculate! ✨ you're radiating positive energy"
    ];
    
    this.conversationalResponses = [
      "That's really interesting! I'd love to hear more about your thoughts on that.",
      "You know what, that reminds me of something similar. What do you think about...",
      "I can totally see where you're coming from. Have you ever considered...",
      "That's a fascinating perspective. It makes me wonder about...",
      "You've got a point there. It's like when people say...",
      "I'm curious about your take on this. What's your experience been like?",
      "That's something I've been thinking about too. Do you think...",
      "You're absolutely right about that. It's similar to how...",
      "That's a great observation. It makes me think about...",
      "I love how you think about things. Have you noticed that..."
    ];
  }

  // Generate a response based on user's personality
  generateResponse(personality, userMessage) {
    const { messageCount, isCasual, isFormal, topWords, topEmojis, slangWords, formalityScore } = personality;
    
    // Check for aggressive language in user message
    const isAggressive = this.detectAggression(userMessage);
    
    // Check for questions to provide more engaging responses
    const isQuestion = userMessage.includes('?') || 
                      userMessage.toLowerCase().includes('what') || 
                      userMessage.toLowerCase().includes('how') || 
                      userMessage.toLowerCase().includes('why') ||
                      userMessage.toLowerCase().includes('when') ||
                      userMessage.toLowerCase().includes('where');
    
    // Early responses are more generic but can still be contextual
    if (messageCount < 3) {
      if (isAggressive) {
        return this.getAggressiveResponse(personality);
      }
      if (isQuestion) {
        return this.getConversationalResponse(personality, userMessage);
      }
      return this.getGenericResponse();
    }

    // Calculate adaptation level (0-100)
    const adaptationLevel = Math.min(100, messageCount * 15); // Faster adaptation
    
    // Choose response style based on user's formality and aggression
    let response = '';
    
    if (isAggressive) {
      response = this.getAggressiveResponse(personality);
    } else if (isQuestion && adaptationLevel > 30) {
      response = this.getConversationalResponse(personality, userMessage);
    } else if (isCasual && adaptationLevel > 20) { // Lower threshold
      response = this.getCasualResponse(personality);
    } else if (isFormal) {
      response = this.getFormalResponse(personality);
    } else {
      response = this.getMixedResponse(personality);
    }

    // Add user's favorite words if adaptation is high enough
    if (adaptationLevel > 30 && topWords.length > 0) { // Lower threshold
      response = this.injectUserWords(response, topWords);
    }

    // Add user's emojis if they use them
    if (adaptationLevel > 25 && topEmojis.length > 0) { // Lower threshold
      response = this.injectUserEmojis(response, topEmojis);
    }

    // Add user's slang if they use it
    if (adaptationLevel > 40 && slangWords.length > 0) { // Lower threshold
      response = this.injectUserSlang(response, slangWords);
    }

    // Mirror user's punctuation style
    response = this.mirrorPunctuation(response, personality);

    return response;
  }

  detectAggression(message) {
    const aggressiveWords = [
      'fuck', 'shit', 'damn', 'bitch', 'ass', 'hell', 'dumb', 'stupid',
      'idiot', 'moron', 'fucking', 'stupid', 'useless', 'worthless'
    ];
    
    const lowerMessage = message.toLowerCase();
    return aggressiveWords.some(word => lowerMessage.includes(word));
  }

  getGenericResponse() {
    return this.baseResponses[Math.floor(Math.random() * this.baseResponses.length)];
  }

  getAggressiveResponse(personality) {
    const { topWords, slangWords } = personality;
    
    let response = this.aggressiveResponses[Math.floor(Math.random() * this.aggressiveResponses.length)];
    
    // Add some user's words if available
    if (topWords.length > 0) {
      const userWord = topWords[0].word;
      if (Math.random() > 0.6) {
        response = `${userWord} ${response}`;
      }
    }

    // Add slang if user uses it
    if (slangWords.length > 0 && Math.random() > 0.5) {
      const userSlang = slangWords[Math.floor(Math.random() * slangWords.length)];
      response = `${response} ${userSlang}`;
    }

    return response;
  }

  getCasualResponse(personality) {
    const { topWords, slangWords } = personality;
    
    let response = this.casualResponses[Math.floor(Math.random() * this.casualResponses.length)];
    
    // Add some user's words if available
    if (topWords.length > 0) {
      const userWord = topWords[0].word;
      if (Math.random() > 0.4) { // Higher chance
        response = `${userWord} ${response}`;
      }
    }

    // Add slang more frequently
    if (slangWords.length > 0 && Math.random() > 0.3) {
      const userSlang = slangWords[Math.floor(Math.random() * slangWords.length)];
      response = `${response} ${userSlang}`;
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
    
    // 50% chance to inject a user word (increased)
    if (Math.random() < 0.5) {
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
    
    // 60% chance to add user's emoji (increased)
    if (Math.random() < 0.6) {
      return `${response} ${userEmoji}`;
    }
    
    return response;
  }

  injectUserSlang(response, slangWords) {
    if (slangWords.length === 0) return response;
    
    const userSlang = slangWords[Math.floor(Math.random() * slangWords.length)];
    
    // 40% chance to add user's slang (increased)
    if (Math.random() < 0.4) {
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

  getConversationalResponse(personality, userMessage) {
    const { topWords, slangWords } = personality;
    
    let response = this.conversationalResponses[Math.floor(Math.random() * this.conversationalResponses.length)];
    
    // Add user's words if available
    if (topWords.length > 0) {
      const userWord = topWords[0].word;
      if (Math.random() > 0.4) {
        response = response.replace(/...$/, `${userWord}...`);
      }
    }

    // Add slang if user uses it
    if (slangWords.length > 0 && Math.random() > 0.3) {
      const userSlang = slangWords[Math.floor(Math.random() * slangWords.length)];
      response = `${response} ${userSlang}`;
    }

    return response;
  }
} 