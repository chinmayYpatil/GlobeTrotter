import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { Camera, Calendar, FileText, MapPin, DollarSign } from 'lucide-react';

const CreateTrip = () => {
  const navigate = useNavigate();
  const { createTrip } = useTrips();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    coverImage: '',
    budget: { total: 0 } // Add budget to form state
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newTrip = await createTrip({
        ...formData,
        budget: { total: Number(formData.budget.total) || 0 }
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
      setFormData({ ...formData, budget: { total: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
        className="max-w-2xl mx-auto"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget ($)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input type="number" name="budget" value={formData.budget.total} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., 2500" />
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

            {/* Description */}
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