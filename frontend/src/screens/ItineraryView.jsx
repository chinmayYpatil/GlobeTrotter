import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Share2, 
  Edit3,
  Star
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const ItineraryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById, cities, activities } = useTrips();
  
  const trip = getTripById(id);

  if (!trip) {
    return (
      <Layout title="Trip Not Found" showBack={true} backTo="/my-trips">
        <div className="text-center py-12">
          <p className="text-gray-600">Trip not found. It might still be loading or you may need to go back to your trips list.</p>
        </div>
      </Layout>
    );
  }

  // --- Start of Corrected Code ---

  // Safely parse the budget, which might be a string from the backend, and provide a default object.
  const parsedBudget = (typeof trip.budget === 'string') 
    ? JSON.parse(trip.budget) 
    : (trip.budget || { total: 0 });

  // Safely calculate trip details, providing default values to prevent errors.
  const tripDuration = trip.endDate && trip.startDate ? differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1 : 0;
  const totalActivities = (trip.stops || []).reduce((total, stop) => total + (stop.activities?.length || 0), 0);
  
  // --- End of Corrected Code ---

  const getStopCity = (cityId) => cities.find(city => city.id === cityId);
  const getActivity = (activityId) => activities.find(activity => activity.id === activityId);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/${trip.shareId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout title={trip.name} showBack={true} backTo="/my-trips">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Trip Header */}
        <motion.div variants={itemVariants} className="relative">
          <div className="h-64 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl overflow-hidden relative">
            {trip.coverImage && (
              <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">{trip.name}</h1>
                <p className="text-xl opacity-90">{trip.description}</p>
              </div>
            </div>
            <div className="absolute top-6 right-6 flex space-x-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(`/trip/${id}/build`)} className="bg-white bg-opacity-90 p-3 rounded-full hover:bg-opacity-100 transition-all">
                <Edit3 className="h-5 w-5 text-gray-700" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleShare} className="bg-white bg-opacity-90 p-3 rounded-full hover:bg-opacity-100 transition-all">
                <Share2 className="h-5 w-5 text-gray-700" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Trip Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{tripDuration}</p>
            <p className="text-gray-600 text-sm">Days</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <MapPin className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{trip.stops?.length || 0}</p>
            <p className="text-gray-600 text-sm">Cities</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
            <p className="text-gray-600 text-sm">Activities</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">${parsedBudget.total || (parsedBudget.amount || 0)}</p>
            <p className="text-gray-600 text-sm">Total Budget</p>
          </div>
        </motion.div>

        {/* Detailed Itinerary Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Detailed Itinerary</h2>
          </div>
          
          {/* Safely check for stops before trying to map them */}
          {trip.stops && trip.stops.length > 0 ? (
            trip.stops.map((stop, index) => {
              const city = getStopCity(stop.cityId);
              if (!city) return null;

              return (
                <motion.div key={stop.id} variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-xl mb-2">{city.name}</h3>
                  {/* ... Add more details for each stop as needed */}
                </motion.div>
              )
            })
          ) : (
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No stops planned yet</h3>
              <p className="text-gray-600 mb-6">This is a new trip! Start building your itinerary by adding destinations.</p>
              <button
                onClick={() => navigate(`/trip/${id}/build`)}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all"
              >
                Build Itinerary
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default ItineraryView;