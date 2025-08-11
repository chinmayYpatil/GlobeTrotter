import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { Search, Clock, DollarSign, Star, Plus, Filter, MapPin } from 'lucide-react';

const ActivitySearch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stopId = searchParams.get('stopId');
  
  const { getTripById, searchActivities, updateTripStop } = useTrips();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    maxCost: '',
    minRating: ''
  });
  
  const trip = getTripById(id);
  const stop = trip?.stops.find(s => s.id === stopId);
  const activities = searchActivities(searchQuery, filters);
  
  const activityTypes = ['all', 'sightseeing', 'cultural', 'historical', 'leisure', 'adventure', 'food', 'shopping'];

  const handleAddActivity = (activity) => {
    if (stop) {
      const updatedActivities = [...(stop.activities || []), activity.id];
      updateTripStop(id, stopId, { activities: updatedActivities });
      navigate(`/trip/${id}/build`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout title="Browse Activities" showBack={true} backTo={`/trip/${id}/build`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {activityTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              
              <input
                type="number"
                value={filters.maxCost}
                onChange={(e) => setFilters({ ...filters, maxCost: e.target.value })}
                placeholder="Max cost ($)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <input
                type="number"
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                placeholder="Min rating"
                step="0.1"
                min="0"
                max="5"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                    {activity.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{activity.name}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{activity.description}</p>
                
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-gray-600">{activity.duration}h</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-gray-600">${activity.cost}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-gray-600">{activity.rating}</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddActivity(activity)}
                  disabled={stop?.activities?.includes(activity.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {stop?.activities?.includes(activity.id) ? (
                    <>
                      <span>Already Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Add Activity</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {activities.length === 0 && (
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default ActivitySearch;