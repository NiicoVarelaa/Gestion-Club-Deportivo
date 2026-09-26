import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { pagosService } from '../services'
import { getApiError } from '../lib/api'
import { queryKeys } from './queryKeys'
import { cleanParams } from './cleanParams'

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: () => pagosService.getDashboard().then((res) => res.data),
    staleTime: 1000 * 60,
  })
}

export function usePagos({ estado, page, limit } = {}) {
  const params = cleanParams({ estado, page, limit })

  return useQuery({
    queryKey: queryKeys.pagos.list(params),
    queryFn: () => pagosService.getAll(params).then((res) => res.data),
  })
}

export function useDeudas(socioId) {
  return useQuery({
    queryKey: queryKeys.pagos.deudas(socioId),
    queryFn: () => pagosService.getDeudas(socioId).then((res) => res.data),
    enabled: !!socioId,
  })
}

export function useCreatePago({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => pagosService.create(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pagos.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() })
      toast.success('Pago registrado correctamente')
      onSuccess?.(...args)
    },
    onError: (err) => {
      toast.error(getApiError(err, 'Error al registrar pago'))
      onError?.(err)
    },
  })
}

export function useGenerateCuotas({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => pagosService.generateMonthly(),
    onSuccess: (res, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pagos.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() })
      toast.success(res.data?.message || 'Cuotas generadas correctamente')
      onSuccess?.(res, ...rest)
    },
    onError: (err) => {
      toast.error(getApiError(err, 'Error al generar cuotas'))
      onError?.(err)
    },
  })
}
