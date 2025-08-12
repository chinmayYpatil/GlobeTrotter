import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { Plane, Calendar, DollarSign, Save, Loader2, Edit } from 'lucide-react';

const CreateTrip = () => {
  const navigate = useNavigate();
  const { createTrip } = useTrips();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: {
      total: 0,
    },
    coverImage: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Default image
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBudgetChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      budget: { total: parseFloat(value) || 0 }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newTrip = await createTrip(formData);
      if (newTrip) {
        navigate(`/trip/${newTrip.id}/build`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create a New Trip" showBack={true} backTo="/">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4 sm:px-0"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Trip</h1>
            <p className="text-gray-600">Let's start planning your next adventure</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
            
            {/* Trip Name and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trip Name *</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., European Adventure" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget</label>
                    <div className="space-y-2">
                        {/* Currency Selection */}
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => handleCurrencyChange('USD')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                    formData.budget.currency === 'USD'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                INR
                            </button>
                            <button
                                type="button"
                                onClick={fetchExchangeRate}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Refresh exchange rate"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        </div>
                        
                        {/* Budget Input */}
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                                {formData.budget.currency === 'USD' ? '$' : '₹'}
                            </span>
                            <input 
                                type="number" 
                                name="budget" 
                                value={formData.budget.total} 
                                onChange={handleChange} 
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                placeholder={formData.budget.currency === 'USD' ? 'e.g., 2500' : 'e.g., 208750'} 
                                min="0"
                                step="0.01"
                            />
                        </div>
                        
                        {/* Converted Amount Display */}
                        {formData.budget.total && convertedAmount && (
                            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                <span className="font-medium">
                                    {formatCurrency(formData.budget.total, formData.budget.currency)} = 
                                    {formData.budget.currency === 'USD' 
                                        ? ` ₹${convertedAmount}` 
                                        : ` $${convertedAmount}`
                                    }
                                </span>
                                <div className="text-xs text-gray-500 mt-1">
                                    Exchange Rate: 1 USD = ₹{exchangeRate.toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input type="date" name="endDate" required value={formData.endDate} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Tell us about your trip..." />
            </div>

            {/* Cover Image */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <p className="text-sm text-gray-600 mb-3">Choose from suggestions:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {suggestedImages.map((imageUrl, index) => (
                    <motion.button key={index} type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, coverImage: imageUrl })}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            formData.coverImage === imageUrl ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200 hover:border-gray-300'
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
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all disabled:opacity-50"
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