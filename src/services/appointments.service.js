import api from './api'
export const getAppointments = ()   => api.get('/appointments')
export const getAppointment  = (id) => api.get(`/appointments/${id}`)