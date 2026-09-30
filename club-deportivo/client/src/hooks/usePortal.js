import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { portalService } from '@/services'
import { getApiError } from '@/lib/api'
import { queryKeys } from '@/hooks/queryKeys'

export function usePortalData() {
  return useQuery({
    queryKey: queryKeys.portal.me(),
    queryFn: () => portalService.getPortalData().then((res) => res.data),
  })
}

export function useUpdatePortalProfile({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => portalService.updateProfile(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portal.all() })
      toast.success('Perfil actualizado correctamente')
      onSuccess?.(...args)
    },
    onError: (err) => {
      toast.error(getApiError(err, 'Error al actualizar el perfil'))
      onError?.(err)
    },
  })
}
