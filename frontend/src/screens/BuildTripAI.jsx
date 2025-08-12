import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Calendar, DollarSign, Users, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import AIGenerationLoader from '../components/AIGenerationLoader';
import { useAuth } from '../contexts/AuthContext';
import { useTrips } from '../contexts/TripContext';
import { generateAITrip } from '../services/aiTripService';

// A reusable component for each section of the form
const FormSection = ({ title, children }) => (
  <motion.div
    className="mb-10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h3>
    {children}
  </motion.div>
);

const BuildTripAI = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addTrip } = useTrips();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    destination: '',
    noOfDays: '',
    budget: '',
    traveler: '',
    startDate: '',
    endDate: ''
  });

  // Get today's date in YYYY-MM-DD format for the date input's min attribute
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Update endDate automatically when startDate or noOfDays changes
  useEffect(() => {
    const { startDate, noOfDays } = formData;
    
    if (startDate && noOfDays) {
      const start = new Date(startDate);
      // Add the number of days to the start date. 
      // We subtract 1 because the trip starts on day 1.
      start.setDate(start.getDate() + parseInt(noOfDays) - 1);
      
      const yyyy = start.getFullYear();
      const mm = String(start.getMonth() + 1).padStart(2, '0');
      const dd = String(start.getDate()).padStart(2, '0');
      
      const newEndDate = `${yyyy}-${mm}-${dd}`;
      
      setFormData(prev => ({
        ...prev,
        endDate: newEndDate,
      }));
    }
  }, [formData.startDate, formData.noOfDays]);

  const handleInputChange = (field, value) => {
    setError(''); // Clear error on new input
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.destination || !formData.noOfDays || !formData.budget || !formData.traveler || !formData.startDate || !formData.endDate) {
      setError('Please fill in all fields to generate your trip.');
      return false;
    }
    if (!user) {
      setError('You must be logged in to generate a trip.');
      return false;
    }
    // Check if start date is not in the past
    const startDate = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      setError('Start date cannot be in the past.');
      return false;
    }
    return true;
  };

  const OnGenerateTrip = async () => {
    console.log('Generate trip button clicked'); // Debug log
    
    if (!validateForm()) {
      console.log('Form validation failed'); // Debug log
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Sending trip data to backend:', formData); // Debug log
      
      // Call the actual backend service
      const result = await generateAITrip(formData);
      
      console.log('Backend response:', result); // Debug log
      
      if (result.success && result.trip) {
        console.log('Trip generated successfully:', result.trip); // Debug log
        
        // Add the trip to the context
        if (addTrip) {
          addTrip(result.trip);
        }
        
        // Navigate to the trip view page
        navigate(`/trip/${result.trip.id}/view`);
      } else {
        console.error('Trip generation failed:', result.error); // Debug log
        setError(result.error || 'Failed to generate trip. The AI might be busy, please try again.');
      }
    } catch (err) {
      console.error('Error generating trip:', err); // Debug log
      setError('An unexpected error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="AI Trip Generator">
      {loading && <AIGenerationLoader message="Our AI is crafting your perfect itinerary..." />}
      
      <div className="max-w-4xl mx-auto py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div 
            className="inline-block bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-2xl mb-4"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Plan Your Trip with AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Provide your preferences, and our AI will generate a personalized itinerary just for you.
          </p>
        </div>

        {/* Form Sections */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <FormSection title="Where are you dreaming of?">
            <div className="relative">
              <Plane className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select your destination</option>
                {[
                  "France", "Spain", "United States", "China", "Italy", "Turkey", "Mexico",
                  "Thailand", "Germany", "United Kingdom", "India", "Japan", "Austria",
                  "Malaysia", "Greece", "Russia", "Singapore", "South Korea", "Indonesia", "Canada",
                  "Australia", "Portugal", "Netherlands", "United Arab Emirates (UAE)", "Poland", "Switzerland", "Hungary",
                  "Egypt", "Vietnam", "Brazil", "Israel", "Saudi Arabia", "Sweden", "New Zealand", "South Africa", "Ireland", "Belgium"
                ].map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </FormSection>

          <FormSection title="How long is your getaway?">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative md:col-span-1">
                 <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                 <input
                    type="number"
                    id="noOfDays"
                    placeholder="e.g., 3"
                    min="1"
                    max="30"
                    value={formData.noOfDays}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                  />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  min={getTodayDate()}
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  value={formData.endDate}
                  readOnly
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="What's your travel style?">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {val: 'cheap', icon: '💵', title: 'Budget', desc: 'Save money, explore more'},
                  {val: 'moderate', icon: '💰', title: 'Moderate', desc: 'Balance comfort & cost'},
                  {val: 'luxury', icon: '💸', title: 'Luxury', desc: 'Premium experiences'}
                ].map(item => (
                    <div 
                      key={item.val} 
                      onClick={() => handleInputChange('budget', item.val)}
                      className={`p-6 text-center rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${
                        formData.budget === item.val 
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg' 
                          : 'bg-gray-50 hover:bg-white hover:border-blue-300'
                      }`}
                    >
                        <span className="text-4xl mb-2 block">{item.icon}</span>
                        <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                        <p className={`text-sm ${formData.budget === item.val ? 'text-blue-100' : 'text-gray-500'}`}>
                          {item.desc}
                        </p>
                    </div>
                ))}
             </div>
          </FormSection>

          <FormSection title="Who are you traveling with?">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {val: '1 people', icon: '✈️', title: 'Just Me', desc: 'Solo adventure'},
                  {val: '2 people', icon: '🥂', title: 'A Couple', desc: 'Romantic getaway'},
                  {val: '3 to 5 people', icon: '🏡', title: 'Family', desc: 'Family fun'},
                  {val: '5 to 10 people', icon: '⛵', title: 'Friends', desc: 'Group adventure'}
                ].map(item => (
                    <div 
                      key={item.val} 
                      onClick={() => handleInputChange('traveler', item.val)}
                      className={`p-6 text-center rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${
                        formData.traveler === item.val 
                          ? 'bg-teal-500 text-white border-teal-500 shadow-lg' 
                          : 'bg-gray-50 hover:bg-white hover:border-teal-300'
                      }`}
                    >
                        <span className="text-4xl mb-2 block">{item.icon}</span>
                        <h4 className="text-xl font-semibold mb-1">{item.title}</h4>
                        <p className={`text-sm ${formData.traveler === item.val ? 'text-teal-100' : 'text-gray-500'}`}>
                          {item.desc}
                        </p>
                    </div>
                ))}
            </div>
          </FormSection>
          
          {/* Error Display */}
          {error && (
            <motion.div 
              className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg flex items-center mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Generate Button */}
          <div className="mt-12 flex justify-center">
            <motion.button 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-4 px-12 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
              onClick={OnGenerateTrip}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              {loading ? (
                <>
                  <Loader2 className='h-7 w-7 animate-spin'/>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6" />
                  <span>Generate My Trip</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Debug Info (remove in production) */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold mb-2">Debug Info:</h4>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          )} */}
        </div>
      </div>
    </Layout>
  );
};

export default BuildTripAI;