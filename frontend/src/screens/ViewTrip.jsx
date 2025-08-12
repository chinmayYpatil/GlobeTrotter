import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTrips } from '../contexts/TripContext';
import tripService from '../services/tripService';
import { getAITripById } from '../services/viewTripService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, MapPin, DollarSign, Edit3, Share2, Hotel, Plane, Clock, Star, Camera, Navigation } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';

// --- Universal Trip Card for Displaying Details ---
const TripDetailCard = ({ label, value, icon, color = 'blue' }) => {
  const Icon = icon;
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    teal: 'text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30',
    orange: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    green: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    purple: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-500">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${colorClasses[color]} transition-colors duration-500`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors duration-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-500">{value}</p>
    </div>
  );
};

// --- Component for AI-generated itinerary activities ---
const ActivityCard = ({ activity, timeOfDay }) => {
  const timeColors = {
    morning: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20',
    afternoon: 'border-blue-300 bg-blue-50 dark:bg-blue-900/20',
    evening: 'border-purple-300 bg-purple-50 dark:bg-purple-900/20'
  };

  const timeIcons = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌆'
  };

  return (
    <div className={`p-4 rounded-xl border-l-4 ${timeColors[timeOfDay]} transition-colors duration-500`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-500">
            <span>{timeIcons[timeOfDay]}</span>
            <span className="capitalize">{timeOfDay}: {activity.placeName}</span>
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 transition-colors duration-500">{activity.placeDetails}</p>
        </div>
      </div>
      
      {/* Activity Image */}
      {activity.placeImageUrl && activity.placeImageUrl !== "Not Available" && (
        <div className="mb-3">
          <img 
            src={activity.placeImageUrl} 
            alt={activity.placeName}
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Activity Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-500">
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          <span>{activity.ticketPricing || 'Price not available'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{activity.timeToSpend || 'Duration varies'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Navigation className="h-3 w-3" />
          <span>{activity.travelTime || 'Travel time varies'}</span>
        </div>
        {activity.geoCoordinates && activity.geoCoordinates.latitude && activity.geoCoordinates.longitude && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>View on map</span>
          </div>
        )}
      </div>
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
          const manualResult = await tripService.getTripById(id);
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
  
  // Extract trip information based on type
  const tripName = isAITrip 
    ? (trip.tripData?.[0]?.travelPlan?.location || trip.userSelection?.destination || 'AI Generated Trip')
    : trip.name;
    
  const description = isAITrip 
    ? `An AI-generated ${trip.userSelection?.noOfDays || trip.tripData?.[0]?.travelPlan?.duration || '3'} day trip for ${trip.userSelection?.traveler || trip.tripData?.[0]?.travelPlan?.groupSize || 'travelers'}.`
    : trip.description;
    
  const coverImage = isAITrip 
    ? (trip.tripData?.[0]?.travelPlan?.hotelOptions?.[0]?.hotelImageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop')
    : (trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop');
    
  const startDate = isAITrip 
    ? (trip.userSelection?.startDate || trip.createdAt)
    : trip.startDate;
    
  const endDate = isAITrip 
    ? (trip.userSelection?.endDate || trip.createdAt)
    : trip.endDate;
    
  const duration = isAITrip 
    ? (trip.userSelection?.noOfDays || trip.tripData?.[0]?.travelPlan?.duration?.replace(' Day(s)', '') || '3')
    : (differenceInDays(new Date(endDate), new Date(startDate)) + 1);
    
  const budget = isAITrip 
    ? (trip.userSelection?.budget || trip.tripData?.[0]?.travelPlan?.budget || 'moderate')
    : `$${(trip.budget?.total || trip.budget?.amount || 0)}`;

  // Extract AI-specific data
  const travelPlan = isAITrip ? trip.tripData?.[0]?.travelPlan : null;
  const itinerary = travelPlan?.itinerary || {};
  const hotelOptions = travelPlan?.hotelOptions || [];
  
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
          <img 
            src={coverImage} 
            alt={tripName} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-4xl font-extrabold mb-2">{tripName}</h1>
            <p className="text-lg opacity-90">{description}</p>
            {isAITrip && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm">
                <Star className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">AI Generated</span>
              </div>
            )}
          </div>
          <div className="absolute top-6 right-6 flex space-x-2">
            {!isAITrip && (
              <button 
                onClick={() => navigate(`/trip/${id}/build`)} 
                className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
              >
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
          <TripDetailCard 
            label="Duration" 
            value={`${duration} Days`} 
            icon={Calendar} 
            color="blue" 
          />
          <TripDetailCard 
            label="Budget" 
            value={typeof budget === 'string' ? budget.charAt(0).toUpperCase() + budget.slice(1) : budget} 
            icon={DollarSign} 
            color="green" 
          />
          {startDate && (
            <TripDetailCard 
              label="Start Date" 
              value={format(new Date(startDate), 'MMM dd, yyyy')} 
              icon={Plane} 
              color="teal" 
            />
          )}
          <TripDetailCard 
            label="Cities" 
            value={isAITrip ? '1' : trip.stops?.length || 0} 
            icon={MapPin} 
            color="orange" 
          />
        </motion.div>

        {/* AI Trip Content */}
        {isAITrip && travelPlan && (
          <>
            {/* Hotel Recommendations */}
            {hotelOptions.length > 0 && (
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-500">
                  <Hotel className="mr-3 text-blue-600" /> 
                  Recommended Accommodations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotelOptions.map((hotel, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-500">
                      {hotel.hotelImageUrl && hotel.hotelImageUrl !== "Not Available" && (
                        <img 
                          src={hotel.hotelImageUrl} 
                          alt={hotel.hotelName || 'Hotel'} 
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300';
                          }}
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-500">
                          {hotel.hotelName || 'Recommended Hotel'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-500">
                          {hotel.hotelAddress || 'Address not available'}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-green-600 dark:text-green-400 transition-colors duration-500">
                            {hotel.price || 'Price varies'}
                          </span>
                          {hotel.rating && hotel.rating > 0 && (
                            <span className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-500">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              {hotel.rating}
                            </span>
                          )}
                        </div>
                        {hotel.description && hotel.description !== "Not Available" && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-500">
                            {hotel.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Daily Itinerary */}
            {Object.keys(itinerary).length > 0 && (
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-500">
                  <Calendar className="mr-3 text-purple-600" /> 
                  Daily Itinerary
                </h2>
                <div className="space-y-6">
                  {Object.entries(itinerary).map(([day, plan]) => (
                    <div key={day} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-500">
                      <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400 transition-colors duration-500">
                        {day.replace('day', 'Day ').replace(/(\d+)/, (match, num) => {
                          const dayNumber = parseInt(num);
                          const suffix = dayNumber === 1 ? 'st' : dayNumber === 2 ? 'nd' : dayNumber === 3 ? 'rd' : 'th';
                          return `${dayNumber}${suffix}`;
                        })}
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Morning */}
                        {plan.morning && plan.morning.placeName && plan.morning.placeName !== "Not Available" && (
                          <ActivityCard activity={plan.morning} timeOfDay="morning" />
                        )}
                        
                        {/* Afternoon */}
                        {plan.afternoon && plan.afternoon.placeName && plan.afternoon.placeName !== "Not Available" && (
                          <ActivityCard activity={plan.afternoon} timeOfDay="afternoon" />
                        )}
                        
                        {/* Evening */}
                        {plan.evening && plan.evening.placeName && plan.evening.placeName !== "Not Available" && (
                          <ActivityCard activity={plan.evening} timeOfDay="evening" />
                        )}
                        
                        {/* Best Time to Visit */}
                        {plan.bestTimeToVisit && plan.bestTimeToVisit !== "Not Available" && (
                          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400 transition-colors duration-500">
                            <p className="text-sm text-green-700 dark:text-green-300 transition-colors duration-500">
                              <strong>💡 Best time to visit:</strong> {plan.bestTimeToVisit}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Trip Summary */}
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-700 transition-colors duration-500">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
                🤖 AI Trip Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-500">Group Size:</p>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">{travelPlan.groupSize || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-500">Budget Type:</p>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500 capitalize">{travelPlan.budget || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-500">Duration:</p>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">{travelPlan.duration || 'Not specified'}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
        
        {/* Manual Trip Details */}
        {!isAITrip && (
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center transition-colors duration-500">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-500">Build Your Itinerary</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-500">This is a manually created trip. Add stops and activities to bring it to life!</p>
            <button 
              onClick={() => navigate(`/trip/${id}/build`)} 
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Itinerary Builder
            </button>
          </motion.div>
        )}

        {/* Debug Information (Development Only) */}
        {/* {process.env.NODE_ENV === 'development' && isAITrip && (
          <motion.div variants={itemVariants} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg transition-colors duration-500">
            <details>
              <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 transition-colors duration-500">Debug: Raw Trip Data</summary>
              <pre className="mt-2 text-xs overflow-x-auto text-gray-600 dark:text-gray-400 transition-colors duration-500">
                {JSON.stringify(trip, null, 2)}
              </pre>
            </details>
          </motion.div>
        )} */}
      </motion.div>
    </Layout>
  );
};

export default ViewTrip;