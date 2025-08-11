import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Star } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

const TripCalendar = () => {
  const { id } = useParams();
  const { getTripById, cities, activities } = useTrips();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const trip = getTripById(id);
  
  if (!trip) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getStopForDate = (date) => {
    return trip.stops.find(stop => {
      const startDate = new Date(stop.startDate);
      const endDate = new Date(stop.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const getStopCity = (cityId) => cities.find(city => city.id === cityId);
  const getActivity = (activityId) => activities.find(activity => activity.id === activityId);

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <Layout title="Trip Calendar" showBack={true} backTo={`/trip/${id}/view`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Calendar Header */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{trip.name}</h1>
                <p className="text-gray-600">
                  {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-semibold text-gray-900 min-w-[150px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-4">
            {daysInMonth.map((day, index) => {
              const stop = getStopForDate(day);
              const city = stop ? getStopCity(stop.cityId) : null;
              const isInTrip = stop !== undefined;
              const isTripStart = trip.stops.some(s => isSameDay(new Date(s.startDate), day));
              const isTripEnd = trip.stops.some(s => isSameDay(new Date(s.endDate), day));

              return (
                <motion.div
                  key={day.toISOString()}
                  variants={itemVariants}
                  className={`relative p-3 rounded-lg border min-h-[100px] transition-all ${
                    isToday(day)
                      ? 'border-blue-500 bg-blue-50'
                      : isInTrip
                      ? 'border-teal-200 bg-teal-50 hover:bg-teal-100'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                      isToday(day) ? 'text-blue-600' : isInTrip ? 'text-teal-600' : 'text-gray-600'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {(isTripStart || isTripEnd) && (
                      <div className={`w-2 h-2 rounded-full ${
                        isTripStart ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    )}
                  </div>

                  {isInTrip && city && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-teal-600" />
                        <span className="text-xs font-medium text-teal-700 truncate">
                          {city.name}
                        </span>
                      </div>
                      {stop.activities && stop.activities.length > 0 && (
                        <div className="text-xs text-teal-600">
                          {stop.activities.length} activity{stop.activities.length !== 1 ? 'ies' : ''}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Trip Timeline */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Trip Timeline</h2>
          
          <div className="space-y-6">
            {trip.stops.map((stop, index) => {
              const city = getStopCity(stop.cityId);
              if (!city) return null;

              return (
                <div key={stop.id} className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    {index < trip.stops.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{city.name}, {city.country}</h3>
                          <p className="text-gray-600 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(stop.startDate), 'MMM dd')} - {format(new Date(stop.endDate), 'MMM dd')}
                          </p>
                        </div>
                        <img
                          src={city.image}
                          alt={city.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>
                      
                      {stop.activities && stop.activities.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800">Planned Activities:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {stop.activities.map(activityId => {
                              const activity = getActivity(activityId);
                              if (!activity) return null;
                              
                              return (
                                <div key={activity.id} className="flex items-center space-x-2 text-sm">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span className="text-gray-700">{activity.name}</span>
                                  <span className="text-gray-500">
                                    ({activity.duration}h, ${activity.cost})
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4">Calendar Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-blue-50 border border-blue-500"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-teal-50 border border-teal-200"></div>
              <span>Trip Days</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Trip Start</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Trip End</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default TripCalendar;