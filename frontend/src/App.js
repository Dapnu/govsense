import React, { useState } from 'react';
import axios from 'axios';
import TextMode from './components/TextMode';
import ImageMode from './components/ImageMode';
import ResultCard from './components/ResultCard';
import ErrorModal from './components/ErrorModal';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [mode, setMode] = useState('text'); // 'text' or 'image'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleTextSubmit = async (text) => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/classify_text`, {
        text: text.trim()
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to classify text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async (file) => {
    if (!file) {
      setError('Please select an image to analyze');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/classify_image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to classify image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setResult(null);
    setError(null);
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Mode Selection */}
        <div className="mb-8">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleModeSwitch('text')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'text'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📝 Text Mode
            </button>
            <button
              onClick={() => handleModeSwitch('image')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'image'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🖼️ Image Mode
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className={`rounded-xl shadow-xl p-8 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {mode === 'text' ? (
            <TextMode onSubmit={handleTextSubmit} loading={loading} darkMode={darkMode} />
          ) : (
            <ImageMode onSubmit={handleImageSubmit} loading={loading} darkMode={darkMode} />
          )}
        </div>

        {/* Loading Spinner */}
        {loading && <LoadingSpinner darkMode={darkMode} />}

        {/* Results */}
        {result && !loading && (
          <ResultCard 
            result={result} 
            onNewAnalysis={handleNewAnalysis} 
            darkMode={darkMode}
          />
        )}

        {/* Error Modal */}
        {error && (
          <ErrorModal 
            message={error} 
            onClose={() => setError(null)} 
            darkMode={darkMode}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`text-center py-6 mt-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <p className="text-sm">
          GovSense v1.0.0 - Powered by Google Gemini AI
        </p>
        <p className="text-xs mt-2">
          Monitor public feedback • Analyze sentiment • Filter harmful content
        </p>
      </footer>
    </div>
  );
}

export default App;
