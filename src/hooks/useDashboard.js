import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '@/services/dashboard.service'

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await getDashboard()
      return res.data.data
    },
  })
}