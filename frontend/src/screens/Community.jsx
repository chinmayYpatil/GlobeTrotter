import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  Heart,
  Share2,
  MessageCircle,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  Users,
  Plus,
  Globe,
  TrendingUp,
  Clock,
  Eye,
  X
} from 'lucide-react';

const Community = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    location: 'all',
    rating: 'all',
    sortBy: 'latest'
  });

  // Share experience form state
  const [shareForm, setShareForm] = useState({
    title: '',
    content: '',
    category: 'adventure',
    location: '',
    duration: '',
    cost: '',
    rating: 5,
    tags: '',
    images: []
  });

  // Mock community posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: "Calm Hippopotamus",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        location: "New York, USA"
      },
      content: "Just completed an amazing paragliding adventure in the Swiss Alps! The views were absolutely breathtaking and the experience was worth every penny. Highly recommend for adventure seekers!",
      trip: {
        name: "Swiss Alps Adventure",
        location: "Interlaken, Switzerland",
        duration: "5 days",
        cost: "$2,500",
        rating: 4.9
      },
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop"
      ],
      category: "adventure",
      likes: 127,
      comments: [{ id: 1, user: { name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }, content: 'Wow, looks amazing!', createdAt: '2 days ago' }],
      shares: 8,
      views: 1247,
      createdAt: "2 days ago",
      tags: ["paragliding", "switzerland", "mountains", "adventure"]
    },
    {
      id: 2,
      user: {
        name: "Adventurous Explorer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        location: "London, UK"
      },
      content: "Cultural immersion in Japan was incredible! From traditional tea ceremonies to modern Tokyo, every moment was filled with wonder. The food, the people, the history - everything exceeded expectations.",
      trip: {
        name: "Japan Cultural Journey",
        location: "Tokyo & Kyoto, Japan",
        duration: "12 days",
        cost: "$3,800",
        rating: 4.8
      },
      images: [
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=500&h=300&fit=crop"
      ],
      category: "cultural",
      likes: 89,
      comments: [],
      shares: 12,
      views: 892,
      createdAt: "1 week ago",
      tags: ["japan", "culture", "tokyo", "kyoto", "food"]
    },
    {
      id: 3,
      user: {
        name: "Beach Lover",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        location: "Sydney, Australia"
      },
      content: "Relaxing beach vacation in Bali was exactly what I needed. Crystal clear waters, amazing sunsets, and the most peaceful atmosphere. Perfect for unwinding and reconnecting with nature.",
      trip: {
        name: "Bali Beach Retreat",
        location: "Ubud & Seminyak, Bali",
        duration: "8 days",
        cost: "$1,900",
        rating: 4.7
      },
      images: [
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop"
      ],
      category: "leisure",
      likes: 156,
      comments: [],
      shares: 19,
      views: 1567,
      createdAt: "3 days ago",
      tags: ["bali", "beach", "relaxation", "nature", "sunset"]
    },
    {
      id: 4,
      user: {
        name: "History Buff",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        location: "Rome, Italy"
      },
      content: "Exploring the ancient ruins of Rome was like stepping back in time. The Colosseum, Forum, and Pantheon tell such incredible stories. Every corner holds a piece of history waiting to be discovered.",
      trip: {
        name: "Roman Empire Tour",
        location: "Rome, Italy",
        duration: "6 days",
        cost: "$2,200",
        rating: 4.9
      },
      images: [
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop"
      ],
      category: "historical",
      likes: 203,
      comments: [],
      shares: 25,
      views: 2134,
      createdAt: "5 days ago",
      tags: ["rome", "history", "ancient", "colosseum", "culture"]
    },
    {
      id: 5,
      user: {
        name: "Foodie Traveler",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        location: "Bangkok, Thailand"
      },
      content: "Street food adventure in Bangkok was absolutely incredible! From pad thai to mango sticky rice, every bite was a flavor explosion. The night markets are a must-visit for any food lover.",
      trip: {
        name: "Thai Food Safari",
        location: "Bangkok, Thailand",
        duration: "4 days",
        cost: "$1,200",
        rating: 4.6
      },
      images: [
        "https://images.unsplash.com/photo-1504674900240-9c9c0c1c0c0c?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop"
      ],
      category: "food",
      likes: 134,
      comments: [],
      shares: 16,
      views: 1123,
      createdAt: "1 day ago",
      tags: ["thailand", "food", "street-food", "bangkok", "culinary"]
    },
    {
      id: 6,
      user: {
        name: "Mountain Climber",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        location: "Denver, USA"
      },
      content: "Summited Mount Kilimanjaro! The 7-day trek was challenging but the sense of accomplishment at the top was indescribable. The views of the African plains from 19,341 feet are absolutely breathtaking.",
      trip: {
        name: "Kilimanjaro Summit",
        location: "Tanzania, Africa",
        duration: "10 days",
        cost: "$4,500",
        rating: 5.0
      },
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop"
      ],
      category: "adventure",
      likes: 298,
      comments: [],
      shares: 34,
      views: 3245,
      createdAt: "4 days ago",
      tags: ["kilimanjaro", "climbing", "africa", "summit", "challenge"]
    }
  ]);

  const [filteredPosts, setFilteredPosts] = useState(posts);

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🌟' },
    { value: 'adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'cultural', label: 'Cultural', icon: '🏛️' },
    { value: 'historical', label: 'Historical', icon: '📚' },
    { value: 'leisure', label: 'Leisure', icon: '🌅' },
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' }
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest Posts' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'views', label: 'Most Viewed' }
  ];

  useEffect(() => {
    filterPosts();
  }, [searchQuery, filters, posts]);

  const filterPosts = () => {
    let filtered = posts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = filters.category === 'all' || post.category === filters.category;
      const matchesLocation = filters.location === 'all' || post.trip.location.includes(filters.location);
      const matchesRating = filters.rating === 'all' || post.trip.rating >= parseFloat(filters.rating);
      
      return matchesSearch && matchesCategory && matchesLocation && matchesRating;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'rating':
        filtered.sort((a, b) => b.trip.rating - a.trip.rating);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        // Keep latest order
        break;
    }

    setFilteredPosts(filtered);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      location: 'all',
      rating: 'all',
      sortBy: 'latest'
    });
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleShareExperience = () => {
    const newPost = {
      id: posts.length + 1,
      user: {
        name: user?.name || "Anonymous Traveler",
        avatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        location: user?.location || "Unknown Location"
      },
      content: shareForm.content,
      trip: {
        name: shareForm.title,
        location: shareForm.location,
        duration: shareForm.duration,
        cost: shareForm.cost,
        rating: shareForm.rating
      },
      images: shareForm.images.length > 0 ? shareForm.images : ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop"],
      category: shareForm.category,
      likes: 0,
      comments: [],
      shares: 0,
      views: 0,
      createdAt: "Just now",
      tags: shareForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setPosts([newPost, ...posts]);
    setShowShareModal(false);
    setShareForm({
      title: '',
      content: '',
      category: 'adventure',
      location: '',
      duration: '',
      cost: '',
      rating: 5,
      tags: '',
      images: []
    });
  };

  const handleComment = () => {
    if (!commentText.trim() || !selectedPost) return;

    const newComment = {
      id: Date.now(),
      user: {
        name: user?.name || "Anonymous",
        avatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      content: commentText,
      createdAt: "Just now"
    };

    setPosts(posts.map(post => 
      post.id === selectedPost.id 
        ? { ...post, comments: [...(post.comments || []), newComment] }
        : post
    ));
    
    setSelectedPost(prev => ({...prev, comments: [...(prev.comments || []), newComment]}));
    setCommentText('');
  };

  const openEnlargedPost = (post) => {
    setSelectedPost(post);
  };
  
  const closeEnlargedPost = () => {
    setSelectedPost(null);
  }

  const sharePost = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.trip.name,
        text: post.content,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${post.trip.name}: ${post.content}`);
      alert('Post link copied to clipboard!');
    }
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
    <Layout title="Community" showBack={false}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Community Header */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Globe className="h-12 w-12 mr-3" />
              <h1 className="text-4xl font-bold">GlobalTrotter Community</h1>
            </div>
            <p className="text-purple-100 text-xl max-w-2xl mx-auto">
              Share your travel experiences, discover amazing destinations, and connect with fellow adventurers from around the world
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-6 w-6" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences, destinations, or travelers..."
              className="w-full pl-12 pr-4 py-4 text-gray-900 text-lg border-0 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50"
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
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
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
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
                    >
                      <option value="all">All Locations</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="Africa">Africa</option>
                      <option value="Americas">Americas</option>
                      <option value="Oceania">Oceania</option>
                    </select>
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
            Community Experiences ({filteredPosts.length})
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
            Showing {filteredPosts.length} of {posts.length} experiences
          </div>
        </motion.div>

        {/* Community Posts Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => openEnlargedPost(post)}
              >
                {/* Post Images */}
                <div className="h-48 relative overflow-hidden group">
                  <img
                    src={post.images[0]}
                    alt={post.trip.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 dark:text-white transition-colors duration-500">
                      {categories.find(c => c.value === post.category)?.icon} {post.category}
                    </span>
                  </div>

                  {/* Trip Rating */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {post.trip.rating}
                    </div>
                  </div>

                  {/* Trip Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1">{post.trip.name}</h3>
                    <p className="text-white/90 text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {post.trip.location}
                    </p>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">{post.user.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center transition-colors duration-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {post.user.location}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3 transition-colors duration-500">
                    {post.content}
                  </p>
                  
                  {/* Trip Details */}
                  <div className="grid grid-cols-3 gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.trip.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{post.trip.cost}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>{post.trip.rating}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
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
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </button>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments?.length || 0}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sharePost(post);
                        }}
                        className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-500">
                      {post.createdAt}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => openEnlargedPost(post)}
              >
                <div className="flex items-start space-x-6">
                  {/* Post Image */}
                  <img
                    src={post.images[0]}
                    alt={post.trip.name}
                    className="w-32 h-32 rounded-xl object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        {/* User Info */}
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={post.user.avatar}
                            alt={post.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">{post.user.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">{post.user.location}</p>
                          </div>
                        </div>

                        {/* Trip Title */}
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 transition-colors duration-500">{post.trip.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-500">{post.content}</p>
                        
                        {/* Trip Details */}
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{post.trip.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{post.trip.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{post.trip.cost}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{post.trip.rating}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 4).map((tag, index) => (
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
                      <div className="flex flex-col items-end space-y-3">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                            className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </button>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments?.length || 0}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sharePost(post);
                            }}
                            className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                          >
                            <Share2 className="h-4 w-4" />
                            <span>{post.shares}</span>
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-500">
                          {post.createdAt}
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
        {filteredPosts.length === 0 && (
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-500">
            <div className="text-gray-400 text-8xl mb-6">🌍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">No experiences found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto transition-colors duration-500">
              Try adjusting your search criteria or filters to find more community experiences
            </p>
            <button 
              onClick={clearFilters}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Share Experience CTA */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Share Your Experience!</h3>
          <p className="text-purple-100 mb-6 max-w-md mx-auto">
            Have an amazing trip story? Share it with the GlobalTrotter community and inspire others to explore the world.
          </p>
          <button 
            className="bg-white text-purple-600 px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors font-semibold flex items-center space-x-2 mx-auto"
            onClick={() => setShowShareModal(true)}
          >
            <Plus className="h-5 w-5" />
            <span>Share Experience</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Share Experience Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Share Your Experience</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Trip Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title *</label>
                  <input
                    type="text"
                    value={shareForm.title}
                    onChange={(e) => setShareForm({ ...shareForm, title: e.target.value })}
                    placeholder="e.g., Amazing Adventure in the Alps"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Experience Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience *</label>
                  <textarea
                    value={shareForm.content}
                    onChange={(e) => setShareForm({ ...shareForm, content: e.target.value })}
                    placeholder="Share the details of your amazing trip..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={shareForm.category}
                      onChange={(e) => setShareForm({ ...shareForm, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={shareForm.location}
                      onChange={(e) => setShareForm({ ...shareForm, location: e.target.value })}
                      placeholder="e.g., Paris, France"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={shareForm.duration}
                      onChange={(e) => setShareForm({ ...shareForm, duration: e.target.value })}
                      placeholder="e.g., 5 days"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                    <input
                      type="text"
                      value={shareForm.cost}
                      onChange={(e) => setShareForm({ ...shareForm, cost: e.target.value })}
                      placeholder="e.g., $2,500"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setShareForm({ ...shareForm, rating: star })}
                        className={`text-2xl ${star <= shareForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{shareForm.rating}/5</span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={shareForm.tags}
                    onChange={(e) => setShareForm({ ...shareForm, tags: e.target.value })}
                    placeholder="e.g., adventure, mountains, hiking, europe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleShareExperience}
                    disabled={!shareForm.title || !shareForm.content}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Share Experience
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enlarged Post View */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={closeEnlargedPost}
          >
            <motion.div
              layoutId={`post-${selectedPost.id}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedPost.user.avatar}
                      alt={selectedPost.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{selectedPost.user.name}</h3>
                      <p className="text-sm text-gray-500">{selectedPost.user.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeEnlargedPost}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Trip Title and Details */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedPost.trip.name}</h2>
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedPost.trip.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{selectedPost.trip.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{selectedPost.trip.cost}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{selectedPost.trip.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedPost.content}</p>
                </div>

                {/* Images */}
                {selectedPost.images.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPost.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedPost.trip.name} ${index + 1}`}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedPost.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(selectedPost.id)}
                      className="flex items-center space-x-2 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="font-medium">{selectedPost.likes}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-medium">{selectedPost.comments?.length || 0}</span>
                    </div>
                    <button
                      onClick={() => sharePost(selectedPost)}
                      className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="font-medium">Share</span>
                    </button>
                  </div>
                  <span className="text-sm text-gray-400">{selectedPost.createdAt}</span>
                </div>

                {/* Comments Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Comments</h4>
                  
                  {/* Comment Input */}
                  <div className="flex space-x-3 mb-6">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                      alt="Your avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleComment}
                          disabled={!commentText.trim()}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {selectedPost.comments?.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-sm text-gray-900">{comment.user.name}</span>
                              <span className="text-xs text-gray-400">{comment.createdAt}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!selectedPost.comments || selectedPost.comments.length === 0) && (
                      <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Community;