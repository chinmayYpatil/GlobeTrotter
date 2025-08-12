import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url, 'with data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const generateAITrip = async (tripData) => {
  try {
    console.log('Generating AI trip with data:', tripData);
    
    const response = await api.post('/trips/generate-ai', tripData);
    
    console.log('AI trip generation response:', response.data);
    
    if (response.data.success) {
      return { success: true, trip: response.data.trip };
    } else {
      return { success: false, error: response.data.error || 'Unknown error occurred' };
    }
  } catch (error) {
    console.error('AI Trip generation error:', error);
    
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: 'No response from server. Please check if the backend is running.'
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: error.message || 'Failed to connect to trip generation service.'
      };
    }
  }
};

export const searchCities = async (query) => {
  try {
    const response = await api.get('/trips/cities/search', { params: { query } });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('City search error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to search cities',
    };
  }
};