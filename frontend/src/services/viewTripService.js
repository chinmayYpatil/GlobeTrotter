import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getAITrips = async () => {
  try {
    const response = await api.get('/trips/ai-trips');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch AI trips',
    };
  }
};

// --- THIS IS THE CORRECTED FUNCTION ---
// It now uses the specific backend endpoint for fetching one trip.
export const getAITripById = async (tripId) => {
    try {
        const response = await api.get(`/trips/ai-trips/${tripId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to fetch AI trip',
        };
    }
};