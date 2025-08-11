import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-14 h-8 rounded-full p-1 transition-all duration-500 ease-in-out
        ${isDark 
          ? 'bg-gray-700 shadow-lg shadow-purple-500/20' 
          : 'bg-gray-200 shadow-lg shadow-yellow-500/20'
        }
        hover:scale-105 active:scale-95
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {/* Toggle Handle */}
      <div
        className={`
          relative w-6 h-6 rounded-full transition-all duration-500 ease-in-out
          ${isDark 
            ? 'bg-purple-500 translate-x-6 shadow-lg shadow-purple-500/50' 
            : 'bg-yellow-400 translate-x-0 shadow-lg shadow-yellow-500/50'
          }
          flex items-center justify-center
        `}
      >
        {/* Icons */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isDark ? (
            <Moon className="w-3 h-3 text-white transition-all duration-500 ease-in-out" />
          ) : (
            <Sun className="w-3 h-3 text-white transition-all duration-500 ease-in-out" />
          )}
        </div>
      </div>

      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Sun className={`w-3 h-3 transition-all duration-500 ease-in-out ${
          isDark ? 'text-gray-500 opacity-30' : 'text-yellow-500 opacity-100'
        }`} />
        <Moon className={`w-3 h-3 transition-all duration-500 ease-in-out ${
          isDark ? 'text-purple-400 opacity-100' : 'text-gray-500 opacity-30'
        }`} />
      </div>

      {/* Ripple Effect */}
      <div
        className={`
          absolute inset-0 rounded-full transition-all duration-500 ease-in-out
          ${isDark 
            ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20' 
            : 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20'
          }
          opacity-0 hover:opacity-100
        `}
      />
    </button>
  );
};

export default ThemeToggle;
