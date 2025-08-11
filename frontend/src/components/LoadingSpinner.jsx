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
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4 ${sizeClasses[size]} transition-colors duration-500`}></div>
      {message && (
        <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-500">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
