import React from 'react';

function ErrorModal({ message, onClose, darkMode }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-xl shadow-2xl p-6 max-w-md w-full animate-fade-in ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-start gap-4">
          <div className="text-4xl">❌</div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Error
            </h3>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {message}
            </p>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
