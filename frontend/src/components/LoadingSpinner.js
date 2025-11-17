import React from 'react';

function LoadingSpinner({ darkMode }) {
  return (
    <div className={`text-center py-8 rounded-xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      <p className={`mt-4 text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Analyzing with AI...
      </p>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        This may take a few seconds
      </p>
    </div>
  );
}

export default LoadingSpinner;
