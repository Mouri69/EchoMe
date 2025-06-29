import React, { useRef, useEffect } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ messages, isNightMode }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (text) => {
    // Simple emoji detection and formatting
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    
    return text.split(' ').map((word, index) => {
      if (emojiRegex.test(word)) {
        return <span key={index} className="emoji">{word}</span>;
      }
      return word + ' ';
    });
  };

  return (
    <div className={`chat-window ${isNightMode ? 'night-mode' : ''}`}>
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">🧬</div>
            <h3>Welcome to Echo Me!</h3>
            <p>Start chatting and I'll learn your unique way of speaking.</p>
            <p>Try saying something casual like "yo what's up" or formal like "Hello, how are you today?"</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">
                <div className="message-text">
                  {formatMessage(message.text)}
                </div>
                <div className="message-timestamp">
                  {message.timestamp}
                </div>
              </div>
              <div className="message-avatar">
                {message.sender === 'user' ? '👤' : '🧬'}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow; 