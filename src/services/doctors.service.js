import api from './api'
export const getDoctors     = ()         => api.get('/doctors')
export const getDoctor      = (id)       => api.get(`/doctors/${id}`)
export const approveDoctor  = (id)       => api.post(`/doctors/${id}/approve`)
export const rejectDoctor   = (id, reason) => {
  const form = new FormData()
  form.append('reason', reason)
  return api.post(`/doctors/${id}/reject`, form)
}