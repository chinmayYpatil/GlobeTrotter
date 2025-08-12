import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTrips } from '../contexts/TripContext';
import tripService from '../services/tripService'; // For manual trips
import { getAITripById } from '../services/viewTripService'; // For AI trips
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, MapPin, DollarSign, Edit3, Share2, Hotel, Plane, Clock, Star } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';

// --- Universal Trip Card for Displaying Details ---
const TripDetailCard = ({ label, value, icon, color = 'blue' }) => {
  const Icon = icon;
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    teal: 'text-teal-600 bg-teal-100',
    orange: 'text-orange-600 bg-orange-100',
    green: 'text-green-600 bg-green-100',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};


// --- The Main ViewTrip Component ---
const ViewTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById: getTripFromContext } = useTrips();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTripData = async () => {
      setLoading(true);
      setError('');

      // First, try to get the trip from the context
      let tripData = getTripFromContext(id);

      // If not in context, fetch from the backend
      if (!tripData) {
        // Attempt to fetch as both AI and manual trip
        const aiResult = await getAITripById(id);
        if (aiResult.success) {
          tripData = aiResult.data;
        } else {
          const manualResult = await tripService.getTripById(id); // You'll need to create this service function
          if (manualResult.success) {
            tripData = manualResult.data;
          } else {
            setError('Trip not found or you do not have permission to view it.');
          }
        }
      }
      
      setTrip(tripData);
      setLoading(false);
    };

    fetchTripData();
  }, [id, getTripFromContext]);

  if (loading) return <LoadingSpinner message="Loading your trip details..." fullScreen />;
  if (error) return <Layout title="Error"><p className="text-center text-red-500">{error}</p></Layout>;
  if (!trip) return <Layout title="Not Found"><p className="text-center">This trip could not be found.</p></Layout>;

  // Determine trip type and extract data
  const isAITrip = 'userSelection' in trip;
  const tripName = isAITrip ? trip.userSelection.destination : trip.name;
  const description = isAITrip ? `An AI-generated trip for ${trip.userSelection.noOfDays} days.` : trip.description;
  const coverImage = isAITrip ? (trip.tripData?.[0]?.travelPlan?.hotelOptions?.[0]?.hotelImageUrl || '/default-cover.jpg') : trip.coverImage;
  const startDate = isAITrip ? trip.createdAt : trip.startDate; // AI trips don't have start/end dates in the form
  const endDate = isAITrip ? trip.createdAt : trip.endDate;
  const duration = isAITrip ? trip.userSelection.noOfDays : differenceInDays(new Date(endDate), new Date(startDate)) + 1;
  const budget = isAITrip ? trip.userSelection.budget : `$${(trip.budget?.total || trip.budget?.amount || 0)}`;

  const itinerary = isAITrip ? trip.tripData?.[0]?.travelPlan?.itinerary : null;
  const hotelOptions = isAITrip ? trip.tripData?.[0]?.travelPlan?.hotelOptions : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout title={tripName} showBack={true} backTo="/my-trips">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        
        {/* Header */}
        <motion.div variants={itemVariants} className="h-64 rounded-3xl overflow-hidden relative shadow-2xl">
          <img src={coverImage} alt={tripName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-4xl font-extrabold">{tripName}</h1>
            <p className="text-lg opacity-90">{description}</p>
          </div>
          <div className="absolute top-6 right-6 flex space-x-2">
            {!isAITrip && (
              <button onClick={() => navigate(`/trip/${id}/build`)} className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors">
                <Edit3 className="h-5 w-5 text-white" />
              </button>
            )}
            <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors">
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </motion.div>

        {/* Trip Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <TripDetailCard label="Duration" value={`${duration} Days`} icon={Calendar} color="blue" />
          <TripDetailCard label="Budget" value={budget} icon={DollarSign} color="green" />
          <TripDetailCard label="Start Date" value={format(new Date(startDate), 'MMM dd, yyyy')} icon={Plane} color="teal" />
          <TripDetailCard label="Cities" value={isAITrip ? '1' : trip.stops?.length || 0} icon={MapPin} color="orange" />
        </motion.div>

        {/* AI Trip Itinerary Details */}
        {isAITrip && (
          <>
            {/* Hotel Recommendations */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center"><Hotel className="mr-3" /> Hotel Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotelOptions.map((hotel, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <img src={hotel.hotelImageUrl} alt={hotel.hotelName} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{hotel.hotelName}</h3>
                      <p className="text-sm text-gray-500 mb-2">{hotel.hotelAddress}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-green-600">{hotel.price}</span>
                        <span className="flex items-center"><Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />{hotel.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Daily Itinerary */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center"><Calendar className="mr-3" /> Daily Itinerary</h2>
              <div className="space-y-6">
                {Object.entries(itinerary).map(([day, plan]) => (
                  <div key={day} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold capitalize mb-4 text-blue-600">{day.replace('day', 'Day ')}</h3>
                    <div className="space-y-4">
                      {Object.entries(plan).map(([time, details]) => (
                        details.placeName && (
                          <div key={time} className="pl-4 border-l-4 border-blue-200">
                            <h4 className="font-semibold capitalize">{time}: {details.placeName}</h4>
                            <p className="text-sm text-gray-600">{details.placeDetails}</p>
                            <div className="text-xs text-gray-500 mt-1">
                              <span>Travel: {details.travelTime}</span> | <span>Spend: {details.timeToSpend}</span>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
        
        {/* Manual Trip Details (Placeholder) */}
        {!isAITrip && (
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Your Itinerary</h2>
            <p className="text-gray-600 mb-6">This is a manually created trip. Add stops and activities to bring it to life!</p>
            <button onClick={() => navigate(`/trip/${id}/build`)} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Go to Itinerary Builder
            </button>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default ViewTrip;