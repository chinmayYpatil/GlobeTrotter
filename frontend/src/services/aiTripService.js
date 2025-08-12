import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const generateAITrip = async (tripData) => {
  try {
    const response = await api.post('/trips/generate-ai', tripData);
    
    if (response.data.success) {
      return { success: true, trip: response.data.trip };
    } else {
      return { success: false, error: response.data.error };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to connect to trip generation service.'
    };
  }
};

export const searchCities = async (query) => {
  try {
    const response = await api.get('/trips/search-cities', { params: { query } });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to search cities',
    };
  }
};