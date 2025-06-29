import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';
import InputBox from './components/InputBox';
import ProgressBar from './components/ProgressBar';
import WordCloud from './components/WordCloud';
import AISettings from './components/AISettings';
import { analyzeLanguage } from './utils/languageAnalysis';
import { PersonalityEngine } from './utils/personalityEngine';
import { AIService } from './utils/aiService';
import './test-env.js'; // Temporary test import

function App() {
  const [messages, setMessages] = useState([]);
  const [analyzer, setAnalyzer] = useState(new LanguageAnalyzer());
  const [personalityEngine] = useState(new PersonalityEngine());
  const [aiService] = useState(new AIService());
  const [isNightMode, setIsNightMode] = useState(false);
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [showWordCloud, setShowWordCloud] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [aiStatus, setAiStatus] = useState('checking');

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('echoMeMessages');
    const savedAnalyzerData = localStorage.getItem('echoMeAnalyzer');
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    
    if (savedAnalyzerData) {
      const newAnalyzer = new LanguageAnalyzer();
      const parsedData = JSON.parse(savedAnalyzerData);
      
      // Restore Set objects properly
      newAnalyzer.wordFrequency = parsedData.wordFrequency || {};
      newAnalyzer.sentenceLengths = parsedData.sentenceLengths || [];
      newAnalyzer.punctuationPatterns = parsedData.punctuationPatterns || {};
      newAnalyzer.emojiUsage = parsedData.emojiUsage || {};
      newAnalyzer.slangWords = new Set(parsedData.slangWords || []);
      newAnalyzer.formalityScore = parsedData.formalityScore || 0;
      newAnalyzer.messageCount = parsedData.messageCount || 0;
      
      setAnalyzer(newAnalyzer);
    }

    // Check if it's night time (8 PM to 6 AM)
    const hour = new Date().getHours();
    setIsNightMode(hour >= 20 || hour < 6);
  }, []);

  // Save messages and analyzer data to localStorage
  useEffect(() => {
    localStorage.setItem('echoMeMessages', JSON.stringify(messages));
    
    // Convert Set to array for localStorage
    const analyzerData = {
      wordFrequency: analyzer.wordFrequency,
      sentenceLengths: analyzer.sentenceLengths,
      punctuationPatterns: analyzer.punctuationPatterns,
      emojiUsage: analyzer.emojiUsage,
      slangWords: Array.from(analyzer.slangWords),
      formalityScore: analyzer.formalityScore,
      messageCount: analyzer.messageCount
    };
    
    localStorage.setItem('echoMeAnalyzer', JSON.stringify(analyzerData));
  }, [messages, analyzer]);

  const handleSendMessage = async (message) => {
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
    setTimeout(async () => {
      const personality = newAnalyzer.getPersonalitySummary();
      let response;
      
      // Check for aggressive language first
      const aggressiveWords = ['fuck', 'shit', 'damn', 'bitch', 'ass', 'hell', 'dumb', 'stupid', 'idiot', 'moron'];
      const isAggressive = aggressiveWords.some(word => message.toLowerCase().includes(word));
      
      try {
        if (useAI && aiStatus === 'connected') {
          // Use AI service
          response = await aiService.generateResponse(message, personality);
        } else if (isRoastMode) {
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
      } catch (error) {
        console.error('Response generation error:', error);
        // Fallback to personality engine
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

  const exportPersonality = () => {
    const personalityData = {
      messages: messages,
      analyzer: {
        wordFrequency: analyzer.wordFrequency,
        sentenceLengths: analyzer.sentenceLengths,
        punctuationPatterns: analyzer.punctuationPatterns,
        emojiUsage: analyzer.emojiUsage,
        slangWords: Array.from(analyzer.slangWords),
        formalityScore: analyzer.formalityScore,
        messageCount: analyzer.messageCount
      },
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(personalityData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `echo-me-personality-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const importPersonality = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.messages && data.analyzer) {
          setMessages(data.messages);
          
          const newAnalyzer = new LanguageAnalyzer();
          newAnalyzer.wordFrequency = data.analyzer.wordFrequency || {};
          newAnalyzer.sentenceLengths = data.analyzer.sentenceLengths || [];
          newAnalyzer.punctuationPatterns = data.analyzer.punctuationPatterns || {};
          newAnalyzer.emojiUsage = data.analyzer.emojiUsage || {};
          newAnalyzer.slangWords = new Set(data.analyzer.slangWords || []);
          newAnalyzer.formalityScore = data.analyzer.formalityScore || 0;
          newAnalyzer.messageCount = data.analyzer.messageCount || 0;
          
          setAnalyzer(newAnalyzer);
          
          alert('Personality imported successfully!');
        } else {
          alert('Invalid personality file format.');
        }
      } catch (error) {
        alert('Error importing personality file.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleAISettingsChange = (provider, model) => {
    aiService.setProvider(provider, model);
    setUseAI(provider !== 'fallback');
    
    // Check AI status
    aiService.checkOllamaStatus().then(isAvailable => {
      setAiStatus(isAvailable ? 'connected' : 'disconnected');
    }).catch(() => {
      setAiStatus('error');
    });
  };

  // Clear corrupted localStorage data on first load
  useEffect(() => {
    const savedAnalyzerData = localStorage.getItem('echoMeAnalyzer');
    if (savedAnalyzerData) {
      try {
        const parsed = JSON.parse(savedAnalyzerData);
        // If the data doesn't have the expected structure, clear it
        if (!parsed.slangWords || !Array.isArray(parsed.slangWords)) {
          localStorage.removeItem('echoMeAnalyzer');
          localStorage.removeItem('echoMeMessages');
        }
      } catch (error) {
        // If parsing fails, clear the corrupted data
        localStorage.removeItem('echoMeAnalyzer');
        localStorage.removeItem('echoMeMessages');
      }
    }
  }, []);

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
            
            <button 
              className="export-button"
              onClick={exportPersonality}
              title="Export Personality"
            >
              💾
            </button>
            
            <input
              type="file"
              id="import-file"
              accept=".json"
              onChange={importPersonality}
              style={{ display: 'none' }}
            />
            <button 
              className="import-button"
              onClick={() => document.getElementById('import-file').click()}
              title="Import Personality"
            >
              📁
            </button>
            
            <AISettings 
              aiService={aiService}
              onSettingsChange={handleAISettingsChange}
            />
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