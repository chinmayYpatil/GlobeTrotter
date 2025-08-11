import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const tripService = {
  // Create a new trip
  createTrip: async (tripData) => {
    try {
      const response = await api.post('/trips', tripData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create trip',
      };
    }
  },

  // Get all trips for the current user
  getMyTrips: async () => {
    try {
      const response = await api.get('/trips');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch trips',
      };
    }
  },

  // Get trip by ID
  getTripById: async (tripId) => {
    try {
      const response = await api.get(`/trips/${tripId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch trip',
      };
    }
  },

  // Update trip
  updateTrip: async (tripId, tripData) => {
    try {
      const response = await api.put(`/trips/${tripId}`, tripData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update trip',
      };
    }
  },

  // Delete trip
  deleteTrip: async (tripId) => {
    try {
      const response = await api.delete(`/trips/${tripId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete trip',
      };
    }
  },
};

export default tripService;