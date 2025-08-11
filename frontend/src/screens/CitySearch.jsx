import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { Search, MapPin, DollarSign, Star, Plus, Filter } from 'lucide-react';

const CitySearch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById, searchCities, addStopToTrip } = useTrips();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  
  const trip = getTripById(id);
  const cities = searchCities(searchQuery);
  
  const sortedCities = [...cities].sort((a, b) => {
    if (sortBy === 'popularity') return b.popularity - a.popularity;
    if (sortBy === 'costLow') return a.costIndex - b.costIndex;
    if (sortBy === 'costHigh') return b.costIndex - a.costIndex;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const handleAddCity = (city) => {
    const newStop = {
      cityId: city.id,
      startDate: trip.startDate,
      endDate: trip.endDate,
      activities: []
    };
    addStopToTrip(id, newStop);
    navigate(`/trip/${id}/build`);
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
    <Layout title="Browse Cities" showBack={true} backTo={`/trip/${id}/build`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities or countries..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
              >
                <option value="popularity">Most Popular</option>
                <option value="name">Alphabetical</option>
                <option value="costLow">Cost: Low to High</option>
                <option value="costHigh">Cost: High to Low</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* City Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCities.map((city) => (
            <motion.div
              key={city.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl">{city.name}</h3>
                  <p className="text-white/90">{city.country}</p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">{city.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-gray-600">{city.popularity}%</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-gray-600">Index: {city.costIndex}</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddCity(city)}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Trip</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {sortedCities.length === 0 && searchQuery && (
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cities found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default CitySearch;