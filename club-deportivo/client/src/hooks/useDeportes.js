import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deportesService } from '@/services'
import { getApiError } from '@/lib/api'
import { queryKeys } from '@/hooks/queryKeys'
import { cleanParams } from '@/hooks/cleanParams'

export function useDeportes(params) {
  const cleaned = cleanParams(params)

  return useQuery({
    queryKey: queryKeys.deportes.list(cleaned),
    queryFn: () => deportesService.getAll(cleaned).then((res) => res.data.data),
  })
}

export function useCreateDeporte({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => deportesService.create(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deportes.all() })
      toast.success('Deporte creado correctamente')
      onSuccess?.(...args)
    },
    onError: (err) => {
      toast.error(getApiError(err, 'Error al crear'))
      onError?.(err)
    },
  })
}

export function useUpdateDeporte({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }) => deportesService.update(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deportes.all() })
      toast.success('Deporte actualizado correctamente')
      onSuccess?.(...args)
    },
    onError: (err) => {
      toast.error(getApiError(err, 'Error al actualizar'))
      onError?.(err)
    },
  })
}

export function useDeleteDeporte({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deportesService.delete(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deportes.all() })
      toast.success('Deporte dado de baja correctamente')
      onSuccess?.(...args)
    },
    onError: (err) => {
      toast.error(getApiError(err, 'Error al dar de baja'))
      onError?.(err)
    },
  })
}
