import api from './api'

export const getUsers = (params = {}) =>
  api.get('/users', { params })

export const getUser = (id) =>
  api.get(`/users/${id}`)

export const getUserReasons = () =>
  api.get('/user-reasons')

export const suspendUser = (id, reason) =>
  api.post(`/users/${id}/suspend`, { reason })

export const activateUser = (id, reason) =>
  api.post(`/users/${id}/activate`, { reason })

export const createDoctor = (data) =>
  api.post('/users/create-doctor', data)

export const createAdmin = (data) =>
  api.post('/users/create-admin', data)

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data)