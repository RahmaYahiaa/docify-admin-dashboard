import api from './api'
export const getPayments = () => api.get('/payments')
export const getRefunds  = () => api.get('/refunds')