import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTrips, mockCities, mockActivities } from '../data/mockData';

const TripContext = createContext();

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState(mockCities);
  const [activities, setActivities] = useState(mockActivities);

  useEffect(() => {
    const savedTrips = localStorage.getItem('globaltrotters_trips');
    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    } else {
      setTrips(mockTrips);
    }
  }, []);

  const saveTrips = (newTrips) => {
    setTrips(newTrips);
    localStorage.setItem('globaltrotters_trips', JSON.stringify(newTrips));
  };

  const createTrip = (tripData) => {
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      createdAt: new Date().toISOString(),
      stops: [],
      budget: { total: 0, breakdown: { transport: 0, accommodation: 0, activities: 0, food: 0 } },
      shareId: Math.random().toString(36).substr(2, 9)
    };
    saveTrips([...trips, newTrip]);
    return newTrip;
  };

  const updateTrip = (tripId, updates) => {
    const updatedTrips = trips.map(trip => 
      trip.id === tripId ? { ...trip, ...updates } : trip
    );
    saveTrips(updatedTrips);
  };

  const deleteTrip = (tripId) => {
    const filteredTrips = trips.filter(trip => trip.id !== tripId);
    saveTrips(filteredTrips);
  };

  const getTripById = (tripId) => {
    return trips.find(trip => trip.id === tripId);
  };

  const getTripByShareId = (shareId) => {
    return trips.find(trip => trip.shareId === shareId);
  };

  const addStopToTrip = (tripId, stop) => {
    const trip = getTripById(tripId);
    if (trip) {
      const updatedStops = [...trip.stops, { ...stop, id: Date.now().toString() }];
      updateTrip(tripId, { stops: updatedStops });
    }
  };

  const updateTripStop = (tripId, stopId, updates) => {
    const trip = getTripById(tripId);
    if (trip) {
      const updatedStops = trip.stops.map(stop => 
        stop.id === stopId ? { ...stop, ...updates } : stop
      );
      updateTrip(tripId, { stops: updatedStops });
    }
  };

  const deleteStopFromTrip = (tripId, stopId) => {
    const trip = getTripById(tripId);
    if (trip) {
      const updatedStops = trip.stops.filter(stop => stop.id !== stopId);
      updateTrip(tripId, { stops: updatedStops });
    }
  };

  const searchCities = (query) => {
    if (!query) return cities;
    return cities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.country.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchActivities = (query, filters = {}) => {
    let filtered = activities;
    
    if (query) {
      filtered = filtered.filter(activity => 
        activity.name.toLowerCase().includes(query.toLowerCase()) ||
        activity.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }

    if (filters.maxCost) {
      filtered = filtered.filter(activity => activity.cost <= filters.maxCost);
    }

    return filtered;
  };

  const value = {
    trips,
    cities,
    activities,
    createTrip,
    updateTrip,
    deleteTrip,
    getTripById,
    getTripByShareId,
    addStopToTrip,
    updateTripStop,
    deleteStopFromTrip,
    searchCities,
    searchActivities
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};