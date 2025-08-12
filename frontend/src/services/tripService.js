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
  createTrip: async (tripData) => {
    try {
        const response = await api.post('/trips', tripData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to create trip' };
    }
  },

  getMyTrips: async () => {
    try {
        const response = await api.get('/trips');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch trips' };
    }
  },
  
  // --- THIS FUNCTION HAS BEEN ADDED ---
  // It fetches a single manually created trip by its ID.
  getTripById: async (tripId) => {
    try {
      const response = await api.get(`/trips/${tripId}`); // Assuming a new endpoint like /api/trips/:id
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch manual trip',
      };
    }
  },

  getAITrips: async () => {
    try {
      const response = await api.get('/trips/ai-trips');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch AI trips',
      };
    }
  },
};

export default tripService;