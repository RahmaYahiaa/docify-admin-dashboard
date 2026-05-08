import api from './api'

// Endpoint: GET /doctor/v1/specializations
export const getSpecializations = (params = {}) =>
  api.get('/specializations', { params })

// export const getSpecializations = (params = {}) =>
//   api.get('/api/doctor/v1/specializations', { params })