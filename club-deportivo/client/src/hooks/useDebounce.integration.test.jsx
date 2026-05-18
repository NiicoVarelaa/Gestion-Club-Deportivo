import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce.js'

describe('useDebounce with query parameter simulation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces a search query value', () => {
    const buildQuery = (search) => ({ queryKey: ['socios', search], queryFn: async () => {} })

    const { result, rerender } = renderHook(({ search }) => {
      const debouncedSearch = useDebounce(search)
      return buildQuery(debouncedSearch)
    }, {
      initialProps: { search: '' },
    })

    expect(result.current.queryKey).toEqual(['socios', ''])

    rerender({ search: 'Juan' })
    expect(result.current.queryKey).toEqual(['socios', ''])

    act(() => { vi.advanceTimersByTime(300) })
    rerender({ search: 'Juan' })
    expect(result.current.queryKey).toEqual(['socios', 'Juan'])
  })

  it('resets query when search changes before delay', () => {
    const { result, rerender } = renderHook(({ search }) => {
      const debouncedSearch = useDebounce(search)
      return { queryKey: ['socios', debouncedSearch] }
    }, {
      initialProps: { search: 'a' },
    })

    expect(result.current.queryKey).toEqual(['socios', 'a'])

    rerender({ search: 'ab' })
    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current.queryKey).toEqual(['socios', 'a'])

    rerender({ search: 'abc' })
    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current.queryKey).toEqual(['socios', 'a'])

    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current.queryKey).toEqual(['socios', 'abc'])
  })
})