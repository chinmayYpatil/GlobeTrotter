import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const AIGenerationLoader = ({ message = "Generating your perfect trip..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center transition-colors duration-500">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Sparkles className="w-12 h-12 text-purple-500 animate-pulse" />
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin absolute top-2 left-2" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-500">
          AI Trip Generation
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-500">
          {message}
        </p>
        
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 transition-colors duration-500">
          This may take a few moments...
        </p>
      </div>
    </div>
  );
};

export default AIGenerationLoader;
