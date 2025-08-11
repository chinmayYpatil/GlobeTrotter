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
  ArrowLeft,
  MessageCircle
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
    <Layout title="Activity Search" showBack={true} backTo="/">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 sm:space-y-6"
      >
        {/* Search Header */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <Search className="h-8 w-8 sm:h-12 sm:w-12 mr-2 sm:mr-3" />
              <h1 className="text-2xl sm:text-4xl font-bold">Find Amazing Activities</h1>
            </div>
            <p className="text-purple-100 text-sm sm:text-xl max-w-2xl mx-auto">
              Discover exciting activities, tours, and experiences for your next adventure
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5 sm:h-6 sm:w-6" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities, tours, or experiences..."
              className="w-full pl-12 sm:pl-12 pr-4 py-3 sm:py-4 text-gray-900 text-base sm:text-lg border-0 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            {/* Left Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl transition-all text-sm sm:text-base ${
                  showFilters
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
              
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500 text-sm"
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
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <List className="h-4 w-4 sm:h-5 sm:w-5" />
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
                className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700 transition-colors duration-500"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500 text-sm"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Price Range</label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500 text-sm"
                    >
                      {priceRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Duration</label>
                    <select
                      value={filters.duration}
                      onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500 text-sm"
                    >
                      {durations.map(duration => (
                        <option key={duration.value} value={duration.value}>
                          {duration.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
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
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">
            Activities ({filteredActivities.length})
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
            Showing {filteredActivities.length} of {activities.length} activities
          </div>
        </motion.div>

        {/* Activities Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => openActivityDetails(activity)}
              >
                {/* Activity Image */}
                <div className="h-40 sm:h-48 relative overflow-hidden group">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-gray-800 dark:text-white transition-colors duration-500">
                      {categories.find(c => c.value === activity.category)?.icon} {activity.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {activity.rating}
                    </div>
                  </div>

                  {/* Activity Info Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-base sm:text-lg mb-1">{activity.name}</h3>
                    <p className="text-white/90 text-xs sm:text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {activity.location}
                    </p>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4">
                  {/* Activity Details */}
                  <p className="text-gray-600 dark:text-gray-300 mb-3 text-xs sm:text-sm leading-relaxed line-clamp-2 transition-colors duration-500">
                    {activity.description}
                  </p>
                  
                  {/* Activity Info */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{activity.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{activity.price}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{activity.maxGroupSize}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>{activity.rating}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                    {activity.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full transition-colors duration-500"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleLike(activity.id); }}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                      >
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{activity.likes}</span>
                      </button>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{activity.reviews}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-500">
                      {activity.createdAt}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3 sm:space-y-4">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                whileHover={{ x: 2 }}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => openActivityDetails(activity)}
              >
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* Activity Image */}
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full sm:w-32 h-32 rounded-lg sm:rounded-xl object-cover flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        {/* Activity Title and Category */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-1 transition-colors duration-500">{activity.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-500">{activity.location}</p>
                          </div>
                          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full font-medium ml-2 transition-colors duration-500">
                            {categories.find(c => c.value === activity.category)?.icon} {activity.category}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm transition-colors duration-500">{activity.description}</p>
                        
                        {/* Activity Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{activity.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{activity.price}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{activity.maxGroupSize}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{activity.rating}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {activity.tags.slice(0, 4).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full transition-colors duration-500"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col items-end space-y-2 sm:space-y-3">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleLike(activity.id); }}
                            className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                            <span>{activity.likes}</span>
                          </button>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{activity.reviews}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-500">
                          {activity.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {filteredActivities.length === 0 && (
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-500">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-4 sm:mb-6">🎯</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-500">No activities found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto transition-colors duration-500 text-sm sm:text-base">
              Try adjusting your search criteria or filters to find more activities
            </p>
            <button 
              onClick={clearFilters}
              className="bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-purple-700 transition-colors text-sm sm:text-base"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Activity Details Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={closeActivityDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl max-w-2xl sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedActivity.image}
                      alt={selectedActivity.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white transition-colors duration-500">{selectedActivity.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">{selectedActivity.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeActivityDetails}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6">
                {/* Activity Image */}
                <div className="mb-4 sm:mb-6">
                  <img
                    src={selectedActivity.image}
                    alt={selectedActivity.name}
                    className="w-full h-48 sm:h-64 object-cover rounded-xl"
                  />
                </div>

                {/* Activity Details */}
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-500">{selectedActivity.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-500">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedActivity.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{selectedActivity.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{selectedActivity.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{selectedActivity.maxGroupSize}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{selectedActivity.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-500">{selectedActivity.description}</p>
                </div>

                {/* Tags */}
                {selectedActivity.tags.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-500">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full transition-colors duration-500"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleLike(selectedActivity.id)}
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
                  >
                    Like Activity
                  </button>
                  <button
                    onClick={() => {/* Add to itinerary logic */}}
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm sm:text-base"
                  >
                    Add to Itinerary
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ActivitySearch;