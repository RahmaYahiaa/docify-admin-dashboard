import api from './api'
export const getSpecialties    = ()        => api.get('/specializations')
export const createSpecialty   = (data)    => api.post('/specializations', data)
export const updateSpecialty   = (id, data) => api.put(`/specializations/${id}`, data)
export const deleteSpecialty   = (id)      => api.delete(`/specializations/${id}`)