import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { DollarSign, TrendingUp, PieChart, Calendar, MapPin } from 'lucide-react';
import { differenceInDays } from 'date-fns';

const TripBudget = () => {
  const { id } = useParams();
  const { getTripById, activities } = useTrips();
  
  const trip = getTripById(id);
  
  if (!trip) return null;

  const tripDuration = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
  
  // Calculate actual costs from activities
  const activityCosts = trip.stops.reduce((total, stop) => {
    const stopCosts = (stop.activities || []).reduce((stopTotal, activityId) => {
      const activity = activities.find(a => a.id === activityId);
      return stopTotal + (activity?.cost || 0);
    }, 0);
    return total + stopCosts;
  }, 0);

  // Budget breakdown with estimated vs actual
  const budgetBreakdown = {
    transport: { estimated: trip.budget.breakdown.transport, actual: trip.budget.breakdown.transport * 0.8 },
    accommodation: { estimated: trip.budget.breakdown.accommodation, actual: trip.budget.breakdown.accommodation * 0.9 },
    activities: { estimated: trip.budget.breakdown.activities, actual: activityCosts },
    food: { estimated: trip.budget.breakdown.food, actual: trip.budget.breakdown.food * 1.1 }
  };

  const totalEstimated = Object.values(budgetBreakdown).reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = Object.values(budgetBreakdown).reduce((sum, item) => sum + item.actual, 0);
  const dailyAverage = totalActual / tripDuration;

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

  const budgetItems = [
    { key: 'transport', label: 'Transportation', icon: '🚗', color: 'blue' },
    { key: 'accommodation', label: 'Accommodation', icon: '🏨', color: 'purple' },
    { key: 'activities', label: 'Activities', icon: '🎯', color: 'orange' },
    { key: 'food', label: 'Food & Dining', icon: '🍽️', color: 'green' }
  ];

  return (
    <Layout title="Budget Overview" showBack={true} backTo={`/trip/${id}/view`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Budget Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 opacity-80" />
              <span className="text-blue-200 text-sm font-medium">Total Budget</span>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">${totalEstimated}</p>
              <p className="text-blue-200 text-sm">Estimated</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 opacity-80" />
              <span className="text-teal-200 text-sm font-medium">Current Spending</span>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">${totalActual.toFixed(0)}</p>
              <p className={`text-sm ${totalActual > totalEstimated ? 'text-red-200' : 'text-teal-200'}`}>
                {totalActual > totalEstimated ? 'Over budget' : 'On track'}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 opacity-80" />
              <span className="text-purple-200 text-sm font-medium">Daily Average</span>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">${dailyAverage.toFixed(0)}</p>
              <p className="text-purple-200 text-sm">Per day</p>
            </div>
          </div>
        </motion.div>

        {/* Budget Breakdown */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <PieChart className="h-6 w-6 text-gray-700 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Budget Breakdown</h2>
          </div>

          <div className="space-y-6">
            {budgetItems.map((item) => {
              const data = budgetBreakdown[item.key];
              const percentage = (data.estimated / totalEstimated) * 100;
              const actualPercentage = (data.actual / totalEstimated) * 100;
              
              return (
                <div key={item.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-600">{percentage.toFixed(1)}% of budget</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${data.actual.toFixed(0)} / ${data.estimated}</p>
                      <p className={`text-sm ${data.actual > data.estimated ? 'text-red-600' : 'text-green-600'}`}>
                        {data.actual > data.estimated ? '+' : ''}{(data.actual - data.estimated).toFixed(0)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        item.color === 'blue' ? 'bg-blue-500' :
                        item.color === 'purple' ? 'bg-purple-500' :
                        item.color === 'orange' ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(actualPercentage, 100)}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className={`absolute top-0 h-full rounded-full opacity-70 ${
                        item.color === 'blue' ? 'bg-blue-700' :
                        item.color === 'purple' ? 'bg-purple-700' :
                        item.color === 'orange' ? 'bg-orange-700' : 'bg-green-700'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Daily Budget Analysis */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Budget Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Trip Duration</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{tripDuration} days</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Cities</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{trip.stops.length}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Per City</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${trip.stops.length > 0 ? (totalActual / trip.stops.length).toFixed(0) : '0'}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Remaining</span>
              </div>
              <p className={`text-2xl font-bold ${totalEstimated - totalActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(totalEstimated - totalActual).toFixed(0)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Budget Tips */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-8 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Budget Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Save Money</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Book accommodations in advance</li>
                <li>• Look for free walking tours</li>
                <li>• Eat at local markets</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Track Expenses</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep all receipts</li>
                <li>• Update costs daily</li>
                <li>• Set daily spending limits</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default TripBudget;