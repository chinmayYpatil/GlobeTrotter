import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTrips } from '../contexts/TripContext';
import Layout from '../components/Layout';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

const MyTrips = () => {
  const navigate = useNavigate();
  const { trips, deleteTrip, loading } = useTrips(); // Assuming loading state from context
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { ongoingTrips, upcomingTrips, completedTrips } = useMemo(() => {
    const now = new Date();
    const result = { ongoing: [], upcoming: [], completed: [] };

    if (!Array.isArray(trips)) {
        return { ongoing: [], upcoming: [], completed: [] };
    }

    const filtered = trips.filter(trip => 
        trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.description && trip.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    for (const trip of filtered) {
        if (!trip.startDate || !trip.endDate) continue;
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);

        if (now >= start && now <= end) {
            result.ongoing.push(trip);
        } else if (now < start) {
            result.upcoming.push(trip);
        } else if (now > end) {
            result.completed.push(trip);
        }
    }
    
    return { 
        ongoingTrips: result.ongoing, 
        upcomingTrips: result.upcoming, 
        completedTrips: result.completed 
    };
  }, [trips, searchQuery]);


  const handleDeleteTrip = (tripId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId);
    }
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

  const renderTripCard = (trip) => (
    <motion.div
      key={trip.id}
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all"
      onClick={() => navigate(`/trip/${trip.id}/view`)}
    >
      <div className="h-48 bg-gradient-to-r from-blue-400 to-teal-400 relative overflow-hidden">
        {trip.coverImage ? (
          <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><MapPin className="h-12 w-12 text-white opacity-50" /></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-4 right-4 flex space-x-2">
           <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); navigate(`/trip/${trip.id}/build`); }} className="p-2 bg-white bg-opacity-90 rounded-full"><Edit3 className="h-4 w-4 text-gray-700" /></motion.button>
           <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => handleDeleteTrip(trip.id, e)} className="p-2 bg-white bg-opacity-90 rounded-full"><Trash2 className="h-4 w-4 text-red-600" /></motion.button>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-900 mb-2">{trip.name}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{trip.description || 'No description provided.'}</p>
        <div className="space-y-3">
          <div className="flex items-center text-gray-600"><Calendar className="h-4 w-4 mr-2" /><span className="text-sm">{format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}</span></div>
          <div className="flex items-center text-gray-600"><MapPin className="h-4 w-4 mr-2" /><span className="text-sm">{(trip.stops || []).length} destinations</span></div>
          <div className="flex items-center text-gray-600"><DollarSign className="h-4 w-4 mr-2" /><span className="text-sm">${trip.budget?.total || '0'} budget</span></div>
        </div>
      </div>
    </motion.div>
  );

  const totalTrips = ongoingTrips.length + upcomingTrips.length + completedTrips.length;

  return (
    <Layout title="My Trips" showBack={true} backTo="/">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header Actions */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search trips..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                        <option value="all">All Trips</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                    </select>
                    <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/create-trip')} className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:from-blue-600 hover:to-teal-600 transition-all">
                    <Plus className="h-5 w-5" />
                    <span>New Trip</span>
                </motion.button>
            </div>
        </motion.div>

        {loading ? <p>Loading trips...</p> : (
            <>
                {/* Ongoing Trips */}
                {(filterStatus === 'all' || filterStatus === 'ongoing') && ongoingTrips.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Clock className="mr-2 h-6 w-6 text-orange-500"/>Ongoing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ongoingTrips.map(renderTripCard)}
                        </div>
                    </section>
                )}

                {/* Upcoming Trips */}
                {(filterStatus === 'all' || filterStatus === 'upcoming') && upcomingTrips.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Calendar className="mr-2 h-6 w-6 text-blue-500"/>Upcoming</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingTrips.map(renderTripCard)}
                        </div>
                    </section>
                )}

                {/* Completed Trips */}
                {(filterStatus === 'all' || filterStatus === 'completed') && completedTrips.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><MapPin className="mr-2 h-6 w-6 text-green-500"/>Completed</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {completedTrips.map(renderTripCard)}
                        </div>
                    </section>
                )}

                {/* No Trips State */}
                {totalTrips === 0 && (
                    <motion.div variants={itemVariants} className="bg-white rounded-xl p-12 text-center border border-gray-200 mt-8">
                        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchQuery || filterStatus !== 'all' ? 'No trips found' : 'No trips yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                        {searchQuery || filterStatus !== 'all' 
                            ? 'Try adjusting your search or filter criteria.' 
                            : 'Start planning your first adventure and make memories that will last a lifetime.'
                        }
                        </p>
                        <button onClick={() => navigate('/create-trip')} className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all">
                            Plan Your First Trip
                        </button>
                    </motion.div>
                )}
            </>
        )}
      </motion.div>
    </Layout>
  );
};

export default MyTrips;