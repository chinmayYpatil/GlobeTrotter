import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Trash2, 
  Edit3,
  Clock,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';

const ItineraryBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById, updateTrip, addStopToTrip, updateTripStop, deleteStopFromTrip, cities, activities } = useTrips();
  
  const trip = getTripById(id);
  const [editingStop, setEditingStop] = useState(null);
  const [newStop, setNewStop] = useState({
    cityId: '',
    startDate: '',
    endDate: '',
    activities: []
  });

  useEffect(() => {
    if (!trip) {
      navigate('/my-trips');
    }
  }, [trip, navigate]);

  if (!trip) return null;

  const handleAddStop = () => {
    if (newStop.cityId && newStop.startDate && newStop.endDate) {
      addStopToTrip(id, newStop);
      setNewStop({ cityId: '', startDate: '', endDate: '', activities: [] });
    }
  };

  const handleUpdateStop = (stopId, updates) => {
    updateTripStop(id, stopId, updates);
    setEditingStop(null);
  };

  const handleDeleteStop = (stopId) => {
    if (window.confirm('Are you sure you want to remove this stop?')) {
      deleteStopFromTrip(id, stopId);
    }
  };

  const getStopCity = (cityId) => cities.find(city => city.id === cityId);
  const getActivity = (activityId) => activities.find(activity => activity.id === activityId);

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
    <Layout title={`Building: ${trip.name}`} showBack={true} backTo="/my-trips">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Trip Overview */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{trip.name}</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/trip/${id}/cities`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Browse Cities
              </button>
              <button
                onClick={() => navigate(`/trip/${id}/view`)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Preview
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{trip.stops?.length || 0} stops</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>${trip.budget.total} budget</span>
            </div>
          </div>
        </motion.div>

        {/* Add New Stop */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Stop</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={newStop.cityId}
              onChange={(e) => setNewStop({ ...newStop, cityId: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}, {city.country}</option>
              ))}
            </select>
            
            <input
              type="date"
              value={newStop.startDate}
              onChange={(e) => setNewStop({ ...newStop, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <input
              type="date"
              value={newStop.endDate}
              onChange={(e) => setNewStop({ ...newStop, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddStop}
              disabled={!newStop.cityId || !newStop.startDate || !newStop.endDate}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Stop</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Trip Stops */}
        <div className="space-y-6">
          {trip.stops?.length > 0 ? (
            trip.stops.map((stop, index) => {
              const city = getStopCity(stop.cityId);
              if (!city) return null;

              return (
                <motion.div
                  key={stop.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Stop Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{city.name}, {city.country}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{format(new Date(stop.startDate), 'MMM dd')} - {format(new Date(stop.endDate), 'MMM dd')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/trip/${id}/activities?stopId=${stop.id}`)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Add Activities
                        </button>
                        <button
                          onClick={() => setEditingStop(stop.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStop(stop.id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stop Activities */}
                  <div className="p-6">
                    {stop.activities && stop.activities.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Planned Activities</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {stop.activities.map(activityId => {
                            const activity = getActivity(activityId);
                            if (!activity) return null;
                            
                            return (
                              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <img
                                  src={activity.image}
                                  alt={activity.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{activity.name}</h5>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {activity.duration}h
                                    </span>
                                    <span className="flex items-center">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      ${activity.cost}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No activities planned for this stop yet</p>
                        <button
                          onClick={() => navigate(`/trip/${id}/activities?stopId=${stop.id}`)}
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add Activities
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No stops added yet</h3>
              <p className="text-gray-600 mb-6">Start building your itinerary by adding your first destination</p>
              <button
                onClick={() => navigate(`/trip/${id}/cities`)}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all"
              >
                Browse Cities
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default ItineraryBuilder;