import { useQuery } from '@tanstack/react-query'
import { getLogs } from '@/services/logs.service'

export const useLogs = () => {
  return useQuery({
    queryKey: ['logs'],
    queryFn: async () => {
      const res = await getLogs()
      return res.data.data
    },
  })
}