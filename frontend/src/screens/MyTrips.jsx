import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

const MyTrips = () => {
  const navigate = useNavigate();
  const { trips, deleteTrip } = useTrips();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const tripDate = new Date(trip.startDate);
    const now = new Date();
    
    let matchesFilter = true;
    if (filterStatus === 'upcoming') {
      matchesFilter = tripDate >= now;
    } else if (filterStatus === 'past') {
      matchesFilter = tripDate < now;
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleDeleteTrip = (tripId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId);
    }
  };

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
    <Layout title="My Trips" showBack={true} backTo="/">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header Actions */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/profile')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <span>Profile</span>
            </button>
          </div>
          <div className="flex items-center space-x-4 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trips..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Trips</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create-trip')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:from-blue-600 hover:to-teal-600 transition-all"
          >
            <Plus className="h-5 w-5" />
            <span>New Trip</span>
          </motion.button>
        </motion.div>

        {/* Trip Grid */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <motion.div
                key={trip.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all"
              >
                {/* Trip Image */}
                <div className="h-48 bg-gradient-to-r from-blue-400 to-teal-400 relative overflow-hidden">
                  {trip.coverImage ? (
                    <img
                      src={trip.coverImage}
                      alt={trip.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-4 right-4">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trip/${trip.id}/view`);
                        }}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                      >
                        <Eye className="h-4 w-4 text-gray-700" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trip/${trip.id}/build`);
                        }}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                      >
                        <Edit3 className="h-4 w-4 text-gray-700" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDeleteTrip(trip.id, e)}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Trip Content */}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{trip.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{trip.stops.length} destinations</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm">${trip.budget.total} budget</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/trip/${trip.id}/view`)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/trip/${trip.id}/build`)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Edit Trip
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all' ? 'No trips found' : 'No trips yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Start planning your first adventure and make memories that will last forever'
              }
            </p>
            <button
              onClick={() => navigate('/create-trip')}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all"
            >
              Plan Your First Trip
            </button>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default MyTrips;