import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sociosService } from '../services'
import { getApiError } from '../lib/api'
import { queryKeys } from './queryKeys'
import { cleanParams } from './cleanParams'

export function useSocios({ search, page, limit } = {}) {
  const params = cleanParams({ search, page, limit })

  return useQuery({
    queryKey: queryKeys.socios.list(params),
    queryFn: () => sociosService.getAll(params).then((res) => res.data),
  })
}

export function useSocio(id) {
  return useQuery({
    queryKey: queryKeys.socios.detail(id),
    queryFn: () => sociosService.getById(id).then((res) => res.data),
    enabled: !!id,
  })
}

export function useSocioOptions() {
  return useQuery({
    queryKey: queryKeys.socios.options(),
    queryFn: () => sociosService.getAll({ activo: 'true', limit: 200 }).then((res) => res.data.data),
    staleTime: Infinity,
  })
}

export function useCreateSocio({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => sociosService.create(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.socios.all() })
      toast.success('Socio creado correctamente')
      onSuccess?.(...args)
    },
    onError: (err) => {
      toast.error(getApiError(err, 'Error al crear socio'))
      onError?.(err)
    },
  })
}

export function useUpdateSocio({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }) => sociosService.update(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.socios.all() })
      toast.success('Socio actualizado correctamente')
      onSuccess?.(...args)
    },
    onError: (err) => {
      toast.error(getApiError(err, 'Error al actualizar'))
      onError?.(err)
    },
  })
}

export function useDeleteSocio({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => sociosService.delete(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.socios.all() })
      toast.success('Socio dado de baja correctamente')
      onSuccess?.(...args)
    },
    onError: (err) => {
      toast.error(getApiError(err, 'Error al dar de baja'))
      onError?.(err)
    },
  })
}
