import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.getCurrentUser();
      if (result.success && result.data.user) {
        setUser(result.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setError(error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.data.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };

  const signup = async (userData) => {
     setLoading(true);
    setError(null);
    const result = await authService.register(userData);
    if (result.success) {
      setUser(result.data.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    await authService.logout();
    setUser(null);
    setLoading(false);
    return { success: true };
  };
  
  const refreshUser = useCallback(async () => {
    await checkAuthStatus();
  }, [checkAuthStatus]);

  const value = { user, setUser, login, signup, logout, loading, error, refreshUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};