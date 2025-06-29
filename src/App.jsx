import React, { useState, useEffect } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';
import InputBox from './components/InputBox';
import ProgressBar from './components/ProgressBar';
import WordCloud from './components/WordCloud';
import { LanguageAnalyzer } from './utils/languageAnalysis';
import { PersonalityEngine } from './utils/personalityEngine';

function App() {
  const [messages, setMessages] = useState([]);
  const [analyzer, setAnalyzer] = useState(new LanguageAnalyzer());
  const [personalityEngine] = useState(new PersonalityEngine());
  const [isNightMode, setIsNightMode] = useState(false);
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [showWordCloud, setShowWordCloud] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('echoMeMessages');
    const savedAnalyzerData = localStorage.getItem('echoMeAnalyzer');
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    
    if (savedAnalyzerData) {
      const newAnalyzer = new LanguageAnalyzer();
      Object.assign(newAnalyzer, JSON.parse(savedAnalyzerData));
      setAnalyzer(newAnalyzer);
    }

    // Check if it's night time (8 PM to 6 AM)
    const hour = new Date().getHours();
    setIsNightMode(hour >= 20 || hour < 6);
  }, []);

  // Save messages and analyzer data to localStorage
  useEffect(() => {
    localStorage.setItem('echoMeMessages', JSON.stringify(messages));
    localStorage.setItem('echoMeAnalyzer', JSON.stringify(analyzer));
  }, [messages, analyzer]);

  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);

    // Analyze the message
    const newAnalyzer = new LanguageAnalyzer();
    Object.assign(newAnalyzer, analyzer);
    newAnalyzer.analyzeMessage(message);
    setAnalyzer(newAnalyzer);

    // Generate response
    setTimeout(() => {
      const personality = newAnalyzer.getPersonalitySummary();
      let response;
      
      // Check for aggressive language first
      const aggressiveWords = ['fuck', 'shit', 'damn', 'bitch', 'ass', 'hell', 'dumb', 'stupid', 'idiot', 'moron'];
      const isAggressive = aggressiveWords.some(word => message.toLowerCase().includes(word));
      
      if (isRoastMode) {
        response = personalityEngine.generateRoastResponse(personality);
      } else if (isAggressive) {
        // Prioritize aggressive response over night mode
        response = personalityEngine.generateResponse(personality, message);
      } else if (isNightMode && personality.messageCount < 5) {
        // Only use night mode for early messages when not aggressive
        response = personalityEngine.generateNightResponse(personality);
      } else {
        // Use adaptive personality response
        response = personalityEngine.generateResponse(personality, message);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 500 + Math.random() * 1000); // Random delay to feel more natural
  };

  const resetPersonality = () => {
    setMessages([]);
    setAnalyzer(new LanguageAnalyzer());
    localStorage.removeItem('echoMeMessages');
    localStorage.removeItem('echoMeAnalyzer');
  };

  const personality = analyzer.getPersonalitySummary();
  const adaptationLevel = Math.min(100, personality.messageCount * 15); // Faster adaptation

  return (
    <div className={`app ${isNightMode ? 'night-mode' : ''}`}>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-icon">🧬</span>
              Echo Me
            </h1>
            <p className="app-subtitle">The more you talk, the more I learn your vibe</p>
          </div>
          
          <div className="header-controls">
            <button 
              className={`mode-toggle ${isNightMode ? 'active' : ''}`}
              onClick={() => setIsNightMode(!isNightMode)}
              title="Toggle Night Mode"
            >
              {isNightMode ? '🌙' : '☀️'}
            </button>
            
            <button 
              className={`mode-toggle ${isRoastMode ? 'active' : ''}`}
              onClick={() => setIsRoastMode(!isRoastMode)}
              title="Toggle Roast Mode"
            >
              {isRoastMode ? '🔥' : '😊'}
            </button>
            
            <button 
              className="word-cloud-toggle"
              onClick={() => setShowWordCloud(!showWordCloud)}
              title="Show Word Cloud"
            >
              ☁️
            </button>
            
            <button 
              className="reset-button"
              onClick={resetPersonality}
              title="Reset Personality"
            >
              🔄
            </button>
          </div>
        </header>

        <div className="main-content">
          <div className="chat-section">
            <ProgressBar 
              adaptationLevel={adaptationLevel}
              messageCount={personality.messageCount}
              formalityScore={personality.formalityScore}
            />
            
            <ChatWindow 
              messages={messages}
              isNightMode={isNightMode}
            />
            
            <InputBox 
              onSendMessage={handleSendMessage}
              isNightMode={isNightMode}
            />
          </div>

          {showWordCloud && (
            <div className="word-cloud-section">
              <WordCloud 
                topWords={personality.topWords}
                topEmojis={personality.topEmojis}
                slangWords={personality.slangWords}
              />
            </div>
          )}
        </div>

        <footer className="app-footer">
          <div className="personality-stats">
            <span className="stat">
              Messages: {personality.messageCount}
            </span>
            <span className="stat">
              Style: {personality.isCasual ? 'Casual' : personality.isFormal ? 'Formal' : 'Mixed'}
            </span>
            <span className="stat">
              Avg Length: {personality.averageSentenceLength.toFixed(1)} words
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App; 