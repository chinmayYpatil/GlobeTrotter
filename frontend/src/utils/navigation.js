// Navigation utility functions to help prevent navigation issues

export const navigateWithDelay = (navigate, path, delay = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      navigate(path);
      resolve();
    }, delay);
  });
};

export const navigateWithState = (navigate, path, state = {}) => {
  navigate(path, { state });
};

export const navigateWithReplace = (navigate, path, state = {}) => {
  navigate(path, { state, replace: true });
};

export const goBackWithFallback = (navigate, fallbackPath = '/') => {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate(fallbackPath);
  }
};

export const isNavigationAllowed = (currentPath, targetPath) => {
  // Prevent navigation to the same path
  if (currentPath === targetPath) {
    return false;
  }
  
  // Add any other navigation restrictions here
  return true;
};

export const getNavigationKey = (path, params = {}) => {
  // Generate a unique key for navigation to prevent stale component rendering
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return `${path}?${paramString}`;
};
