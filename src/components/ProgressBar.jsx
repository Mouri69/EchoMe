import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ adaptationLevel, messageCount, formalityScore }) => {
  const getAdaptationColor = (level) => {
    if (level < 30) return '#ff6b6b'; // Red
    if (level < 60) return '#feca57'; // Yellow
    if (level < 90) return '#48dbfb'; // Blue
    return '#1dd1a1'; // Green
  };

  const getAdaptationText = (level) => {
    if (level < 10) return 'Just getting started...';
    if (level < 30) return 'Learning your style...';
    if (level < 60) return 'Getting the hang of it...';
    if (level < 90) return 'Almost there...';
    return 'Fully adapted! 🎉';
  };

  const getFormalityLabel = (score) => {
    if (score < 30) return 'Very Casual';
    if (score < 50) return 'Casual';
    if (score < 70) return 'Neutral';
    if (score < 90) return 'Formal';
    return 'Very Formal';
  };

  const getFormalityColor = (score) => {
    if (score < 30) return '#ff9ff3'; // Pink
    if (score < 50) return '#feca57'; // Yellow
    if (score < 70) return '#48dbfb'; // Blue
    if (score < 90) return '#54a0ff'; // Dark Blue
    return '#5f27cd'; // Purple
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h3 className="progress-title">🧬 Adaptation Progress</h3>
        <div className="progress-stats">
          <span className="stat-item">
            <span className="stat-label">Messages:</span>
            <span className="stat-value">{messageCount}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Style:</span>
            <span 
              className="stat-value formality-badge"
              style={{ backgroundColor: getFormalityColor(formalityScore) }}
            >
              {getFormalityLabel(formalityScore)}
            </span>
          </span>
        </div>
      </div>

      <div className="progress-bar-section">
        <div className="progress-label">
          <span>Mirror Level</span>
          <span className="progress-percentage">{Math.round(adaptationLevel)}%</span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${adaptationLevel}%`,
              backgroundColor: getAdaptationColor(adaptationLevel)
            }}
          />
        </div>
        
        <div className="progress-status">
          {getAdaptationText(adaptationLevel)}
        </div>
      </div>

      <div className="progress-details">
        <div className="detail-item">
          <span className="detail-icon">📊</span>
          <span className="detail-text">
            {messageCount < 5 
              ? "Send more messages to see your personality emerge!"
              : "Your unique speaking patterns are being learned"
            }
          </span>
        </div>
        
        {messageCount >= 3 && (
          <div className="detail-item">
            <span className="detail-icon">🎯</span>
            <span className="detail-text">
              {adaptationLevel < 50 
                ? "I'm starting to pick up your vibe"
                : "I'm getting pretty good at matching your style!"
              }
            </span>
          </div>
        )}
        
        {adaptationLevel >= 80 && (
          <div className="detail-item">
            <span className="detail-icon">✨</span>
            <span className="detail-text">
              "I've mastered your unique way of speaking!"
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar; 