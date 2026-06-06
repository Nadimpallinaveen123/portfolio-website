import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const resumeApi = {
  requestOtp: (payload) => api.post('/otp/send', payload),
  verifyOtp: (payload) => api.post('/otp/verify', payload),
  download: (token) =>
    api.get('/resume/download', {
      responseType: 'blob',
      headers: { 'X-Download-Token': token }
    })
};

export const adminApi = {
  login: (payload) => api.post('/admin/login', payload),
  recruiters: (params) => api.get('/admin/recruiters', { params }),
  downloads: () => api.get('/admin/downloads'),
  stats: () => api.get('/admin/stats'),
  exportExcel: () => api.get('/admin/export', { responseType: 'blob' }),
  deleteRecruiter: (id) => api.delete(`/admin/recruiters/${id}`)
};

export const publicApi = {
  contact: (payload) => api.post('/contact', payload),
  visit: (path) => api.post('/analytics/visit', { path }),
  metrics: () => api.get('/analytics/metrics')
};
