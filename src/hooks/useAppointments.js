import { useQuery } from '@tanstack/react-query'
import { getAppointments, getAppointment } from '@/services/appointments.service'

export const useAppointments = (params = {}) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const res = await getAppointments(params)
      return res.data
    },
  })
}

export const useAppointment = (id) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const res = await getAppointment(id)
      return res.data.data
    },
    enabled: !!id,
  })
}