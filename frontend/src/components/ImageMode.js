import React, { useState, useRef } from 'react';

function ImageMode({ onSubmit, loading, darkMode }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    setError('');

    // Validate file type
    if (!file.type.match('image/(jpeg|jpg|png)')) {
      setError('Only JPG and PNG images are supported');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }
    onSubmit(selectedFile);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Image Analysis
      </h2>
      <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Upload an image to analyze its content for constructive criticism, hate speech, or other classifications.
      </p>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-500'
            : darkMode
            ? 'border-gray-600 bg-gray-700'
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg shadow-md"
            />
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </div>
            <button
              onClick={handleClear}
              className={`text-sm px-4 py-2 rounded transition-colors ${
                darkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ✕ Clear Image
            </button>
          </div>
        ) : (
          <div>
            <div className="text-6xl mb-4">📤</div>
            <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Drag and drop an image here, or
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label
              htmlFor="file-upload"
              className={`inline-block px-6 py-2 rounded-lg cursor-pointer transition-colors ${
                darkMode
                  ? 'bg-gray-600 text-white hover:bg-gray-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Browse Files
            </label>
            <p className={`mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Supported: JPG, PNG (max 5MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 text-red-500 text-sm text-center">{error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !selectedFile}
        className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
          loading || !selectedFile
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {loading ? 'Analyzing...' : '🔍 Analyze Image'}
      </button>
    </div>
  );
}

export default ImageMode;
