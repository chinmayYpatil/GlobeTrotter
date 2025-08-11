import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, LogOut, Loader2, Search, MapPin, Plus, Calendar, Home, Menu, X, Globe } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';
import LoadingSpinner from './LoadingSpinner';

const Layout = ({ children, title, showBack = false, backTo = '/' }) => {
  const { user, logout } = useAuth();
  const { isNavigating, navigateTo, goBack } = useNavigation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'My Trips', path: '/my-trips', icon: Calendar },
    { name: 'Create Trip', path: '/create-trip', icon: Plus },
    { name: 'Activity Search', path: '/activity-search', icon: Search },
    { name: 'Community', path: '/community', icon: Globe },
  ];

  const handleNavigation = (path) => {
    navigateTo(path);
    setShowMobileMenu(false);
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
              
              {/* Logo/Brand */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GT</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">GlobalTrotter</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {showMobileMenu ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              {/* User Profile */}
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
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name || 'User'}</span>
              </div>

              {/* Logout Button */}
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

          {/* Mobile Navigation Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.path)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors text-left"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
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