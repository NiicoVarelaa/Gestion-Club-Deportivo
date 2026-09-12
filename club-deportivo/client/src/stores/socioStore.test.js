import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSocioStore } from './socioStore.js'

const { apiMock } = vi.hoisted(() => ({
  apiMock: {
    defaults: { headers: { common: {} } },
    get: vi.fn(),
  },
}))

vi.mock('@/lib/api', () => ({ default: apiMock }))

describe('useSocioStore', () => {
  beforeEach(() => {
    useSocioStore.setState({
      socio: null,
      deportes: [],
      pagos: [],
      deuda: null,
      loading: false,
      error: null,
      initialized: false,
    })
    apiMock.defaults.headers.common = {}
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('starts in a clean state', () => {
    const state = useSocioStore.getState()
    expect(state.socio).toBeNull()
    expect(state.deportes).toEqual([])
    expect(state.pagos).toEqual([])
    expect(state.deuda).toBeNull()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.initialized).toBe(false)
  })

  it('fetchPortalData loads data and sets the authorization header', async () => {
    localStorage.setItem('socio_token', 'abc123')
    const payload = { socio: { id: 1 }, deportes: [], pagos: [], deuda: 0 }
    apiMock.get.mockResolvedValue({ data: payload })

    await useSocioStore.getState().fetchPortalData()

    expect(apiMock.defaults.headers.common.Authorization).toBe('Bearer abc123')
    expect(apiMock.get).toHaveBeenCalledWith('/portal/me')
    const state = useSocioStore.getState()
    expect(state.socio).toEqual(payload.socio)
    expect(state.deuda).toBe(0)
    expect(state.loading).toBe(false)
    expect(state.initialized).toBe(true)
  })

  it('fetchPortalData sets an error when the request fails', async () => {
    apiMock.get.mockRejectedValue(new Error('network'))

    await useSocioStore.getState().fetchPortalData()

    const state = useSocioStore.getState()
    expect(state.error).toBe('Error al cargar datos del portal')
    expect(state.loading).toBe(false)
    expect(state.initialized).toBe(false)
  })

  it('does not refetch once initialized', async () => {
    useSocioStore.setState({ initialized: true })

    await useSocioStore.getState().fetchPortalData()

    expect(apiMock.get).not.toHaveBeenCalled()
  })

  it('updateSocio replaces the socio', () => {
    useSocioStore.getState().updateSocio({ id: 7 })

    expect(useSocioStore.getState().socio).toEqual({ id: 7 })
  })

  it('logout clears state and token', () => {
    useSocioStore.setState({ socio: { id: 1 }, initialized: true })
    localStorage.setItem('socio_token', 'abc')

    useSocioStore.getState().logout()

    expect(localStorage.getItem('socio_token')).toBeNull()
    expect(useSocioStore.getState().socio).toBeNull()
    expect(useSocioStore.getState().initialized).toBe(false)
  })

  it('clearError resets the error', () => {
    useSocioStore.setState({ error: 'something' })

    useSocioStore.getState().clearError()

    expect(useSocioStore.getState().error).toBeNull()
  })
})