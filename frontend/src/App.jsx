import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import ProtectedRoute from './components/ProtectedRoute';

// Use React.lazy for all route-level components
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const SignupScreen = lazy(() => import('./screens/SignupScreen'));
const Dashboard = lazy(() => import('./screens/Dashboard'));
const CreateTrip = lazy(() => import('./screens/CreateTrip'));
const MyTrips = lazy(() => import('./screens/MyTrips'));
const ItineraryBuilder = lazy(() => import('./screens/ItineraryBuilder'));
const ItineraryView = lazy(() => import('./screens/ItineraryView'));
const CitySearch = lazy(() => import('./screens/CitySearch'));
const ActivitySearch = lazy(() => import('./screens/ActivitySearch'));
const TripBudget = lazy(() => import('./screens/TripBudget'));
const TripCalendar = lazy(() => import('./screens/TripCalendar'));
const SharedItinerary = lazy(() => import('./screens/SharedItinerary'));

// A simple loading component to show while lazy components are loading
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <Router>
          {/* Wrap the Routes component with Suspense */}
          <Suspense fallback={<LoadingFallback />}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
              <Routes>
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
                <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
                <Route path="/trip/:id/build" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
                <Route path="/trip/:id/view" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
                <Route path="/trip/:id/cities" element={<ProtectedRoute><CitySearch /></ProtectedRoute>} />
                <Route path="/trip/:id/activities" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
                <Route path="/trip/:id/budget" element={<ProtectedRoute><TripBudget /></ProtectedRoute>} />
                <Route path="/trip/:id/calendar" element={<ProtectedRoute><TripCalendar /></ProtectedRoute>} />
                
                {/* Public Route */}
                <Route path="/shared/:shareId" element={<SharedItinerary />} />
              </Routes>
            </div>
          </Suspense>
        </Router>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;