import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Plus, MapPin, Calendar, DollarSign, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { trips, cities } = useTrips();
  const { user } = useAuth();

  const upcomingTrips = trips.filter(trip => new Date(trip.startDate) >= new Date()).slice(0, 3);
  const popularCities = cities.slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout title="Dashboard">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100 text-lg">Ready to plan your next adventure?</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create-trip')}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>Plan New Trip</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
                <p className="text-gray-600">Total Trips</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <Calendar className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{upcomingTrips.length}</p>
                <p className="text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${trips.reduce((sum, trip) => sum + trip.budget.total, 0)}
                </p>
                <p className="text-gray-600">Total Budget</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Trips */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Trips</h2>
            <button
              onClick={() => navigate('/my-trips')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              View all
            </button>
          </div>
          
          {upcomingTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/trip/${trip.id}/view`)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-teal-400 relative overflow-hidden">
                    {trip.coverImage && (
                      <img
                        src={trip.coverImage}
                        alt={trip.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-xl">{trip.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd')}</span>
                      <span>${trip.budget.total}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No upcoming trips planned yet</p>
              <button
                onClick={() => navigate('/create-trip')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Plan Your First Trip
              </button>
            </div>
          )}
        </motion.div>

        {/* Popular Destinations */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Popular Destinations</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCities.map((city, index) => (
              <motion.div
                key={city.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-sm">{city.name}</h3>
                    <p className="text-white/80 text-xs">{city.country}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;