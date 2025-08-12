import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load all the screen components for better performance
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const SignupScreen = lazy(() => import('./screens/SignupScreen'));
const Dashboard = lazy(() => import('./screens/Dashboard'));
const UserProfile = lazy(() => import('./screens/UserProfile'));
const ProfileEdit = lazy(() => import('./screens/ProfileEdit'));
const CreateTrip = lazy(() => import('./screens/CreateTrip'));
const MyTrips = lazy(() => import('./screens/MyTrips'));
const ItineraryBuilder = lazy(() => import('./screens/ItineraryBuilder'));
const ViewTrip = lazy(() => import('./screens/ViewTrip')); // This is the correct, unified component
const CitySearch = lazy(() => import('./screens/CitySearch'));
const ActivitySearch = lazy(() => import('./screens/ActivitySearch'));
const TripBudget = lazy(() => import('./screens/TripBudget'));
const TripCalendar = lazy(() => import('./screens/TripCalendar'));
const SharedItinerary = lazy(() => import('./screens/SharedItinerary'));
const Community = lazy(() => import('./screens/Community'));
const BuildTripAI = lazy(() => import('./screens/BuildTripAI'));

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
                    <Route path="/build-trip-ai" element={<ProtectedRoute><BuildTripAI /></ProtectedRoute>} />
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
