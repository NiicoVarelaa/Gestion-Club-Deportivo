import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { pagosService } from '@/services'
import { useCreatePago, useDashboard, useDeudas, useGenerateCuotas, usePagos } from '@/hooks/usePagos'
import { queryKeys } from '@/hooks/queryKeys'
import { renderQueryHook, listResponse } from '@/test/queryClient'

vi.mock('@/services', () => ({
  pagosService: {
    getAll: vi.fn(),
    create: vi.fn(),
    getDeudas: vi.fn(),
    generateMonthly: vi.fn(),
    getDashboard: vi.fn(),
  },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

// authStore reaches for env keys at import time; stub it so these tests do not
// depend on a local .env.
vi.mock('@/lib/supabase', () => ({
  supabase: { auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() } },
}))

describe('pagos queries', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends only the params that were provided and unwraps the payload', async () => {
    pagosService.getAll.mockResolvedValue(listResponse([{ id: 'p1' }]))

    const { result } = renderQueryHook(() => usePagos({ estado: 'PENDIENTE', page: 2 }))

    await waitFor(() => expect(result.current.data).toEqual(listResponse([{ id: 'p1' }]).data))
    expect(pagosService.getAll).toHaveBeenCalledWith({ estado: 'PENDIENTE', page: 2 })
  })

  it('gives each param set its own cache entry', async () => {
    pagosService.getAll.mockResolvedValue(listResponse([{ id: 'p1' }]))

    const { result, rerender } = renderQueryHook(({ page }) => usePagos({ page }), {
      initialProps: { page: 1 },
    })

    await waitFor(() => expect(result.current.data).toEqual(listResponse([{ id: 'p1' }]).data))
    rerender({ page: 2 })
    await waitFor(() => expect(pagosService.getAll).toHaveBeenCalledWith({ page: 2 }))
  })

  it('exposes the dashboard stats unwrapped', async () => {
    pagosService.getDashboard.mockResolvedValue({ data: { pagosVencidos: 3 } })

    const { result } = renderQueryHook(() => useDashboard())

    await waitFor(() => expect(result.current.data).toEqual({ pagosVencidos: 3 }))
  })

  it('does not request debts without a socio', async () => {
    pagosService.getDeudas.mockResolvedValue({ data: { totalDeuda: 0 } })

    const { result } = renderQueryHook(() => useDeudas())

    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(pagosService.getDeudas).not.toHaveBeenCalled()
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('requests debts for the given socio', async () => {
    pagosService.getDeudas.mockResolvedValue({ data: { totalDeuda: 500 } })

    const { result } = renderQueryHook(() => useDeudas(7))

    await waitFor(() => expect(result.current.data).toEqual({ totalDeuda: 500 }))
    expect(pagosService.getDeudas).toHaveBeenCalledWith(7)
  })
})

describe('useCreatePago', () => {
  beforeEach(() => vi.clearAllMocks())

  it('refetches the pagos list and the dashboard once it succeeds', async () => {
    pagosService.getAll.mockResolvedValue(listResponse([{ id: 'p1' }]))
    pagosService.getDashboard.mockResolvedValue({ data: { pagosVencidos: 0 } })
    pagosService.create.mockResolvedValue({ data: { id: 'p2' } })

    const { result } = renderQueryHook(() => ({
      pagos: usePagos({ estado: 'PENDIENTE' }),
      dashboard: useDashboard(),
      createPago: useCreatePago(),
    }))

    await waitFor(() => expect(result.current.pagos.data).toEqual(listResponse([{ id: 'p1' }]).data))

    pagosService.getAll.mockResolvedValue(listResponse([{ id: 'p1' }, { id: 'p2' }]))

    await act(async () => {
      await result.current.createPago.mutateAsync({ socioId: 1, deporteId: 2, mes: 3, anio: 2026, monto: 100 })
    })

    await waitFor(() => expect(result.current.pagos.data.data).toHaveLength(2))
    expect(pagosService.getAll).toHaveBeenCalledTimes(2)
  })

  it('refetches the dashboard because a new payment changes the totals', async () => {
    pagosService.getDashboard.mockResolvedValue({ data: { pagosVencidos: 1 } })
    pagosService.create.mockResolvedValue({ data: { id: 'p2' } })

    const { result } = renderQueryHook(() => ({
      dashboard: useDashboard(),
      createPago: useCreatePago(),
    }))

    await waitFor(() => expect(result.current.dashboard.data).toEqual({ pagosVencidos: 1 }))

    pagosService.getDashboard.mockResolvedValue({ data: { pagosVencidos: 4 } })

    await act(async () => {
      await result.current.createPago.mutateAsync({ socioId: 1, deporteId: 2, mes: 3, anio: 2026, monto: 100 })
    })

    await waitFor(() => expect(result.current.dashboard.data).toEqual({ pagosVencidos: 4 }))
  })

  it('shows the server message and calls onSuccess', async () => {
    pagosService.create.mockResolvedValue({ data: { id: 'p2' } })
    const onSuccess = vi.fn()

    const { result } = renderQueryHook(() => useCreatePago({ onSuccess }))

    await act(async () => {
      await result.current.mutateAsync({ socioId: 1 })
    })

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(toast.success).toHaveBeenCalledWith('Pago registrado correctamente')
  })

  it('surfaces the server error and does not touch the cache', async () => {
    pagosService.getAll.mockResolvedValue(listResponse([{ id: 'p1' }]))
    pagosService.create.mockRejectedValue({
      response: { data: { error: 'Socio not found' } },
    })
    const onError = vi.fn()

    const { result, client } = renderQueryHook(() => ({
      pagos: usePagos({}),
      createPago: useCreatePago({ onError }),
    }))

    await waitFor(() => expect(result.current.pagos.data).toEqual(listResponse([{ id: 'p1' }]).data))
    const callsBefore = pagosService.getAll.mock.calls.length

    await act(async () => {
      await expect(result.current.createPago.mutateAsync({ socioId: 1 })).rejects.toBeTruthy()
    })

    expect(toast.error).toHaveBeenCalledWith('Socio not found')
    expect(onError).toHaveBeenCalledTimes(1)
    expect(pagosService.getAll).toHaveBeenCalledTimes(callsBefore)
    expect(client.getQueryState(queryKeys.pagos.all())).toBeUndefined()
  })
})

describe('useGenerateCuotas', () => {
  beforeEach(() => vi.clearAllMocks())

  it('refetches the pagos list and the dashboard once it succeeds', async () => {
    pagosService.getAll.mockResolvedValue(listResponse([{ id: 'p1' }]))
    pagosService.getDashboard.mockResolvedValue({ data: { pagosPendientes: 0 } })
    pagosService.generateMonthly.mockResolvedValue({ data: { created: 3, message: 'Generated 3' } })

    const { result } = renderQueryHook(() => ({
      pagos: usePagos({}),
      dashboard: useDashboard(),
      generate: useGenerateCuotas(),
    }))

    await waitFor(() => expect(result.current.pagos.data).toEqual(listResponse([{ id: 'p1' }]).data))

    pagosService.getAll.mockResolvedValue(listResponse([{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }]))

    await act(async () => {
      await result.current.generate.mutateAsync()
    })

    await waitFor(() => expect(result.current.pagos.data.data).toHaveLength(3))
    expect(result.current.dashboard.data).toBeTruthy()
    expect(pagosService.getDashboard).toHaveBeenCalledTimes(2)
  })

  it('prefers the message the server computed', async () => {
    pagosService.generateMonthly.mockResolvedValue({
      data: { created: 7, message: 'Generated 7 pending payments for 3/2026' },
    })

    const { result } = renderQueryHook(() => useGenerateCuotas())

    await act(async () => {
      await result.current.mutateAsync()
    })

    expect(toast.success).toHaveBeenCalledWith('Generated 7 pending payments for 3/2026')
  })

  it('falls back to a default message when the server sends none', async () => {
    pagosService.generateMonthly.mockResolvedValue({ data: { created: 0 } })

    const { result } = renderQueryHook(() => useGenerateCuotas())

    await act(async () => {
      await result.current.mutateAsync()
    })

    expect(toast.success).toHaveBeenCalledWith('Cuotas generadas correctamente')
  })

  it('surfaces the error and calls onError', async () => {
    pagosService.generateMonthly.mockRejectedValue({
      response: { data: { error: 'Admin access required' } },
    })
    const onError = vi.fn()

    const { result } = renderQueryHook(() => useGenerateCuotas({ onError }))

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toBeTruthy()
    })

    expect(toast.error).toHaveBeenCalledWith('Admin access required')
    expect(onError).toHaveBeenCalledTimes(1)
  })
})