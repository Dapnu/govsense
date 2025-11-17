import React, { useState } from 'react';

function TextMode({ onSubmit, loading, darkMode }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }
    if (text.length > 2000) {
      setError('Text must be less than 2000 characters');
      return;
    }
    setError('');
    onSubmit(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Text Analysis
      </h2>
      <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Enter text to analyze whether it contains constructive criticism, neutral content, hate speech, or unrelated content.
      </p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type or paste your text here... (Press Ctrl+Enter to analyze)"
        className={`w-full h-40 p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error 
            ? 'border-red-500' 
            : darkMode 
            ? 'border-gray-600 bg-gray-700 text-white' 
            : 'border-gray-300 bg-white'
        }`}
        disabled={loading}
      />
      
      <div className="flex justify-between items-center mt-3">
        <span className={`text-sm ${
          text.length > 2000 
            ? 'text-red-500' 
            : darkMode 
            ? 'text-gray-400' 
            : 'text-gray-500'
        }`}>
          {text.length} / 2000 characters
        </span>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        className={`w-full mt-4 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
          loading || !text.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {loading ? 'Analyzing...' : '🔍 Analyze Text'}
      </button>

      <p className={`text-xs mt-3 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Tip: Press Ctrl+Enter to quickly analyze
      </p>
    </div>
  );
}

export default TextMode;
