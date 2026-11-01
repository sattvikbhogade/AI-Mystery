import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1', timeout: 30000 });
api.interceptors.request.use((config) => {
  config.headers['x-owner-id'] = localStorage.getItem('mystery-owner') || createOwnerId();
  return config;
});
function createOwnerId() {
  const id = crypto.randomUUID();
  localStorage.setItem('mystery-owner', id);
  return id;
}
export const casesApi = {
  create: (payload) => api.post('/cases', payload),
  get: (id) => api.get(`/cases/${id}`),
  list: () => api.get('/cases'),
  accuse: (id, payload) => api.post(`/cases/${id}/accusation`, payload),
};
export default api;
