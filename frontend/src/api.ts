import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const ShipService = {
  getRoutes: () => api.get('/routes').then(res => res.data.data),
  setBaseline: (id: string) => api.post(`/routes/${id}/baseline`).then(res => res.data),
  getComparison: () => api.get('/routes/comparison').then(res => res.data.data),
  
  // banking.
  getBankRecords: (shipId: string) => api.get(`/banking/records?shipId=${shipId}`).then(res => res.data),
  bankSurplus: (payload: any) => api.post('/banking/bank', payload).then(res => res.data),
  
  // pooling.
  createPool: (payload: any) => api.post('/pools', payload).then(res => res.data.data),
};