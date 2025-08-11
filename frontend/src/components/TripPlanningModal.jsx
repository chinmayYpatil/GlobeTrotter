import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, X } from 'lucide-react';

const TripPlanningModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOptionClick = (option) => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      if (option === 'ai') {
        navigate('/build-trip-ai');
      } else if (option === 'create') {
        navigate('/create-trip');
      }
    }, 150);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-300 ${
          isAnimating 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Options */}
        <div className="space-y-6 mt-4">
          {/* Create a trip option */}
          <div 
            className={`flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              isAnimating ? 'animate-slideInUp' : ''
            }`}
            style={{ 
              animationDelay: '0.1s',
              animation: isAnimating ? 'slideInUp 0.6s ease-out forwards' : 'none'
            }}
            onClick={() => handleOptionClick('create')}
          >
            <span className="text-lg font-semibold text-gray-800">Create a trip</span>
            <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
          </div>

          {/* Build a trip with AI option */}
          <div 
            className={`flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              isAnimating ? 'animate-slideInUp' : ''
            }`}
            style={{ 
              animationDelay: '0.3s',
              animation: isAnimating ? 'slideInUp 0.6s ease-out forwards' : 'none'
            }}
            onClick={() => handleOptionClick('ai')}
          >
            <span className="text-lg font-semibold text-gray-800">Build a trip with AI</span>
            <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-600 rounded-full transform rotate-45 animate-pulse"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full transform -rotate-45 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanningModal;
