// Language Analysis Utility
// Tracks user's speaking patterns and style characteristics

export class LanguageAnalyzer {
  constructor() {
    this.wordFrequency = {};
    this.sentenceLengths = [];
    this.punctuationPatterns = {};
    this.emojiUsage = {};
    this.slangWords = new Set();
    this.formalityScore = 0;
    this.messageCount = 0;
  }

  // Analyze a new message and update patterns
  analyzeMessage(message) {
    this.messageCount++;
    
    // Word frequency analysis
    const words = message.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
    
    words.forEach(word => {
      this.wordFrequency[word] = (this.wordFrequency[word] || 0) + 1;
    });

    // Sentence length analysis
    const sentences = message.split(/[.!?]+/).filter(s => s.trim().length > 0);
    sentences.forEach(sentence => {
      this.sentenceLengths.push(sentence.trim().split(/\s+/).length);
    });

    // Punctuation analysis
    const punctuation = message.match(/[.!?,;:]/g) || [];
    punctuation.forEach(p => {
      this.punctuationPatterns[p] = (this.punctuationPatterns[p] || 0) + 1;
    });

    // Emoji analysis
    const emojis = message.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || [];
    emojis.forEach(emoji => {
      this.emojiUsage[emoji] = (this.emojiUsage[emoji] || 0) + 1;
    });

    // Slang detection
    const slangPatterns = [
      'bro', 'bruh', 'fr', 'tbh', 'imo', 'btw', 'idk', 'lol', 'omg', 'wtf',
      'yeet', 'slay', 'periodt', 'no cap', 'bussin', 'finna', 'gonna', 'wanna',
      'fuck', 'shit', 'damn', 'bitch', 'ass', 'hell', 'dumb', 'stupid', 'idiot',
      'nigga', 'fucking', 'useless', 'worthless', 'piece', 'shit'
    ];
    
    slangPatterns.forEach(slang => {
      if (message.toLowerCase().includes(slang)) {
        this.slangWords.add(slang);
      }
    });

    // Formality score (0 = very casual, 100 = very formal)
    this.updateFormalityScore(message);
  }

  updateFormalityScore(message) {
    let score = 50; // Start neutral
    
    // Factors that make it more casual
    if (this.slangWords.size > 0) score -= 20;
    if (message.includes('!')) score -= 5;
    if (message.includes('😊') || message.includes('😎') || message.includes('💀')) score -= 10;
    if (message.includes("'") && message.includes("'")) score -= 5; // Contractions
    
    // Aggressive language detection
    const aggressiveWords = ['fuck', 'shit', 'damn', 'bitch', 'ass', 'hell', 'dumb', 'stupid', 'idiot', 'moron'];
    const hasAggressiveLanguage = aggressiveWords.some(word => message.toLowerCase().includes(word));
    if (hasAggressiveLanguage) score -= 30; // Very casual/aggressive
    
    // Factors that make it more formal
    if (message.includes('please') || message.includes('thank you')) score += 10;
    if (message.length > 100) score += 5;
    if (message.match(/[A-Z][a-z]+/g)?.length > 3) score += 5; // Proper nouns
    
    this.formalityScore = Math.max(0, Math.min(100, score));
  }

  // Get user's most common words
  getTopWords(count = 10) {
    return Object.entries(this.wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([word, freq]) => ({ word, frequency: freq }));
  }

  // Get average sentence length
  getAverageSentenceLength() {
    if (this.sentenceLengths.length === 0) return 0;
    return this.sentenceLengths.reduce((a, b) => a + b, 0) / this.sentenceLengths.length;
  }

  // Get most used punctuation
  getTopPunctuation() {
    return Object.entries(this.punctuationPatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([punct, freq]) => ({ punctuation: punct, frequency: freq }));
  }

  // Get most used emojis
  getTopEmojis() {
    return Object.entries(this.emojiUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([emoji, freq]) => ({ emoji, frequency: freq }));
  }

  // Get personality summary
  getPersonalitySummary() {
    return {
      messageCount: this.messageCount,
      topWords: this.getTopWords(5),
      averageSentenceLength: this.getAverageSentenceLength(),
      topPunctuation: this.getTopPunctuation(),
      topEmojis: this.getTopEmojis(),
      slangWords: Array.from(this.slangWords),
      formalityScore: this.formalityScore,
      isCasual: this.formalityScore < 40,
      isFormal: this.formalityScore > 60
    };
  }

  // Reset all data
  reset() {
    this.wordFrequency = {};
    this.sentenceLengths = [];
    this.punctuationPatterns = {};
    this.emojiUsage = {};
    this.slangWords = new Set();
    this.formalityScore = 0;
    this.messageCount = 0;
  }
} 