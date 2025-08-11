import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCities, mockActivities } from '../data/mockData';
import tripService from '../services/tripService';
import { useAuth } from './AuthContext';

const TripContext = createContext();

export const useTrips = () => {
  return useContext(TripContext);
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities] = useState(mockCities);
  const [activities] = useState(mockActivities);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch trips from the backend when the user is logged in
    const fetchTrips = async () => {
      if (user) {
        setLoading(true);
        const result = await tripService.getMyTrips();
        if (result.success) {
          setTrips(result.data);
        }
        setLoading(false);
      } else {
        // Clear trips if user logs out
        setTrips([]);
        setLoading(false);
      }
    };
    fetchTrips();
  }, [user]); // Re-run when the user object changes

  const createTrip = async (tripData) => {
    const result = await tripService.createTrip(tripData);
    if (result.success) {
      // Add the new trip to the local state
      setTrips(prevTrips => [...prevTrips, result.data.trip]);
      return result.data.trip;
    } else {
      // Handle error case
      console.error(result.error);
      throw new Error(result.error);
    }
  };

  // The rest of the functions (updateTrip, deleteTrip, etc.) would also be
  // updated to use the tripService. For now, we focus on create and fetch.

  const getTripById = (tripId) => {
    return trips.find(trip => trip.id.toString() === tripId);
  };

  //to add the stop to the create trip page
  const addStopToTrip = (tripId, stop) => {
  setTrips(prevTrips =>
    prevTrips.map(trip =>
      String(trip.id) === String(tripId)
        ? {
            ...trip,
            stops: [...(trip.stops || []), { id: Date.now().toString(), ...stop }]
          }
        : trip
      )
    );
  };


  
  // This can remain as is for now
  const getTripByShareId = (shareId) => {
    return trips.find(trip => trip.shareId === shareId);
  };
  
  const searchCities = (query) => {
    if (!query) return cities;
    return cities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.country.toLowerCase().includes(query.toLowerCase())
    );
  };

  const value = {
    trips,
    loading,
    cities,
    activities,
    createTrip,
    addStopToTrip,
    getTripById,
    getTripByShareId,
    searchCities,
    // Add other functions as you implement them
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};