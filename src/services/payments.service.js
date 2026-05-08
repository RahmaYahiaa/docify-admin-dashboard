import api from './api'

export const getPayments = (params = {}) =>
  api.get('/payments', { params })

export const getRefunds = (params = {}) =>
  api.get('/refunds', { params })