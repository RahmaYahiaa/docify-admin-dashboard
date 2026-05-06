import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSettings, updateSettings } from '@/services/settings.service'
import { toast } from 'sonner'

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await getSettings()
      return res.data.data
    },
  })
}

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Settings saved successfully!')
    },
    onError: () => toast.error('Failed to save settings'),
  })
}