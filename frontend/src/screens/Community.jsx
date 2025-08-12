import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import {
  Search, Filter, Grid3X3, List, SlidersHorizontal, Heart, Share2, MessageCircle, MapPin,
  Calendar, Star, DollarSign, Users, Plus, Globe, TrendingUp, Clock, Eye, X, Image as ImageIcon
} from 'lucide-react';
import communityService from '../services/communityService';
import LoadingSpinner from '../components/LoadingSpinner';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [filters, setFilters] = useState({ category: 'all', sortBy: 'latest' });

  // State for the share form, including image handling
  const [shareForm, setShareForm] = useState({
    title: '', content: '', category: 'adventure', location: '',
    duration: '', cost: '', rating: 5, tags: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState('');


  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const params = { searchQuery, ...filters };
      const result = await communityService.getPosts(params);
      if (result.success) setPosts(result.data);
      setLoading(false);
    };
    fetchPosts();
  }, [searchQuery, filters]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleShareExperience = async () => {
    setFormError('');
    let imageUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop"; // Default image
    
    // 1. Upload image if selected
    if (selectedImage) {
      const imageResult = await communityService.uploadPostImage(selectedImage);
      if (imageResult.success) {
        imageUrl = imageResult.data.imageUrl;
      } else {
        setFormError('Image upload failed: ' + imageResult.error);
        return;
      }
    }

    // 2. Create the post with the image URL
    const postData = {
      ...shareForm,
      images: [imageUrl], // Backend expects an array of images
      tags: shareForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    
    const result = await communityService.createPost(postData);
    if (result.success) {
      setPosts([result.data, ...posts]);
      setShowShareModal(false);
      // Reset form state
      setShareForm({ title: '', content: '', category: 'adventure', location: '', duration: '', cost: '', rating: 5, tags: '' });
      setSelectedImage(null);
      setImagePreview(null);
    } else {
      setFormError('Failed to create post: ' + result.error);
    }
  };

  const handleLike = async (postId) => {
    const result = await communityService.likePost(postId);
    if (result.success) {
      const updateLikes = (p) => p.id === postId ? { ...p, likes: result.data.likes } : p;
      setPosts(posts.map(updateLikes));
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => ({ ...prev, likes: result.data.likes }));
      }
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !selectedPost) return;
    const result = await communityService.createComment(selectedPost.id, { content: commentText });
    if (result.success) {
      const newComment = result.data;
      const updateComments = (p) => p.id === selectedPost.id ? { ...p, Comments: [...(p.Comments || []), newComment] } : p;
      setPosts(posts.map(updateComments));
      setSelectedPost(prev => ({ ...prev, Comments: [...(prev.Comments || []), newComment] }));
      setCommentText('');
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🌟' }, { value: 'adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'cultural', label: 'Cultural', icon: '🏛️' }, { value: 'historical', label: 'Historical', icon: '📚' },
    { value: 'leisure', label: 'Leisure', icon: '🌅' }, { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' }
  ];
  const sortOptions = [
    { value: 'latest', label: 'Latest Posts' }, { value: 'popular', label: 'Most Popular' }, { value: 'views', label: 'Most Viewed' }
  ];

  const openEnlargedPost = (post) => setSelectedPost(post);
  const closeEnlargedPost = () => setSelectedPost(null);

  const sharePost = (post) => {
    if (navigator.share) {
      navigator.share({ title: post.tripName, text: post.content, url: window.location.href });
    } else {
      navigator.clipboard.writeText(`${post.tripName}: ${post.content}`);
      alert('Post link copied to clipboard!');
    }
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

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
            <p className="text-purple-100 text-sm sm:text-xl max-w-2xl mx-auto">
              Share your travel experiences, discover amazing destinations, and connect with fellow adventurers from around the world
            </p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5 sm:h-6 sm:w-6" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences, destinations, or travelers..."
              className="w-full pl-12 sm:pl-12 pr-4 py-3 sm:py-4 text-gray-900 text-base sm:text-lg border-0 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50"
            />
          </div>
        </motion.div>

        {/* Controls Bar */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  showFilters 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500 text-sm sm:text-base"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-gray-400 hover:text-gray-600'
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
                className="mt-6 pt-6 border-t border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
          <h2 className="text-2xl font-bold text-gray-900">
            Community Experiences ({filteredPosts.length})
          </h2>
          <div className="text-sm text-gray-500">
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
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer"
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
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
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
                      <h4 className="font-semibold text-gray-900">{post.user.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {post.user.location}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                  
                  {/* Trip Details */}
                  <div className="grid grid-cols-3 gap-3 mb-4 text-xs text-gray-500">
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
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                    <div className="text-xs text-gray-400">
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
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
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
                            <h4 className="font-semibold text-gray-900">{post.user.name}</h4>
                            <p className="text-sm text-gray-500">{post.user.location}</p>
                          </div>
                        </div>

                        {/* Trip Title */}
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{post.trip.name}</h3>
                        <p className="text-gray-600 mb-3">{post.content}</p>
                        
                        {/* Trip Details */}
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
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
                              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col items-end space-y-3">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                        <div className="text-xs text-gray-400">
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
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-lg">
            <div className="text-gray-400 text-8xl mb-6">🌍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No experiences found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
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
      
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Trip Title *</label>
                  <input
                    type="text"
                    value={shareForm.title}
                    onChange={(e) => setShareForm({ ...shareForm, title: e.target.value })}
                    placeholder="e.g., Amazing Adventure in the Alps"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Your Experience *</label>
                  <textarea
                    value={shareForm.content}
                    onChange={(e) => setShareForm({ ...shareForm, content: e.target.value })}
                    placeholder="Share the details of your amazing trip..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500"
                  />
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Category</label>
                    <select
                      value={shareForm.category}
                      onChange={(e) => setShareForm({ ...shareForm, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
                    >
                      {categories.slice(1).map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Location</label>
                    <input
                      type="text"
                      value={shareForm.location}
                      onChange={(e) => setShareForm({ ...shareForm, location: e.target.value })}
                      placeholder="e.g., Paris, France"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Duration</label>
                    <input
                      type="text"
                      value={shareForm.duration}
                      onChange={(e) => setShareForm({ ...shareForm, duration: e.target.value })}
                      placeholder="e.g., 5 days"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Cost</label>
                    <input
                      type="text"
                      value={shareForm.cost}
                      onChange={(e) => setShareForm({ ...shareForm, cost: e.target.value })}
                      placeholder="e.g., $2,500"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star} type="button" onClick={() => setShareForm({ ...shareForm, rating: star })}
                        className={`text-2xl ${star <= shareForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">{shareForm.rating}/5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Tags (comma-separated)</label>
                  <input
                    type="text" value={shareForm.tags} onChange={(e) => setShareForm({ ...shareForm, tags: e.target.value })}
                    placeholder="e.g., adventure, mountains, hiking, europe"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
      
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                    <img src={selectedPost.User.photo} alt={selectedPost.User.displayName} className="w-12 h-12 rounded-full object-cover"/>
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
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-500">{selectedPost.content}</p>
                </div>

                {selectedPost.images.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedPost.images.map((image, index) => (
                        <img key={index} src={image} alt={`${selectedPost.tripName} ${index + 1}`} className="w-full h-48 object-cover rounded-xl"/>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPost.tags.length > 0 && (
                  <div className="mb-4 sm:mb-6">
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
                    <button onClick={() => handleLike(selectedPost.id)} className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                      <Heart className="h-5 w-5" /><span className="font-medium">{selectedPost.likes}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-medium">{selectedPost.comments?.length || 0}</span>
                    </div>
                    <button onClick={() => sharePost(selectedPost)} className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                      <Share2 className="h-5 w-5" /><span className="font-medium">Share</span>
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
                  <div className="space-y-4">
                    {selectedPost.Comments?.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <img src={comment.User.photo} alt={comment.User.displayName} className="w-8 h-8 rounded-full object-cover"/>
                        <div className="flex-1">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 transition-colors duration-500">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-sm text-gray-900">{comment.user.name}</span>
                              <span className="text-xs text-gray-400">{comment.createdAt}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-500">{comment.content}</p>
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