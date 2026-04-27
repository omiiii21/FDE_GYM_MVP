import { useState } from 'react';
import ReactMarkdown from 'react-markdown';


export const RecommendationPanel = ({ onGenerate, recommendation, loading }: any) => {
  const [apiKey, setApiKey] = useState('');

  const handleGenerate = () => {
    if (!apiKey) return;
    onGenerate(apiKey);
  };

  return (
    <div className="card animate-fade-in recommendation-step" style={{ animationDelay: '0.3s' }}>
      <h2>AI Coach Recommendation</h2>
      
      {!recommendation && (
        <div className="form-group">
          <label>Gemini API Key</label>
          <input 
            type="password" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
            placeholder="AIzaSy..." 
          />
          <p className="text-sm text-secondary mt-4 mb-4" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            Your key is only used for this session and is not stored permanently.
          </p>
          <button onClick={handleGenerate} disabled={!apiKey || loading}>
            {loading ? 'Generating...' : 'Get Recommendation'}
          </button>
        </div>
      )}

      {recommendation && (
        <div className="recommendation-content" style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
          <div className="markdown-content">
            <ReactMarkdown>{recommendation}</ReactMarkdown>
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <button onClick={() => onGenerate(apiKey)} disabled={!apiKey || loading} style={{ width: 'auto', display: 'inline-block' }}>
              {loading ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p className="text-sm text-secondary" style={{ opacity: 0.7 }}>
          ⚠️ This is not medical advice. Consult a professional before starting any new fitness program.
        </p>
      </div>
    </div>
  );
};
