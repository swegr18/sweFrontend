import axios from 'axios';

// TODO: Update this with your actual backend URL
const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from storage if needed
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (email, password, name) => {
    const response = await apiClient.post('/auth/signup', { email, password, name });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

// Speech API
export const speechAPI = {
  uploadAudio: async (audioUri, contextMode, realtimeFeedback) => {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'speech.m4a',
    });
    formData.append('contextMode', contextMode);
    formData.append('realtimeFeedback', realtimeFeedback);
    
    const response = await apiClient.post('/speech/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getMetrics: async (speechId) => {
    const response = await apiClient.get(`/speech/${speechId}/metrics`);
    return response.data;
  },
  
  saveSpeech: async (speechId, name) => {
    const response = await apiClient.post(`/speech/${speechId}/save`, { name });
    return response.data;
  },
  
  getHistory: async () => {
    const response = await apiClient.get('/speech/history');
    return response.data;
  },
  
  deleteSpeech: async (speechId) => {
    const response = await apiClient.delete(`/speech/${speechId}`);
    return response.data;
  },
};

// User API
export const userAPI = {
  updateProfile: async (userData) => {
    const response = await apiClient.put('/user/profile', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },
};

export default apiClient;
