import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { Camera, Calendar, FileText, MapPin, DollarSign, RefreshCw } from 'lucide-react';

const CreateTrip = () => {
  const navigate = useNavigate();
  const { createTrip } = useTrips();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    coverImage: '',
    budget: { total: '', currency: 'USD' }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exchangeRate, setExchangeRate] = useState(83.5); // Default USD to INR rate
  const [convertedAmount, setConvertedAmount] = useState('');

  // Fetch real-time exchange rate on component mount
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      // Using a free exchange rate API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      if (data.rates && data.rates.INR) {
        setExchangeRate(data.rates.INR);
      }
    } catch (error) {
      console.log('Using default exchange rate:', exchangeRate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newTrip = await createTrip({
        ...formData,
        budget: { 
          total: Number(formData.budget.total) || 0,
          currency: formData.budget.currency
        }
      });
      navigate(`/trip/${newTrip.id}/build`);
    } catch (err) {
      setError(err.message || 'Failed to create trip. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'budget') {
      // Automatically overwrite zero and update converted amount
      const newValue = value === '0' ? '' : value;
      setFormData({ ...formData, budget: { ...formData.budget, total: newValue } });
      
      // Calculate converted amount
      if (newValue && !isNaN(newValue)) {
        if (formData.budget.currency === 'USD') {
          setConvertedAmount((parseFloat(newValue) * exchangeRate).toFixed(2));
        } else {
          setConvertedAmount((parseFloat(newValue) / exchangeRate).toFixed(2));
        }
      } else {
        setConvertedAmount('');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCurrencyChange = (currency) => {
    setFormData({ ...formData, budget: { ...formData.budget, currency } });
    
    // Recalculate converted amount when currency changes
    if (formData.budget.total && !isNaN(formData.budget.total)) {
      if (currency === 'USD') {
        setConvertedAmount((parseFloat(formData.budget.total) * exchangeRate).toFixed(2));
      } else {
        setConvertedAmount((parseFloat(formData.budget.total) / exchangeRate).toFixed(2));
      }
    }
  };

  const formatCurrency = (amount, currency) => {
    if (currency === 'USD') {
      return `$${amount}`;
    } else if (currency === 'INR') {
      return `₹${amount}`;
    }
    return amount;
  };
  
  const suggestedImages = [
    'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  return (
    <Layout title="Create New Trip" showBack={true} backTo="/">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4 sm:px-0"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 transition-colors duration-500">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">Create Your Trip</h1>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-500 text-sm sm:text-base">Let's start planning your next adventure</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg transition-colors duration-500">
                    {error}
                </div>
            )}
            
            {/* Trip Name and Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Trip Name *</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 transition-colors duration-500" />
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500" placeholder="e.g., European Adventure" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Total Budget</label>
                    <div className="space-y-2">
                        {/* Currency Selection */}
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => handleCurrencyChange('USD')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                    formData.budget.currency === 'USD'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                USD
                            </button>
                            <button
                                type="button"
                                onClick={() => handleCurrencyChange('INR')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                    formData.budget.currency === 'INR'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                INR
                            </button>
                            <button
                                type="button"
                                onClick={fetchExchangeRate}
                                className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                                title="Refresh exchange rate"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        </div>
                        
                        {/* Budget Input */}
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium transition-colors duration-500">
                                {formData.budget.currency === 'USD' ? '$' : '₹'}
                            </span>
                            <input 
                                type="number" 
                                name="budget" 
                                value={formData.budget.total} 
                                onChange={handleChange} 
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500" 
                                placeholder={formData.budget.currency === 'USD' ? 'e.g., 2500' : 'e.g., 208750'} 
                                min="0"
                                step="0.01"
                            />
                        </div>
                        
                        {/* Converted Amount Display */}
                        {formData.budget.total && convertedAmount && (
                            <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg transition-colors duration-500">
                                <span className="font-medium">
                                    {formatCurrency(formData.budget.total, formData.budget.currency)} = 
                                    {formData.budget.currency === 'USD' 
                                        ? ` ₹${convertedAmount}` 
                                        : ` $${convertedAmount}`
                                    }
                                </span>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-500">
                                    Exchange Rate: 1 USD = ₹{exchangeRate.toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Start Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 transition-colors duration-500" />
                  <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">End Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 transition-colors duration-500" />
                  <input type="date" name="endDate" required value={formData.endDate} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-500" placeholder="Tell us about your trip..." />
            </div>

            {/* Cover Image */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Cover Image</label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-500">Choose from suggestions:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {suggestedImages.map((imageUrl, index) => (
                    <motion.button key={index} type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, coverImage: imageUrl })}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            formData.coverImage === imageUrl ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                    >
                        <img src={imageUrl} alt={`Suggestion ${index + 1}`} className="w-full h-full object-cover" />
                    </motion.button>
                ))}
                </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? 'Creating Trip...' : 'Create Trip & Start Planning'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
};

export default CreateTrip;