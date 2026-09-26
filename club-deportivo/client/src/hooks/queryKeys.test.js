import { describe, it, expect } from 'vitest'
import { cleanParams } from './cleanParams'
import { queryKeys } from './queryKeys'

describe('cleanParams', () => {
  it('drops undefined, null and empty string values', () => {
    expect(cleanParams({ search: '', page: 1, estado: undefined, extra: null })).toEqual({ page: 1 })
  })

  it('keeps false and zero', () => {
    expect(cleanParams({ activo: false, limit: 0 })).toEqual({ activo: false, limit: 0 })
  })

  it('returns an empty object for no input', () => {
    expect(cleanParams()).toEqual({})
  })
})

describe('queryKeys', () => {
  it('nests every resource key under its own root', () => {
    expect(queryKeys.socios.all()).toEqual(['socios'])
    expect(queryKeys.deportes.all()).toEqual(['deportes'])
    expect(queryKeys.pagos.all()).toEqual(['pagos'])
    expect(queryKeys.inscripciones.all()).toEqual(['inscripciones'])
    expect(queryKeys.portal.all()).toEqual(['portal'])
  })

  it('keeps list variants under the resource root so invalidation cascades', () => {
    expect(queryKeys.deportes.list()).toEqual(['deportes', 'list', {}])
    expect(queryKeys.deportes.list({ activo: 'true' })[0]).toBe('deportes')
    expect(queryKeys.socios.options()[0]).toBe('socios')
    expect(queryKeys.pagos.deudas('7')[0]).toBe('pagos')
  })

  it('produces distinct list keys per param set', () => {
    expect(queryKeys.socios.list({ page: 1 })).not.toEqual(queryKeys.socios.list({ page: 2 }))
  })

  it('stringifies ids so numeric and string ids share a cache entry', () => {
    expect(queryKeys.socios.detail(7)).toEqual(queryKeys.socios.detail('7'))
    expect(queryKeys.pagos.deudas(7)).toEqual(queryKeys.pagos.deudas('7'))
  })
})
