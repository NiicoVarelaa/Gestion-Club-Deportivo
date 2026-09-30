import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readStored, removeStored, writeStored } from '@/lib/storage'

describe('storage helpers', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('namespaces and versions the key', () => {
    writeStored('theme', 'dark')
    expect(localStorage.getItem('gesclub:theme:v1')).toBe('dark')
  })

  it('reads back what it wrote', () => {
    writeStored('theme', 'dark')
    expect(readStored('theme')).toBe('dark')
  })

  it('returns the fallback when the key is absent', () => {
    expect(readStored('theme', { fallback: 'light' })).toBe('light')
  })

  it('reads a different version under a different key', () => {
    writeStored('theme', 'dark', { version: 1 })

    expect(readStored('theme', { version: 2, fallback: 'light' })).toBe('light')
    expect(readStored('theme', { version: 1 })).toBe('dark')
  })

  it('returns the fallback when reading throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage disabled')
    })

    expect(readStored('theme', { fallback: 'light' })).toBe('light')
  })

  it('swallows write failures instead of propagating', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(() => writeStored('theme', 'dark')).not.toThrow()
  })

  it('removes the versioned key', () => {
    writeStored('theme', 'dark')
    removeStored('theme')
    expect(readStored('theme')).toBeNull()
  })
})