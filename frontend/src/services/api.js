import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 5000 // 5 second timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Backend server is not running');
    }
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to server');
      }
      throw error;
    }
  }
};

export const students = {
  getAll: (params) => api.get('/students', { params }),
  create: async (data) => {
    try {
      console.log('API: Creating student with data:', data);
      const response = await api.post('/students', data);
      console.log('API: Create response:', response);
      return response;
    } catch (error) {
      console.error('API: Create error:', {
        error,
        response: error.response,
        data: error.response?.data
      });
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      console.log('API: Updating student with data:', data);
      const response = await api.put(`/students/${id}`, data);
      console.log('API: Update response:', response);
      return response;
    } catch (error) {
      console.error('API: Update error:', {
        error,
        response: error.response,
        data: error.response?.data
      });
      throw error;
    }
  },
  delete: (id) => api.delete(`/students/${id}`),
  bulkImport: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/students/bulk', formData);
  },
  vaccinate: async (studentId, driveId) => {
    try {
      console.log('Attempting to vaccinate student:', { studentId, driveId });
      const response = await api.post(`/students/${studentId}/vaccinate`, { driveId });
      console.log('Vaccination response:', response);
      return response;
    } catch (error) {
      console.error('Vaccination error:', {
        error,
        response: error.response,
        data: error.response?.data,
        url: `/students/${studentId}/vaccinate`,
        payload: { driveId }
      });
      throw error;
    }
  },
  downloadReport: (params) => api.get('/students/report', { 
    params,
    responseType: 'blob'
  })
};

export const vaccinationDrives = {
  getAll: (params) => api.get('/vaccination-drives', { params }),
  create: (data) => api.post('/vaccination-drives', data),
  update: (id, data) => api.put(`/vaccination-drives/${id}`, data),
  getStats: () => api.get('/vaccination-drives/stats'),
  delete: (id) => api.delete(`/vaccination-drives/${id}`),
};

export default api; 