import React from 'react';

const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "medium", 
  fullScreen = false,
  className = "" 
}) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-16 w-16",
    large: "h-32 w-32"
  };

  const spinner = (
    <div className={`text-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-4 ${sizeClasses[size]}`}></div>
      {message && (
        <p className="text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
