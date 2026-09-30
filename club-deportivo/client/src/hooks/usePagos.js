import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { pagosService } from '@/services'
import { getApiError } from '@/lib/api'
import { queryKeys } from '@/hooks/queryKeys'
import { cleanParams } from '@/hooks/cleanParams'

const VENCIDOS_COUNT_PARAMS = { estado: 'VENCIDO', limit: 1 }

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: () => pagosService.getDashboard().then((res) => res.data),
    staleTime: 1000 * 60,
  })
}

// The sidebar badge only needs a count, so it asks for a single row and reads
// the total from the pagination instead of pulling the whole dashboard on every
// admin page. The key stays under pagos.all() so registering a payment
// refreshes the badge through the existing invalidation.
export function usePagosVencidosCount() {
  return useQuery({
    queryKey: queryKeys.pagos.vencidosCount(),
    queryFn: () =>
      pagosService.getAll(VENCIDOS_COUNT_PARAMS).then((res) => res.data.pagination.total),
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
