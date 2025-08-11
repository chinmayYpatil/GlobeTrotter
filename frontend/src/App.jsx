import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import Dashboard from './screens/Dashboard';
import CreateTrip from './screens/CreateTrip';
import MyTrips from './screens/MyTrips';
import ItineraryBuilder from './screens/ItineraryBuilder';
import ItineraryView from './screens/ItineraryView';
import CitySearch from './screens/CitySearch';
import ActivitySearch from './screens/ActivitySearch';
import TripBudget from './screens/TripBudget';
import TripCalendar from './screens/TripCalendar';
import SharedItinerary from './screens/SharedItinerary';

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
              <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
              <Route path="/trip/:id/build" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
              <Route path="/trip/:id/view" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
              <Route path="/trip/:id/cities" element={<ProtectedRoute><CitySearch /></ProtectedRoute>} />
              <Route path="/trip/:id/activities" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
              <Route path="/trip/:id/budget" element={<ProtectedRoute><TripBudget /></ProtectedRoute>} />
              <Route path="/trip/:id/calendar" element={<ProtectedRoute><TripCalendar /></ProtectedRoute>} />
              <Route path="/shared/:shareId" element={<SharedItinerary />} />
            </Routes>
          </div>
        </Router>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;