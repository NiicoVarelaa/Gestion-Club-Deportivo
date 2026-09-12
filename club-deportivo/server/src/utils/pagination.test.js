import { describe, it, expect } from 'vitest'
import { buildPagination } from './pagination.js'

describe('buildPagination', () => {
  it('builds pagination with full pages', () => {
    expect(buildPagination(1, 10, 50)).toEqual({
      page: 1,
      limit: 10,
      total: 50,
      pages: 5,
    })
  })

  it('builds pagination with a partial last page', () => {
    expect(buildPagination(3, 10, 25)).toEqual({
      page: 3,
      limit: 10,
      total: 25,
      pages: 3,
    })
  })

  it('falls back to defaults with invalid page and limit', () => {
    expect(buildPagination('abc', 'xyz', 0)).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    })
  })

  it('falls back to defaults with undefined values', () => {
    expect(buildPagination(undefined, undefined, null)).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    })
  })
})