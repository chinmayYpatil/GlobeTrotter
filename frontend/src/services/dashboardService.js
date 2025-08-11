import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies/session
  headers: {
    'Content-Type': 'application/json',
  },
});

const dashboardService = {
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard data',
      };
    }
  },
};

export default dashboardService;