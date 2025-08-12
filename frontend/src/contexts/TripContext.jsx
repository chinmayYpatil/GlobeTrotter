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
    const fetchTrips = async () => {
      if (user) {
        setLoading(true);
        const result = await tripService.getMyTrips();
        if (result.success) {
          setTrips(result.data);
        }
        setLoading(false);
      } else {
        setTrips([]);
        setLoading(false);
      }
    };
    fetchTrips();
  }, [user]);

  const createTrip = async (tripData) => {
    const result = await tripService.createTrip(tripData);
    if (result.success) {
      setTrips(prevTrips => [...prevTrips, result.data.trip]);
      return result.data.trip;
    } else {
      console.error(result.error);
      throw new Error(result.error);
    }
  };

  const addTrip = (newTrip) => {
    setTrips(prevTrips => [...prevTrips, newTrip]);
  };

  const getTripById = (tripId) => {
    return trips.find(trip => trip.id.toString() === tripId.toString());
  };

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
    addTrip, // <-- Expose the new function
    addStopToTrip,
    getTripById,
    getTripByShareId,
    searchCities,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};