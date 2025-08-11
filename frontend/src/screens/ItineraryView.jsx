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
  Download,
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
          <p className="text-gray-600">Trip not found</p>
        </div>
      </Layout>
    );
  }

  const getStopCity = (cityId) => cities.find(city => city.id === cityId);
  const getActivity = (activityId) => activities.find(activity => activity.id === activityId);
  
  const tripDuration = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
  const totalActivities = trip.stops.reduce((total, stop) => total + (stop.activities?.length || 0), 0);
  const averageCostPerDay = trip.budget.total / tripDuration;

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/${trip.shareId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
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
              <img
                src={trip.coverImage}
                alt={trip.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">{trip.name}</h1>
                <p className="text-xl opacity-90">{trip.description}</p>
              </div>
            </div>
            <div className="absolute top-6 right-6 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/trip/${id}/build`)}
                className="bg-white bg-opacity-90 p-3 rounded-full hover:bg-opacity-100 transition-all"
              >
                <Edit3 className="h-5 w-5 text-gray-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="bg-white bg-opacity-90 p-3 rounded-full hover:bg-opacity-100 transition-all"
              >
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
            <p className="text-2xl font-bold text-gray-900">{trip.stops.length}</p>
            <p className="text-gray-600 text-sm">Cities</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
            <p className="text-gray-600 text-sm">Activities</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">${trip.budget.total}</p>
            <p className="text-gray-600 text-sm">Total Budget</p>
          </div>
        </motion.div>

        {/* Trip Dates */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trip Dates</h3>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {format(new Date(trip.startDate), 'EEEE, MMMM dd, yyyy')} - {format(new Date(trip.endDate), 'EEEE, MMMM dd, yyyy')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Average per day</p>
              <p className="text-xl font-bold text-green-600">${Math.round(averageCostPerDay)}</p>
            </div>
          </div>
        </motion.div>

        {/* Detailed Itinerary */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Detailed Itinerary</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/trip/${id}/calendar`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Calendar View
              </button>
              <button
                onClick={() => navigate(`/trip/${id}/budget`)}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm"
              >
                Budget Details
              </button>
            </div>
          </div>

          {trip.stops.length > 0 ? (
            trip.stops.map((stop, index) => {
              const city = getStopCity(stop.cityId);
              if (!city) return null;

              const stopDuration = differenceInDays(new Date(stop.endDate), new Date(stop.startDate)) + 1;

              return (
                <motion.div
                  key={stop.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Stop Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{city.name}</h3>
                          <p className="text-gray-600 mb-2">{city.country}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(stop.startDate), 'MMM dd')} - {format(new Date(stop.endDate), 'MMM dd')}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {stopDuration} {stopDuration === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="p-6">
                    {stop.activities && stop.activities.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Planned Activities</h4>
                        <div className="space-y-3">
                          {stop.activities.map(activityId => {
                            const activity = getActivity(activityId);
                            if (!activity) return null;
                            
                            return (
                              <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <img
                                  src={activity.image}
                                  alt={activity.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 mb-1">{activity.name}</h5>
                                  <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {activity.duration} hours
                                    </span>
                                    <span className="flex items-center">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      ${activity.cost}
                                    </span>
                                    <span className="flex items-center">
                                      <Star className="h-3 w-3 mr-1" />
                                      {activity.rating}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {activity.type}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No activities planned for this stop</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No stops planned yet</h3>
              <p className="text-gray-600 mb-6">Start building your itinerary by adding destinations</p>
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