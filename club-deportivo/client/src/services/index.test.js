import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  sociosService,
  deportesService,
  inscripcionesService,
  pagosService,
  publicService,
  portalService,
} from './index.js'

const { apiMock } = vi.hoisted(() => ({
  apiMock: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

vi.mock('@/lib/api', () => ({ default: apiMock }))

describe('sociosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAll calls api.get with params', () => {
    sociosService.getAll({ page: 2 })
    expect(apiMock.get).toHaveBeenCalledWith('/socios', { params: { page: 2 } })
  })

  it('getById calls api.get with the id', () => {
    sociosService.getById('s1')
    expect(apiMock.get).toHaveBeenCalledWith('/socios/s1')
  })

  it('create calls api.post with data', () => {
    const data = { dni: '11111111' }
    sociosService.create(data)
    expect(apiMock.post).toHaveBeenCalledWith('/socios', data)
  })

  it('update calls api.put with id and data', () => {
    const data = { nombre: 'Ana' }
    sociosService.update('s1', data)
    expect(apiMock.put).toHaveBeenCalledWith('/socios/s1', data)
  })

  it('delete calls api.delete with the id', () => {
    sociosService.delete('s1')
    expect(apiMock.delete).toHaveBeenCalledWith('/socios/s1')
  })
})

describe('deportesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAll calls api.get', () => {
    deportesService.getAll()
    expect(apiMock.get).toHaveBeenCalledWith('/deportes', { params: undefined })
  })

  it('create calls api.post with data', () => {
    const data = { nombre: 'Futbol' }
    deportesService.create(data)
    expect(apiMock.post).toHaveBeenCalledWith('/deportes', data)
  })
})

describe('inscripcionesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('cancel deletes the inscripcion', () => {
    inscripcionesService.cancel('i1')
    expect(apiMock.delete).toHaveBeenCalledWith('/inscripciones/i1')
  })
})

describe('pagosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getDeudas calls api.get with the socios id', () => {
    pagosService.getDeudas('s1')
    expect(apiMock.get).toHaveBeenCalledWith('/pagos/deudas/s1')
  })

  it('generateMonthly posts to generar', () => {
    pagosService.generateMonthly()
    expect(apiMock.post).toHaveBeenCalledWith('/pagos/generar')
  })

  it('getDashboard gets the dashboard endpoint', () => {
    pagosService.getDashboard()
    expect(apiMock.get).toHaveBeenCalledWith('/pagos/dashboard')
  })
})

describe('publicService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('register posts to signup-public', () => {
    const data = { email: 'a@b.com' }
    publicService.register(data)
    expect(apiMock.post).toHaveBeenCalledWith('/auth/signup-public', data)
  })
})

describe('portalService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login posts the credentials', () => {
    portalService.login('a@b.com', 'pass')
    expect(apiMock.post).toHaveBeenCalledWith('/auth/login', {
      email: 'a@b.com',
      password: 'pass',
    })
  })

  it('getPortalData gets /portal/me', () => {
    portalService.getPortalData()
    expect(apiMock.get).toHaveBeenCalledWith('/portal/me')
  })

  it('updateProfile puts the profile data', () => {
    const data = { nombre: 'Ana' }
    portalService.updateProfile(data)
    expect(apiMock.put).toHaveBeenCalledWith('/portal/me', data)
  })
})