import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { inscripcionesService } from '@/services'
import { getApiError } from '@/lib/api'
import { queryKeys } from '@/hooks/queryKeys'
import { cleanParams } from '@/hooks/cleanParams'

export function useInscripciones({ page, limit } = {}) {
  const params = cleanParams({ page, limit })

  return useQuery({
    queryKey: queryKeys.inscripciones.list(params),
    queryFn: () => inscripcionesService.getAll(params).then((res) => res.data),
  })
}

export function useCreateInscripcion({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => inscripcionesService.create(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inscripciones.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.deportes.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.socios.all() })
      toast.success('Inscripcion realizada correctamente')
      onSuccess?.(...args)
    },
    onError: (err) => {
      toast.error(getApiError(err, 'Error al inscribir'))
      onError?.(err)
    },
  })
}

export function useCancelInscripcion({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => inscripcionesService.cancel(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inscripciones.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.deportes.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.socios.all() })
      toast.success('Inscripcion cancelada correctamente')
      onSuccess?.(...args)
    },
    onError: (err) => {
      toast.error(getApiError(err, 'Error al cancelar'))
      onError?.(err)
    },
  })
}
