import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Calendar, DollarSign, Users, Sparkles, Loader2, AlertCircle } from 'lucide-react';

// Assuming these are defined elsewhere in the project
const Layout = ({ children }) => <div className="bg-gray-100 min-h-screen font-sans">{children}</div>;
const AIGenerationLoader = ({ message }) => <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 text-white z-50">{message}</div>;
const useAuth = () => ({ user: { uid: 'mock-user-123' } });
const useTrips = () => ({ addTrip: (trip) => console.log('Trip added:', trip) });
const generateAITrip = (data) => new Promise(resolve => setTimeout(() => resolve({ success: true, trip: { id: Date.now(), ...data } }), 2000));

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

  // --- NEW LOGIC: Update endDate automatically ---
  useEffect(() => {
    // This effect runs whenever startDate or noOfDays changes
    const { startDate, noOfDays } = formData;
    
    // Check if both fields are filled before calculating
    if (startDate && noOfDays) {
      const start = new Date(startDate);
      // Add the number of days to the start date. 
      // We subtract 1 because the trip starts on day 1.
      start.setDate(start.getDate() + parseInt(noOfDays) - 1);
      
      const yyyy = start.getFullYear();
      const mm = String(start.getMonth() + 1).padStart(2, '0');
      const dd = String(start.getDate()).padStart(2, '0');
      
      const newEndDate = `${yyyy}-${mm}-${dd}`;
      
      // Update the formData state with the new end date
      setFormData(prev => ({
        ...prev,
        endDate: newEndDate,
      }));
    }
  }, [formData.startDate, formData.noOfDays]);
  // --- END OF NEW LOGIC ---

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
    // The min attribute on the input field handles the past date check,
    // but this is a good redundant check for robustness.
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
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await generateAITrip(formData);
      
      if (result.success && result.trip) {
        addTrip(result.trip);
        // navigate(`/trip/${result.trip.id}/view`); // Uncomment to navigate in a real app
      } else {
        setError(result.error || 'Failed to generate trip. The AI might be busy, please try again.');
      }
    } catch (err) {
      console.error('Error generating trip:', err);
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
                <option value="">Select a destination in Gujarat</option>
                {[
                  "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
                  "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar",
                  "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana",
                  "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
                  "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
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
                    value={formData.noOfDays} // Binds the input to state
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                  />
              </div>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  min={getTodayDate()} // --- NEW: Disables past dates ---
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.endDate}
                  readOnly // --- NEW: Prevents manual editing ---
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="What's your travel style?">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[{val: 'cheap', icon: '💵', title: 'Budget'}, {val: 'moderate', icon: '💰', title: 'Moderate'}, {val: 'luxury', icon: '💸', title: 'Luxury'}].map(item => (
                    <div key={item.val} onClick={() => handleInputChange('budget', item.val)}
                        className={`p-6 text-center rounded-2xl border-2 cursor-pointer transition-all ${formData.budget === item.val ? 'bg-blue-500 text-white border-blue-500 shadow-lg' : 'bg-gray-50 hover:bg-white hover:border-blue-300'}`}>
                        <span className="text-4xl">{item.icon}</span>
                        <h4 className="text-xl font-semibold mt-2">{item.title}</h4>
                    </div>
                ))}
             </div>
          </FormSection>

          <FormSection title="Who are you traveling with?">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[{val: '1 people', icon: '✈️', title: 'Just Me'}, {val: '2 people', icon: '🥂', title: 'A Couple'}, {val: '3 to 5 people', icon: '🏡', title: 'Family'}, {val: '5 to 10 people', icon: '⛵', title: 'Friends'}].map(item => (
                    <div key={item.val} onClick={() => handleInputChange('traveler', item.val)}
                        className={`p-6 text-center rounded-2xl border-2 cursor-pointer transition-all ${formData.traveler === item.val ? 'bg-teal-500 text-white border-teal-500 shadow-lg' : 'bg-gray-50 hover:bg-white hover:border-teal-300'}`}>
                        <span className="text-4xl">{item.icon}</span>
                        <h4 className="text-xl font-semibold mt-2">{item.title}</h4>
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
              <AlertCircle className="h-5 w-5 mr-3" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Generate Button */}
          <div className="mt-12 flex justify-center">
            <motion.button 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-4 px-12 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center space-x-3"
              onClick={OnGenerateTrip}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? <Loader2 className='h-7 w-7 animate-spin'/> : <Sparkles className="h-6 w-6" />}
              <span>Generate My Trip</span>
            </motion.button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuildTripAI;