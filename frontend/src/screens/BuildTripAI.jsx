import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Layout from '../components/Layout';
import AIGenerationLoader from '../components/AIGenerationLoader';
import { useAuth } from '../contexts/AuthContext';
import { generateAITrip } from '../services/aiTripService';

const BuildTripAI = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    noOfDays: '',
    budget: '',
    traveler: '',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const OnGenerateTrip = async () => {
    if (!formData.destination || !formData.noOfDays || !formData.budget || !formData.traveler || !formData.startDate || !formData.endDate) {
      alert('Please fill in all fields');
      return;
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      alert('Start date cannot be in the past');
      return;
    }

    if (endDate <= startDate) {
      alert('End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      const result = await generateAITrip({
        ...formData,
        userId: user.uid
      });
      
      if (result.success) {
        navigate(`/trip/${result.tripId}/view`);
      } else {
        alert(result.error || 'Failed to generate trip');
      }
    } catch (error) {
      console.error('Error generating trip:', error);
      alert('An error occurred while generating your trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="AI Trip Generator">
      {loading && <AIGenerationLoader />}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-500">
        <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5">
          <h2 className="text-[3rem] text-[#ff7043] font-extrabold mb-5 uppercase text-center">
            Tell us your travel preferences 🏕️🌴
          </h2>
          <p className="text-[#666] dark:text-gray-300 text-[1.2rem] mt-2 mb-10 max-w-[800px] leading-relaxed text-center mx-auto transition-colors duration-500">
            Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
          </p>
        </div>

        {/* Destination Dropdown */}
        <div className="destination-select text-center my-10">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-500">
            What is your choice of destination?
          </h3>
          <div className="w-full mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors duration-500">
            <select
              id="destination"
              value={formData.destination || ''}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              className="w-full p-3 mt-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 dark:text-white transition-colors duration-500"
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
            <p className="mt-4 text-lg text-green-600 dark:text-green-400 font-medium transition-colors duration-500">
              Selected Destination: {formData.destination}
            </p>
          )}
        </div>

        {/* Days Input */}
        <div className="select-days text-center my-10">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-500">
            How many days are you planning your trip?
          </h3>
          <div className="w-full mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors duration-500">
            <input
              type="text"
              id="day"
              placeholder="Ex., 3"
              className="w-full p-3 mt-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 dark:text-white transition-colors duration-500"
              onChange={(e) => handleInputChange('noOfDays', e.target.value)}
            />
          </div>
        </div>

        {/* Date Selection */}
        <div className="date-selection text-center my-10">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-500">
            When are you planning to travel?
          </h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">Start Date</label>
              <input
                type="date"
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 dark:text-white transition-colors duration-500"
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">End Date</label>
              <input
                type="date"
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 dark:text-white transition-colors duration-500"
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Budget Selection */}
        <div className="budget my-10">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center transition-colors duration-500">
            What is your budget?
          </h3>
          <div className="flex justify-center gap-8 mt-5 flex-wrap">
            {['cheap', 'moderate', 'luxury'].map((type) => (
              <div
                key={type}
                className={`p-6 w-[300px] text-center rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 
                  ${formData?.budget === type
                    ? 'bg-orange-500 text-white border-3'
                    : 'bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white'}`}
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
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center transition-colors duration-500">
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
                    : 'bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-white'}`}
                onClick={() => handleInputChange('traveler', opt.people)}
              >
                <h2 className="text-2xl">{opt.icon}</h2>
                <h2 className="text-xl font-semibold">{opt.title}</h2>
                <p>{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end px-5 sm:px-10 pb-5">
          <button 
            disabled={loading}
            className="bg-[#ff7043] text-white py-3 px-8 rounded-full font-bold hover:bg-[#f4511e] transition-colors duration-300 shadow-md"
            onClick={OnGenerateTrip}
          >
            {loading ? 
              <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin'/> : 
              'Generate Trip'
            }
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default BuildTripAI;
