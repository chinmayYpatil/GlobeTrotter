import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const communityService = {
  getPosts: async (params) => {
    try {
      const response = await api.get('/community', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch posts',
      };
    }
  },
  createPost: async (postData) => {
    try {
      const response = await api.post('/community', postData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create post',
      };
    }
  },
  likePost: async (postId) => {
    try {
      const response = await api.post(`/community/${postId}/like`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to like post',
      };
    }
  },
  createComment: async (postId, commentData) => {
    try {
      const response = await api.post(`/community/${postId}/comments`, commentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create comment',
      };
    }
  },
  // New function to upload an image for a post
  uploadPostImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post('/community/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload image',
      };
    }
  },
};

export default communityService;