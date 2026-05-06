import api from './api'
export const getUsers       = ()            => api.get('/users')
export const getUserReasons = ()            => api.get('/user-reasons')
export const suspendUser    = (id, reason)  => {
  const form = new FormData()
  form.append('reason', reason)
  return api.post(`/users/${id}/suspend`, form)
}
export const activateUser   = (id, reason)  => {
  const form = new FormData()
  form.append('reason', reason)
  return api.post(`/users/${id}/activate`, form)
}