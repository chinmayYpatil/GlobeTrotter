import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { Sparkles, MapPin, Calendar, DollarSign, Users, Search, ChevronDown, ArrowRight, Loader2 } from 'lucide-react';
import { generateAITrip, searchCities } from '../services/aiTripService';
import AIGenerationLoader from '../components/AIGenerationLoader';

const BuildTripAI = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addTrip } = useTrips();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    // Form State
    const [destination, setDestination] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [days, setDays] = useState('3-5');
    const [budget, setBudget] = useState('moderate');
    const [travelers, setTravelers] = useState('solo');

    // Debounce search
    useEffect(() => {
        if (destination.length > 2) {
            const handler = setTimeout(async () => {
                const result = await searchCities(destination);
                if (result.success) {
                    setCitySuggestions(result.data);
                    setShowSuggestions(true);
                }
            }, 300);
            return () => clearTimeout(handler);
        } else {
            setShowSuggestions(false);
        }
    }, [destination]);

    const handleGenerateTrip = async () => {
        if (!destination) {
            setError('Please enter a destination.');
            return;
        }
        setLoading(true);
        setError('');

        const tripData = {
            destination,
            noOfDays: days,
            budget,
            traveler: travelers,
        };

        const result = await generateAITrip(tripData);

        setLoading(false);
        if (result.success && result.trip) {
            addTrip(result.trip);
            navigate(`/trip/${result.trip.id}/view`);
        } else {
            setError(result.error || 'An unexpected error occurred while generating the trip.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

  return (
    <Layout title="AI Trip Generator">
      {loading && <AIGenerationLoader />}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5">
          <h2 className="text-[3rem] text-[#ff7043] font-extrabold mb-5 uppercase text-center">
            Tell us your travel preferences 🏕️🌴
          </h2>
          <p className="text-[#666] text-[1.2rem] mt-2 mb-10 max-w-[800px] leading-relaxed text-center mx-auto">
            Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
          </p>
        </div>

        {/* Destination Dropdown */}
        <div className="destination-select text-center my-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            What is your choice of destination?
          </h3>
          <div className="w-full mx-auto bg-gray-100 rounded-lg">
            <select
              id="destination"
              value={formData.destination || ''}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              className="w-full p-3 mt-1 border-2 border-gray-300 rounded-lg text-base bg-white"
            >
              <option value="">Select a destination</option>
              <option value="Kutch">Kutch</option>
              <option value="Banaskantha">Banaskantha</option>
              <option value="Surendranagar">Surendranagar</option>
              <option value="Rajkot">Rajkot</option>
              <option value="Amreli">Amreli</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Bhavnagar">Bhavnagar</option>
              <option value="Jamnagar">Jamnagar</option>
              <option value="Patan">Patan</option>
              <option value="Morbi">Morbi</option>
              <option value="Junagadh">Junagadh</option>
              <option value="Bharuch">Bharuch</option>
              <option value="Mehsana">Mehsana</option>
              <option value="Sabarkantha">Sabarkantha</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Surat">Surat</option>
              <option value="Devbhoomi Dwarka">Devbhoomi Dwarka</option>
              <option value="Dahod">Dahod</option>
              <option value="Chhota Udepur">Chhota Udepur</option>
              <option value="Panchmahal">Panchmahal</option>
              <option value="Kheda">Kheda</option>
              <option value="Tapi">Tapi</option>
              <option value="Gir Somnath">Gir Somnath</option>
              <option value="Anand">Anand</option>
              <option value="Aravalli">Aravalli</option>
              <option value="Narmada">Narmada</option>
              <option value="Valsad">Valsad</option>
              <option value="Botad">Botad</option>
              <option value="Mahisagar">Mahisagar</option>
              <option value="Porbandar">Porbandar</option>
              <option value="Gandhinagar">Gandhinagar</option>
              <option value="Dang">Dang</option>
              <option value="Navsari">Navsari</option>
            </select>
          </div>

          {formData.destination && (
            <p className="mt-4 text-lg text-green-600 font-medium">
              Selected Destination: {formData.destination}
            </p>
          )}
        </div>

        {/* Days Input */}
        <div className="select-days text-center my-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            How many days are you planning your trip?
          </h3>
          <div className="w-full mx-auto bg-gray-100 rounded-lg">
            <input
              type="text"
              id="day"
              placeholder="Ex., 3"
              className="w-full p-3 mt-1 border-2 border-gray-300 rounded-lg text-base"
              onChange={(e) => handleInputChange('noOfDays', e.target.value)}
            />
          </div>
        </div>

        {/* Date Selection */}
        <div className="date-selection text-center my-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            When are you planning to travel?
          </h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base"
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base"
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Budget Selection */}
        <div className="budget my-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            What is your budget?
          </h3>
          <div className="flex justify-center gap-8 mt-5 flex-wrap">
            {['cheap', 'moderate', 'luxury'].map((type) => (
              <div
                key={type}
                className={`p-6 w-[300px] text-center rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 
                  ${formData?.budget === type
                    ? 'bg-orange-500 text-white border-3'
                    : 'bg-white text-black hover:bg-orange-500 hover:text-white'}`}
                onClick={() => handleInputChange('budget', type)}
              >
                <h2 className="text-2xl">
                  {type === 'cheap' ? '💵' : type === 'moderate' ? '💰' : '💸'}
                </h2>
                <h2 className="text-xl font-semibold capitalize">{type}</h2>
                <p>
                  {type === 'cheap'
                    ? 'Stay conscious of costs'
                    : type === 'moderate'
                    ? 'Keep cost on the average side'
                    : "Don't worry about the cost"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Group Selection */}
        <div className="plan-to-travel my-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Who do you plan on traveling with on your next adventure?
          </h3>
          <div className="flex justify-around flex-wrap gap-8">
            {[
              { id: 'me', icon: '✈️', title: 'Just Me', desc: 'A sole travels in exploration', people: '1 people' },
              { id: 'couple', icon: '🥂', title: 'A Couple', desc: 'Two travelers in tandem', people: '2 people' },
              { id: 'family', icon: '🏡', title: 'Family', desc: 'A group of fun loving adventure', people: '3 to 5 people' },
              { id: 'friends', icon: '⛵', title: 'Friends', desc: 'A bunch of thrill-seekers', people: '5 to 10 people' },
            ].map((opt) => (
              <div
                key={opt.id}
                className={`p-6 w-[300px] text-center rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 
                  ${formData?.traveler === opt.people
                    ? 'bg-green-500 text-white border-3'
                    : 'bg-white text-black hover:bg-green-500 hover:text-white'}`}
                onClick={() => handleInputChange('traveler', opt.people)}
              >
                <h2 className="text-2xl">{opt.icon}</h2>
                <h2 className="text-xl font-semibold">{opt.title}</h2>
                <p>{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>

                        {/* Submit Button */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-4">
                            <button
                                onClick={handleGenerateTrip}
                                disabled={loading || !destination}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold text-lg py-4 px-4 rounded-2xl hover:shadow-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center space-x-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-6 h-6" />
                                        <span>Generate My Trip</span>
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </Layout>
    );
};

export default BuildTripAI;