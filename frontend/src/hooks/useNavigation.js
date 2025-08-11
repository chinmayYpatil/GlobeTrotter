import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Track navigation history
  useEffect(() => {
    setNavigationHistory(prev => [...prev, location.pathname]);
  }, [location]);

  // Reset navigation state when location changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [location]);

  const navigateTo = useCallback((path, options = {}) => {
    setIsNavigating(true);
    navigate(path, options);
  }, [navigate]);

  const goBack = useCallback(() => {
    setIsNavigating(true);
    navigate(-1);
  }, [navigate]);

  const goToPrevious = useCallback(() => {
    if (navigationHistory.length > 1) {
      const previousPath = navigationHistory[navigationHistory.length - 2];
      setIsNavigating(true);
      navigate(previousPath);
    }
  }, [navigationHistory, navigate]);

  return {
    isNavigating,
    navigateTo,
    goBack,
    goToPrevious,
    currentPath: location.pathname,
    navigationHistory
  };
};
