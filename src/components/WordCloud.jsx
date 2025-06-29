import React from 'react';
import './WordCloud.css';

const WordCloud = ({ topWords, topEmojis, slangWords }) => {
  const getFontSize = (frequency, maxFrequency) => {
    const minSize = 0.8;
    const maxSize = 2.5;
    const ratio = frequency / maxFrequency;
    return minSize + (maxSize - minSize) * ratio;
  };

  const getRandomColor = () => {
    const colors = [
      '#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ff9ff3',
      '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const maxWordFrequency = topWords.length > 0 ? Math.max(...topWords.map(w => w.frequency)) : 1;
  const maxEmojiFrequency = topEmojis.length > 0 ? Math.max(...topEmojis.map(e => e.frequency)) : 1;

  return (
    <div className="word-cloud-container">
      <h3 className="word-cloud-title">☁️ Your Word Cloud</h3>
      
      {topWords.length === 0 && topEmojis.length === 0 && slangWords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>Start chatting to see your word cloud!</p>
        </div>
      ) : (
        <div className="word-cloud-content">
          {/* Most Used Words */}
          {topWords.length > 0 && (
            <div className="cloud-section">
              <h4 className="section-title">📚 Most Used Words</h4>
              <div className="word-cloud">
                {topWords.slice(0, 8).map((word, index) => (
                  <span
                    key={index}
                    className="cloud-word"
                    style={{
                      fontSize: `${getFontSize(word.frequency, maxWordFrequency)}rem`,
                      color: getRandomColor(),
                      animationDelay: `${index * 0.1}s`
                    }}
                    title={`Used ${word.frequency} times`}
                  >
                    {word.word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Most Used Emojis */}
          {topEmojis.length > 0 && (
            <div className="cloud-section">
              <h4 className="section-title">😊 Favorite Emojis</h4>
              <div className="emoji-cloud">
                {topEmojis.slice(0, 6).map((emoji, index) => (
                  <span
                    key={index}
                    className="cloud-emoji"
                    style={{
                      fontSize: `${getFontSize(emoji.frequency, maxEmojiFrequency) * 1.5}rem`,
                      animationDelay: `${index * 0.1}s`
                    }}
                    title={`Used ${emoji.frequency} times`}
                  >
                    {emoji.emoji}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Slang Words */}
          {slangWords.length > 0 && (
            <div className="cloud-section">
              <h4 className="section-title">🔥 Your Slang</h4>
              <div className="slang-cloud">
                {slangWords.slice(0, 5).map((slang, index) => (
                  <span
                    key={index}
                    className="cloud-slang"
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {slang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="cloud-stats">
            <div className="stat-card">
              <span className="stat-number">{topWords.length}</span>
              <span className="stat-label">Unique Words</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{topEmojis.length}</span>
              <span className="stat-label">Emojis Used</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{slangWords.length}</span>
              <span className="stat-label">Slang Terms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordCloud; 