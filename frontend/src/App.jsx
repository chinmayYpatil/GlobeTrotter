import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Use React.lazy for all route-level components
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const SignupScreen = lazy(() => import('./screens/SignupScreen'));
const Dashboard = lazy(() => import('./screens/Dashboard'));
const UserProfile = lazy(() => import('./screens/UserProfile'));
const ProfileEdit = lazy(() => import('./screens/ProfileEdit'));
const CreateTrip = lazy(() => import('./screens/CreateTrip'));
const MyTrips = lazy(() => import('./screens/MyTrips'));
const ItineraryBuilder = lazy(() => import('./screens/ItineraryBuilder'));
const ItineraryView = lazy(() => import('./screens/ItineraryView'));
const CitySearch = lazy(() => import('./screens/CitySearch'));
const ActivitySearch = lazy(() => import('./screens/ActivitySearch'));
const TripBudget = lazy(() => import('./screens/TripBudget'));
const TripCalendar = lazy(() => import('./screens/TripCalendar'));
const SharedItinerary = lazy(() => import('./screens/SharedItinerary'));
const Community = lazy(() => import('./screens/Community'));

// Error boundary component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">We're sorry, but there was an error loading this page.</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Navigation state manager
const NavigationManager = ({ children }) => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 100);
    return () => clearTimeout(timer);
  }, [location]);

  if (isNavigating) {
    return <LoadingSpinner message="Navigating..." fullScreen />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TripProvider>
          <Router>
            <NavigationManager>
              {/* Wrap the Routes component with Suspense */}
              <Suspense fallback={<LoadingSpinner message="Loading application..." fullScreen />}>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
                  <Routes>
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/signup" element={<SignupScreen />} />
                    
                    {/* Protected Routes */}
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
                    <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
                    <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
                    <Route path="/trip/:id/build" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
                    <Route path="/trip/:id/view" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
                    <Route path="/trip/:id/cities" element={<ProtectedRoute><CitySearch /></ProtectedRoute>} />
                    <Route path="/trip/:id/activities" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
                    <Route path="/trip/:id/budget" element={<ProtectedRoute><TripBudget /></ProtectedRoute>} />
                    <Route path="/trip/:id/calendar" element={<ProtectedRoute><TripCalendar /></ProtectedRoute>} />
                    
                    {/* Standalone Search Routes */}
                    <Route path="/activity-search" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
                    <Route path="/city-search" element={<ProtectedRoute><CitySearch /></ProtectedRoute>} />
                    
                    {/* Community Route */}
                    <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                    
                    {/* Public Route */}
                    <Route path="/shared/:shareId" element={<SharedItinerary />} />
                  </Routes>
                </div>
              </Suspense>
            </NavigationManager>
          </Router>
        </TripProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;