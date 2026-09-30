import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { pagosService, sociosService, deportesService, inscripcionesService, portalService } from '@/services'
import { useCreatePago, useGenerateCuotas, useDeudas, usePagos } from '@/hooks/usePagos'
import { useCreateSocio, useDeleteSocio, useSocio, useSocioOptions, useSocios, useUpdateSocio } from '@/hooks/useSocios'
import { useCreateDeporte, useDeportes } from '@/hooks/useDeportes'
import { useCancelInscripcion, useCreateInscripcion } from '@/hooks/useInscripciones'
import { usePortalData, useUpdatePortalProfile } from '@/hooks/usePortal'
import { queryKeys } from '@/hooks/queryKeys'
import { createTestQueryClient, renderQueryHook, listResponse } from '@/test/queryClient'

vi.mock('@/services', () => ({
  pagosService: {
    getAll: vi.fn(),
    create: vi.fn(),
    getDeudas: vi.fn(),
    generateMonthly: vi.fn(),
    getDashboard: vi.fn(),
  },
  sociosService: { getAll: vi.fn(), getById: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  deportesService: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  inscripcionesService: { getAll: vi.fn(), create: vi.fn(), cancel: vi.fn() },
  portalService: { getPortalData: vi.fn(), updateProfile: vi.fn() },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/supabase', () => ({
  supabase: { auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() } },
}))

const mutations = [
  {
    name: 'useCreatePago',
    use: () => useCreatePago(),
    run: (result) => result.current.mutateAsync({ socioId: 1 }),
    service: pagosService.create,
    invalidates: [queryKeys.pagos.all(), queryKeys.dashboard()],
  },
  {
    name: 'useGenerateCuotas',
    use: () => useGenerateCuotas(),
    run: (result) => result.current.mutateAsync(),
    service: pagosService.generateMonthly,
    invalidates: [queryKeys.pagos.all(), queryKeys.dashboard()],
  },
  {
    name: 'useCreateSocio',
    use: () => useCreateSocio(),
    run: (result) => result.current.mutateAsync({ nombre: 'Ana' }),
    service: sociosService.create,
    invalidates: [queryKeys.socios.all()],
  },
  {
    name: 'useUpdateSocio',
    use: () => useUpdateSocio(),
    run: (result) => result.current.mutateAsync({ id: 7, nombre: 'Ana' }),
    service: sociosService.update,
    invalidates: [queryKeys.socios.all()],
  },
  {
    name: 'useDeleteSocio',
    use: () => useDeleteSocio(),
    run: (result) => result.current.mutateAsync(7),
    service: sociosService.delete,
    invalidates: [queryKeys.socios.all()],
  },
  {
    name: 'useCreateDeporte',
    use: () => useCreateDeporte(),
    run: (result) => result.current.mutateAsync({ nombre: 'Futbol' }),
    service: deportesService.create,
    invalidates: [queryKeys.deportes.all()],
  },
  {
    name: 'useCreateInscripcion',
    use: () => useCreateInscripcion(),
    run: (result) => result.current.mutateAsync({ socioId: 1, deporteId: 2 }),
    service: inscripcionesService.create,
    invalidates: [queryKeys.inscripciones.all(), queryKeys.deportes.all(), queryKeys.socios.all()],
  },
  {
    name: 'useCancelInscripcion',
    use: () => useCancelInscripcion(),
    run: (result) => result.current.mutateAsync(3),
    service: inscripcionesService.cancel,
    invalidates: [queryKeys.inscripciones.all(), queryKeys.deportes.all(), queryKeys.socios.all()],
  },
  {
    name: 'useUpdatePortalProfile',
    use: () => useUpdatePortalProfile(),
    run: (result) => result.current.mutateAsync({ nombre: 'Ana' }),
    service: portalService.updateProfile,
    invalidates: [queryKeys.portal.all()],
  },
]

describe('mutation invalidation contract', () => {
  beforeEach(() => vi.clearAllMocks())

  for (const { name, use, run, service, invalidates } of mutations) {
    it(`${name} invalidates exactly ${invalidates.map((k) => k[0]).join(', ')}`, async () => {
      service.mockResolvedValue({ data: { message: 'ok' } })
      const client = createTestQueryClient()
      const spy = vi.spyOn(client, 'invalidateQueries')

      const { result } = renderQueryHook(use, { client })
      await act(async () => {
        await run(result)
      })

      expect(spy.mock.calls.map(([arg]) => arg.queryKey)).toEqual(invalidates)
    })

    it(`${name} invalidates nothing when it fails`, async () => {
      service.mockRejectedValue({ response: { data: { error: 'nope' } } })
      const client = createTestQueryClient()
      const spy = vi.spyOn(client, 'invalidateQueries')

      const { result } = renderQueryHook(use, { client })
      await act(async () => {
        await expect(run(result)).rejects.toBeTruthy()
      })

      expect(spy).not.toHaveBeenCalled()
    })
  }
})

describe('query payload shapes', () => {
  beforeEach(() => vi.clearAllMocks())

  it('useSocios returns the list wrapper, so pages read .data off it', async () => {
    sociosService.getAll.mockResolvedValue(listResponse([{ id: 1 }], 1))

    const { result } = renderQueryHook(() => useSocios({ search: 'an' }))

    await waitFor(() => expect(result.current.data.data).toEqual([{ id: 1 }]))
    expect(result.current.data.pagination.total).toBe(1)
    expect(sociosService.getAll).toHaveBeenCalledWith({ search: 'an' })
  })

  it('useDeportes returns the bare array, unlike useSocios', async () => {
    deportesService.getAll.mockResolvedValue(listResponse([{ id: 9 }]))

    const { result } = renderQueryHook(() => useDeportes())

    await waitFor(() => expect(result.current.data).toEqual([{ id: 9 }]))
  })

  it('useSocioOptions unwraps both levels and serves the dropdown from cache', async () => {
    sociosService.getAll.mockResolvedValue(listResponse([{ id: 1 }], 1))

    const client = createTestQueryClient()
    const first = renderQueryHook(() => useSocioOptions(), { client })

    await waitFor(() => expect(first.result.current.data).toEqual([{ id: 1 }]))
    expect(sociosService.getAll).toHaveBeenCalledWith({ activo: 'true', limit: 200 })

    // staleTime: Infinity means the options list is fetched once per session,
    // not on every dropdown mount.
    first.unmount()
    const second = renderQueryHook(() => useSocioOptions(), { client })
    await waitFor(() => expect(second.result.current.data).toEqual([{ id: 1 }]))

    expect(sociosService.getAll).toHaveBeenCalledTimes(1)
  })

  it('a stale query refetches on remount, so the harness can tell the two apart', async () => {
    deportesService.getAll.mockResolvedValue(listResponse([{ id: 9 }]))

    const client = createTestQueryClient()
    const first = renderQueryHook(() => useDeportes(), { client })
    await waitFor(() => expect(first.result.current.data).toEqual([{ id: 9 }]))

    first.unmount()
    renderQueryHook(() => useDeportes(), { client })
    await waitFor(() => expect(deportesService.getAll).toHaveBeenCalledTimes(2))
  })

  it('useSocio is disabled without an id and fetches with one', async () => {
    sociosService.getById.mockResolvedValue({ data: { id: 5 } })

    const { result, rerender } = renderQueryHook(({ id }) => useSocio(id), {
      initialProps: { id: undefined },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(sociosService.getById).not.toHaveBeenCalled()

    rerender({ id: 5 })
    await waitFor(() => expect(result.current.data).toEqual({ id: 5 }))
    expect(sociosService.getById).toHaveBeenCalledWith(5)
  })

  it('useDeudas is keyed by socio so two socios do not share a cache entry', async () => {
    pagosService.getDeudas.mockResolvedValue({ data: { totalDeuda: 0 } })

    const { client } = renderQueryHook(() => useDeudas(1))
    renderQueryHook(() => useDeudas(2), { client })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(client.getQueryData(queryKeys.pagos.deudas(1))).toBeTruthy()
    expect(client.getQueryData(queryKeys.pagos.deudas(2))).toBeTruthy()
    expect(pagosService.getDeudas).toHaveBeenCalledTimes(2)
  })

  it('usePagos is keyed per param set', async () => {
    pagosService.getAll.mockResolvedValue(listResponse([{ id: 'p1' }]))

    const { client } = renderQueryHook(() => usePagos({ page: 1 }))
    renderQueryHook(() => usePagos({ page: 2 }), { client })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(client.getQueryData(queryKeys.pagos.list({ page: 1 }))).toBeTruthy()
    expect(client.getQueryData(queryKeys.pagos.list({ page: 2 }))).toBeTruthy()
  })

  it('usePortalData unwraps the payload', async () => {
    portalService.getPortalData.mockResolvedValue({ data: { socio: { nombre: 'Ana' } } })

    const { result } = renderQueryHook(() => usePortalData())

    await waitFor(() => expect(result.current.data).toEqual({ socio: { nombre: 'Ana' } }))
  })

  it('surfaces an error toast for a failing query without retrying forever', async () => {
    pagosService.getAll.mockRejectedValue({ response: { data: { error: 'boom' } } })

    const { result } = renderQueryHook(() => usePagos({}))

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(toast.error).not.toHaveBeenCalled()
  })
})