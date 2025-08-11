import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, LogOut, Loader2 } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';
import LoadingSpinner from './LoadingSpinner';

const Layout = ({ children, title, showBack = false, backTo = '/' }) => {
  const { user, logout } = useAuth();
  const { isNavigating, navigateTo, goBack } = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      navigateTo('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBackNavigation = () => {
    if (backTo === 'back') {
      goBack();
    } else {
      navigateTo(backTo);
    }
  };

  const handleProfileNavigation = () => {
    navigateTo('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {showBack && (
                <button
                  onClick={handleBackNavigation}
                  disabled={isNavigating}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isNavigating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ArrowLeft className="h-5 w-5" />
                  )}
                </button>
              )}
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
                onClick={handleProfileNavigation}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                disabled={isNavigating}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isNavigating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isNavigating ? (
          <LoadingSpinner message="Loading..." />
        ) : (
          children
        )}
      </main>
    </div>
  );
};

export default Layout;