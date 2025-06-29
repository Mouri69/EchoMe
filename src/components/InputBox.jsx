import React, { useState, useRef } from 'react';
import './InputBox.css';

const InputBox = ({ onSendMessage, isNightMode }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  const quickPhrases = [
    "yo what's up",
    "feeling good today",
    "that's wild fr",
    "thanks for listening",
    "bruh moment"
  ];

  const handleQuickPhrase = (phrase) => {
    setMessage(phrase);
    textareaRef.current?.focus();
  };

  return (
    <div className={`input-container ${isNightMode ? 'night-mode' : ''}`}>
      {/* Quick Phrases */}
      <div className="quick-phrases">
        {quickPhrases.map((phrase, index) => (
          <button
            key={index}
            className="quick-phrase-btn"
            onClick={() => handleQuickPhrase(phrase)}
            title={`Quick: ${phrase}`}
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Main Input */}
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here... (Press Enter to send)"
            className="message-input"
            rows="1"
            autoFocus
          />
          
          <div className="input-actions">
            {/* Emoji Picker */}
            <div className="emoji-picker">
              {['😊', '😂', '😎', '💀', '✨', '🔥', '💯', '👑', '💅', '🌟'].map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  className="emoji-btn"
                  onClick={() => handleEmojiClick(emoji)}
                  title={`Add ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              className={`send-button ${isTyping ? 'active' : ''}`}
              disabled={!message.trim()}
              title="Send message (Enter)"
            >
              <span className="send-icon">➤</span>
            </button>
          </div>
        </div>
      </form>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="typing-indicator">
          <span>Typing...</span>
        </div>
      )}
    </div>
  );
};

export default InputBox; 