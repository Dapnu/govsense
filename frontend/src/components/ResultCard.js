import React from 'react';

function ResultCard({ result, onNewAnalysis, darkMode }) {
  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'constructive':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'neutral':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'hate_speech':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'unrelated':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getClassificationColorDark = (classification) => {
    switch (classification) {
      case 'constructive':
        return 'bg-green-900 text-green-200 border-green-700';
      case 'neutral':
        return 'bg-blue-900 text-blue-200 border-blue-700';
      case 'hate_speech':
        return 'bg-red-900 text-red-200 border-red-700';
      case 'unrelated':
        return 'bg-gray-700 text-gray-200 border-gray-600';
      default:
        return 'bg-gray-700 text-gray-200 border-gray-600';
    }
  };

  const getClassificationIcon = (classification) => {
    switch (classification) {
      case 'constructive':
        return '✅';
      case 'neutral':
        return 'ℹ️';
      case 'hate_speech':
        return '⚠️';
      case 'unrelated':
        return '❓';
      default:
        return '•';
    }
  };

  const formatClassification = (classification) => {
    return classification
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const colorClass = darkMode 
    ? getClassificationColorDark(result.classification)
    : getClassificationColor(result.classification);

  return (
    <div className={`rounded-xl shadow-xl p-8 animate-fade-in ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-start mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Analysis Result
        </h2>
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {new Date(result.timestamp).toLocaleString()}
        </span>
      </div>

      {/* Classification Badge */}
      <div className={`border-2 rounded-lg p-6 mb-6 ${colorClass}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getClassificationIcon(result.classification)}</span>
            <div>
              <div className="text-sm font-medium opacity-75">Classification</div>
              <div className="text-2xl font-bold">
                {formatClassification(result.classification)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium opacity-75">Confidence</div>
            <div className="text-2xl font-bold">
              {(result.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>
        
        {/* Confidence Bar */}
        <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
          <div
            className="bg-current h-2 rounded-full transition-all duration-500"
            style={{ width: `${result.confidence * 100}%` }}
          />
        </div>
      </div>

      {/* Explanation */}
      <div className="mb-6">
        <h3 className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          📝 Explanation
        </h3>
        <p className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>
          {result.explanation}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onNewAnalysis}
          className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          🔄 Analyze Another
        </button>
        <button
          onClick={() => {
            const dataStr = JSON.stringify(result, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `govsense-result-${Date.now()}.json`;
            link.click();
          }}
          className={`py-3 px-6 rounded-lg font-semibold transition-colors ${
            darkMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          💾 Export JSON
        </button>
      </div>
    </div>
  );
}

export default ResultCard;
