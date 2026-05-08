import { useQuery } from '@tanstack/react-query'
import { getPayments, getRefunds } from '@/services/payments.service'

export const usePayments = (params = {}) => {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: async () => {
      const res = await getPayments(params)
      return res.data
    },
  })
}

export const useRefunds = (params = {}) => {
  return useQuery({
    queryKey: ['refunds', params],
    queryFn: async () => {
      const res = await getRefunds(params)
      return res.data
    },
  })
}