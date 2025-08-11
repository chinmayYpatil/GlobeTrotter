import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { 
  Search, 
  Clock, 
  DollarSign, 
  Star, 
  Plus, 
  Filter, 
  MapPin, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  X,
  Heart,
  Share2,
  Calendar,
  Users,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

const ActivitySearch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stopId = searchParams.get('stopId');
  
  const { getTripById, searchActivities, updateTripStop } = useTrips();
  const [searchQuery, setSearchQuery] = useState('Paragliding');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    maxCost: '',
    minRating: '',
    duration: 'all',
    groupSize: 'all',
    sortBy: 'relevance'
  });
  
  // Check if this is standalone access or trip-specific
  const isStandalone = !id;
  const trip = isStandalone ? null : getTripById(id);
  const stop = trip?.stops.find(s => s.id === stopId);
  
  // Mock activities data for demonstration
  const [activities, setActivities] = useState([
    {
      id: 1,
      name: "Agile Spoonbill Paragliding",
      description: "Experience the thrill of paragliding over stunning mountain landscapes with certified instructors. Perfect for beginners and experienced flyers alike.",
      type: "adventure",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      cost: 120,
      duration: 3,
      rating: 4.8,
      groupSize: "2-6 people",
      location: "Mountain Peak Resort",
      availability: "Daily",
      difficulty: "Beginner"
    },
    {
      id: 2,
      name: "Alive Bat Adventure Tours",
      description: "Explore hidden caves and discover the fascinating world of bats with expert guides. Educational and thrilling experience for nature lovers.",
      type: "adventure",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      cost: 85,
      duration: 2,
      rating: 4.6,
      groupSize: "4-8 people",
      location: "Crystal Cave System",
      availability: "Weekends",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      name: "Sunset Mountain Hiking",
      description: "Guided sunset hike to the mountain summit with panoramic views and photography opportunities. Includes refreshments and safety equipment.",
      type: "leisure",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      cost: 65,
      duration: 4,
      rating: 4.9,
      groupSize: "6-12 people",
      location: "Mountain Trailhead",
      availability: "Daily",
      difficulty: "Beginner"
    },
    {
      id: 4,
      name: "Cultural Village Tour",
      description: "Immerse yourself in local culture with guided tours of traditional villages, artisan workshops, and authentic cuisine tasting.",
      type: "cultural",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      cost: 45,
      duration: 5,
      rating: 4.7,
      groupSize: "8-15 people",
      location: "Heritage Village",
      availability: "Daily",
      difficulty: "All Levels"
    },
    {
      id: 5,
      name: "River Rafting Experience",
      description: "White water rafting adventure through scenic river canyons. Professional guides ensure safety while providing an exhilarating experience.",
      type: "adventure",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      cost: 95,
      duration: 3,
      rating: 4.8,
      groupSize: "6-8 people",
      location: "Rapid River",
      availability: "Seasonal",
      difficulty: "Intermediate"
    },
    {
      id: 6,
      name: "Historical Castle Exploration",
      description: "Step back in time with guided tours of ancient castles, including hidden passages, royal chambers, and fascinating historical stories.",
      type: "historical",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      cost: 35,
      duration: 2,
      rating: 4.5,
      groupSize: "10-20 people",
      location: "Royal Castle",
      availability: "Daily",
      difficulty: "All Levels"
    },
    {
      id: 7,
      name: "Gourmet Food Safari",
      description: "Culinary adventure through local markets, street food stalls, and hidden restaurants. Taste authentic flavors and learn cooking secrets.",
      type: "food",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      cost: 75,
      duration: 4,
      rating: 4.9,
      groupSize: "4-8 people",
      location: "Food District",
      availability: "Daily",
      difficulty: "All Levels"
    },
    {
      id: 8,
      name: "Artisan Craft Workshop",
      description: "Learn traditional crafts from master artisans. Create your own souvenirs while supporting local craftsmanship and cultural heritage.",
      type: "cultural",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      cost: 55,
      duration: 3,
      rating: 4.6,
      groupSize: "6-10 people",
      location: "Craft Center",
      availability: "Weekdays",
      difficulty: "All Levels"
    }
  ]);

  const [filteredActivities, setFilteredActivities] = useState(activities);
  
  const activityTypes = [
    { value: 'all', label: 'All Types', icon: '🌟' },
    { value: 'adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'cultural', label: 'Cultural', icon: '🏛️' },
    { value: 'historical', label: 'Historical', icon: '📚' },
    { value: 'leisure', label: 'Leisure', icon: '🌅' },
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'duration', label: 'Duration' }
  ];

  useEffect(() => {
    filterActivities();
  }, [searchQuery, filters, activities]);

  const filterActivities = () => {
    let filtered = activities.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filters.type === 'all' || activity.type === filters.type;
      const matchesCost = !filters.maxCost || activity.cost <= parseInt(filters.maxCost);
      const matchesRating = !filters.minRating || activity.rating >= parseFloat(filters.minRating);
      
      return matchesSearch && matchesType && matchesCost && matchesRating;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.cost - b.cost);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.cost - a.cost);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      default:
        // Keep relevance order
        break;
    }

    setFilteredActivities(filtered);
  };

  const handleAddActivity = (activity) => {
    if (isStandalone) {
      // If standalone, navigate to create trip or show message
      navigate('/create-trip');
    } else if (stop) {
      // If in trip context, add to trip
      const updatedActivities = [...(stop.activities || []), activity.id];
      updateTripStop(id, stopId, { activities: updatedActivities });
      navigate(`/trip/${id}/build`);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      maxCost: '',
      minRating: '',
      duration: 'all',
      groupSize: 'all',
      sortBy: 'relevance'
    });
  };

  const getBackButton = () => {
    if (isStandalone) {
      return { show: false };
    }
    return { show: true, backTo: `/trip/${id}/build` };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout 
      title="Activity Search" 
      showBack={getBackButton().show} 
      backTo={getBackButton().backTo}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Enhanced Search Header */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Discover Amazing Activities</h1>
            <p className="text-blue-100 text-lg">
              {isStandalone 
                ? "Find the perfect experiences for your next adventure" 
                : "Find the perfect experiences for your trip"
              }
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 h-6 w-6" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for activities..."
              className="w-full pl-12 pr-4 py-4 text-gray-900 text-lg border-0 rounded-2xl focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            />
          </div>
        </motion.div>

        {/* Controls Bar */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-500">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  showFilters 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
              
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 transition-colors duration-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Activity Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Activity Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
                    >
                      {activityTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Max Cost */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Max Cost ($)</label>
                    <input
                      type="number"
                      value={filters.maxCost}
                      onChange={(e) => setFilters({ ...filters, maxCost: e.target.value })}
                      placeholder="Any"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500"
                    />
                  </div>

                  {/* Min Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Min Rating</label>
                    <input
                      type="number"
                      value={filters.minRating}
                      onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                      placeholder="Any"
                      step="0.1"
                      min="0"
                      max="5"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500"
                    />
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
            Results ({filteredActivities.length})
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
            Showing {filteredActivities.length} of {activities.length} activities
          </div>
        </motion.div>

        {/* Activities Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
              >
                <div className="h-48 relative overflow-hidden group">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Activity Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 dark:text-white transition-colors duration-500">
                      {activityTypes.find(t => t.value === activity.type)?.icon} {activity.type}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                      <Heart className="h-4 w-4 text-white" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                      <Share2 className="h-4 w-4 text-white" />
                    </button>
                  </div>

                  {/* Activity Name */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl mb-1">{activity.name}</h3>
                    <p className="text-white/90 text-sm">{activity.location}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed transition-colors duration-500">{activity.description}</p>
                  
                  {/* Activity Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-300 transition-colors duration-500">{activity.duration}h</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300 transition-colors duration-500">${activity.cost}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-300 transition-colors duration-500">{activity.rating}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-gray-600 dark:text-gray-300 transition-colors duration-500">{activity.groupSize}</span>
                    </div>
                  </div>
                  
                  {/* Add Activity Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddActivity(activity)}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    {isStandalone ? (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Plan This Activity</span>
                      </>
                    ) : stop?.activities?.includes(activity.id) ? (
                      <span>Already Added</span>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Add to Trip</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
              >
                <div className="flex items-center space-x-6">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 transition-colors duration-500">{activity.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-500">{activity.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>{activity.duration}h</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span>${activity.cost}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{activity.rating}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-purple-500" />
                            <span>{activity.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddActivity(activity)}
                        className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all flex items-center space-x-2 shadow-lg"
                      >
                        {isStandalone ? (
                          <>
                            <Plus className="h-4 w-4" />
                            <span>Plan</span>
                          </>
                        ) : stop?.activities?.includes(activity.id) ? (
                          <span>Added</span>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {filteredActivities.length === 0 && (
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-500">
            <div className="text-gray-400 text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">No activities found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto transition-colors duration-500">
              Try adjusting your search criteria or filters to find more activities
            </p>
            <button 
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default ActivitySearch;