import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Edit, Calendar, MapPin, DollarSign, Clock, Loader2, Plus } from 'lucide-react';
import tripService from '../services/tripService';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        setLoading(true);
        const result = await tripService.getMyTrips();
        if (result.success) {
          // Ensure we have an array of trips
          const tripsData = Array.isArray(result.data) ? result.data : [];
          setTrips(tripsData);
        } else {
          setError(result.error || 'Failed to fetch trips');
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError('Failed to fetch trips');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrips();
  }, []);

  // Ensure trips is always an array and filter safely
  const safeTrips = Array.isArray(trips) ? trips : [];
  
  const upcomingTrips = safeTrips.filter(trip => {
    try {
      return trip && trip.startDate && new Date(trip.startDate) > new Date();
    } catch (error) {
      console.error('Error processing trip date:', error);
      return false;
    }
  });
  
  const completedTrips = safeTrips.filter(trip => {
    try {
      return trip && trip.endDate && new Date(trip.endDate) < new Date();
    } catch (error) {
      console.error('Error processing trip date:', error);
      return false;
    }
  });
  
  const currentTrips = safeTrips.filter(trip => {
    try {
      if (!trip || !trip.startDate || !trip.endDate) return false;
      const now = new Date();
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      return now >= start && now <= end;
    } catch (error) {
      console.error('Error processing trip date:', error);
      return false;
    }
  });

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date not set';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getTripStatus = (trip) => {
    try {
      if (!trip || !trip.startDate || !trip.endDate) {
        return { status: 'unknown', color: 'bg-gray-100 text-gray-800' };
      }
      const now = new Date();
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      
      if (now < start) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' };
      if (now > end) return { status: 'completed', color: 'bg-green-100 text-green-800' };
      return { status: 'ongoing', color: 'bg-orange-100 text-orange-800' };
    } catch (error) {
      console.error('Error getting trip status:', error);
      return { status: 'unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const safeTripBudget = (trip) => {
    if (!trip || typeof trip.budget === 'undefined' || trip.budget === null) {
      return 'Budget not set';
    }
    // If budget is an object, try to extract the value
    if (typeof trip.budget === 'object') {
      return trip.budget.total || trip.budget.amount || 'Budget not set';
    }
    return trip.budget;
  };

  if (loading) {
    return (
      <Layout title="Profile" showBack={true} backTo="/">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 dark:text-blue-400 transition-colors duration-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profile" showBack={true} backTo="/">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8 transition-colors duration-500">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 h-32 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={user?.avatar || 'https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=U'}
                alt={user?.name || 'User'}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover transition-colors duration-500"
              />
              <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300 transition-colors duration-500" />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-20 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">
                {user?.name || 'User Name'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4 transition-colors duration-500">
                {user?.email || 'user@example.com'}
              </p>
              {user?.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl transition-colors duration-500">
                  {user.bio}
                </p>
              )}
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{user?.location || 'Location not set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trip Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors duration-500">Total Trips</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500">{safeTrips.length}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full transition-colors duration-500">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors duration-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors duration-500">Upcoming</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 transition-colors duration-500">{upcomingTrips.length}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full transition-colors duration-500">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400 transition-colors duration-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors duration-500">Completed</p>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400 transition-colors duration-500">{completedTrips.length}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full transition-colors duration-500">
              <Calendar className="w-6 h-6 text-gray-600 dark:text-gray-400 transition-colors duration-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Current/Ongoing Trips */}
      {currentTrips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2 transition-colors duration-500">
            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400 transition-colors duration-500" />
            <span>Current Trips</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTrips.map(trip => (
              <div key={trip.id || trip._id || Math.random()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-all duration-300" onClick={() => navigate(`/trip/${trip.id || trip._id}/view`)}>
                <div className="h-40 bg-gradient-to-r from-orange-400 to-red-400 relative overflow-hidden">
                  {trip.coverImage ? (
                    <img src={trip.coverImage} alt={trip.name || 'Trip'} className="w-full h-full object-cover" />
                  ) : <div className="absolute inset-0 bg-black bg-opacity-20"></div>}
                  <div className="absolute top-3 right-3">
                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full font-medium transition-colors duration-500">Ongoing</span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-bold text-lg">{trip.name || 'Untitled Trip'}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 text-sm transition-colors duration-500">{trip.description || 'No description.'}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-500">
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{safeTripBudget(trip)}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors duration-500">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Trips */}
      {upcomingTrips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2 transition-colors duration-500">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors duration-500" />
            <span>Upcoming Trips</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrips.map(trip => (
              <div key={trip.id || trip._id || Math.random()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-all duration-300" onClick={() => navigate(`/trip/${trip.id || trip._id}/view`)}>
                <div className="h-40 bg-gradient-to-r from-blue-400 to-teal-400 relative overflow-hidden">
                  {trip.coverImage ? (
                    <img src={trip.coverImage} alt={trip.name || 'Trip'} className="w-full h-full object-cover" />
                  ) : <div className="absolute inset-0 bg-black bg-opacity-20"></div>}
                  <div className="absolute top-3 right-3">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium transition-colors duration-500">Upcoming</span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-bold text-lg">{trip.name || 'Untitled Trip'}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 text-sm transition-colors duration-500">{trip.description || 'No description.'}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 transition-colors duration-500">
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{safeTripBudget(trip)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Trips */}
      {completedTrips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2 transition-colors duration-500">
            <Calendar className="w-6 h-6 text-green-600 dark:text-green-400 transition-colors duration-500" />
            <span>Completed Trips</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedTrips.map(trip => (
              <div key={trip.id || trip._id || Math.random()} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-all duration-300" onClick={() => navigate(`/trip/${trip.id || trip._id}/view`)}>
                <div className="h-40 bg-gradient-to-r from-green-400 to-emerald-400 relative overflow-hidden">
                  {trip.coverImage ? (
                    <img src={trip.coverImage} alt={trip.name || 'Trip'} className="w-full h-full object-cover" />
                  ) : <div className="absolute inset-0 bg-black bg-opacity-20"></div>}
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full font-medium transition-colors duration-500">Completed</span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-bold text-lg">{trip.name || 'Untitled Trip'}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 text-sm transition-colors duration-500">{trip.description || 'No description.'}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 transition-colors duration-500">
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{safeTripBudget(trip)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Trips State */}
      {safeTrips.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-500">
            <span className="block text-gray-400 text-6xl mb-6">🗺️</span>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">No Trips Yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto transition-colors duration-500">
              Start your travel journey by planning your first trip. Create itineraries, explore destinations, and track your adventures.
            </p>
            <button 
              onClick={() => navigate('/create-trip')}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Plan Your First Trip</span>
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 transition-colors duration-500">
            <p className="text-red-600 dark:text-red-400 transition-colors duration-500">{error}</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserProfile;
