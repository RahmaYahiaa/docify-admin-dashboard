import api from './api'

export const getAppointments = (params = {}) =>
  api.get('/appointments', { params })

export const getAppointment = (id) =>
  api.get(`/appointments/${id}`)