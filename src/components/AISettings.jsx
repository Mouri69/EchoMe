import React, { useState, useEffect } from 'react';
import './AISettings.css';

const AISettings = ({ aiService, onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState('ollama');
  const [model, setModel] = useState('llama2');
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    setIsLoading(true);
    setStatus('checking');
    
    try {
      const isAvailable = await aiService.checkOllamaStatus();
      setStatus(isAvailable ? 'connected' : 'disconnected');
      
      if (isAvailable) {
        const models = await aiService.getAvailableModels();
        setAvailableModels(models);
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    aiService.setProvider(newProvider, model);
    onSettingsChange(newProvider, model);
  };

  const handleModelChange = (newModel) => {
    setModel(newModel);
    aiService.setProvider(provider, newModel);
    onSettingsChange(provider, newModel);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#4CAF50';
      case 'disconnected': return '#f44336';
      case 'error': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Error';
      default: return 'Checking...';
    }
  };

  return (
    <div className="ai-settings">
      <button 
        className="ai-settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Settings"
      >
        🤖
      </button>

      {isOpen && (
        <div className="ai-settings-panel">
          <div className="ai-settings-header">
            <h3>AI Settings</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="ai-status">
            <div className="status-indicator">
              <div 
                className="status-dot"
                style={{ backgroundColor: getStatusColor() }}
              />
              <span className="status-text">{getStatusText()}</span>
            </div>
            <button 
              className="refresh-button"
              onClick={checkAIStatus}
              disabled={isLoading}
            >
              {isLoading ? '⏳' : '🔄'}
            </button>
          </div>

          <div className="ai-provider-section">
            <label>AI Provider:</label>
            <select 
              value={provider} 
              onChange={(e) => handleProviderChange(e.target.value)}
            >
              <option value="ollama">Ollama (Local)</option>
              <option value="huggingface">Hugging Face</option>
              <option value="fallback">Fallback (Basic)</option>
            </select>
          </div>

          {provider === 'ollama' && (
            <div className="ai-model-section">
              <label>Model:</label>
              <select 
                value={model} 
                onChange={(e) => handleModelChange(e.target.value)}
              >
                <option value="llama2">Llama 2</option>
                <option value="mistral">Mistral</option>
                <option value="codellama">Code Llama</option>
                <option value="llama2-uncensored">Llama 2 Uncensored</option>
                {availableModels.map(m => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>
          )}

          {provider === 'huggingface' && (
            <div className="ai-model-section">
              <label>Model:</label>
              <select 
                value={model} 
                onChange={(e) => handleModelChange(e.target.value)}
              >
                <option value="microsoft/DialoGPT-medium">DialoGPT Medium</option>
                <option value="microsoft/DialoGPT-large">DialoGPT Large</option>
                <option value="EleutherAI/gpt-neo-125M">GPT-Neo 125M</option>
                <option value="EleutherAI/gpt-neo-1.3B">GPT-Neo 1.3B</option>
              </select>
            </div>
          )}

          <div className="ai-instructions">
            <h4>Setup Instructions:</h4>
            {provider === 'ollama' && (
              <div className="instructions">
                <p>1. Install Ollama: <a href="https://ollama.ai" target="_blank" rel="noopener">ollama.ai</a></p>
                <p>2. Run: <code>ollama pull {model}</code></p>
                <p>3. Start Ollama service</p>
                <p>4. Refresh status above</p>
              </div>
            )}
            {provider === 'huggingface' && (
              <div className="instructions">
                <p>1. Get free API token at <a href="https://huggingface.co" target="_blank" rel="noopener">huggingface.co</a></p>
                <p>2. Add to .env: <code>REACT_APP_HUGGINGFACE_TOKEN=your_token</code></p>
                <p>3. Restart the app</p>
              </div>
            )}
            {provider === 'fallback' && (
              <div className="instructions">
                <p>Using basic personality engine - no setup required!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISettings; 