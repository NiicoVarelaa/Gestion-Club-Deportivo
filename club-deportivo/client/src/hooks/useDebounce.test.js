import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce.js'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial'))
    expect(result.current).toBe('initial')
  })

  it('returns debounced value after delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'initial' },
    })

    expect(result.current).toBe('initial')

    rerender({ value: 'updated' })
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('updated')
  })

  it('uses custom delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    })

    rerender({ value: 'updated', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(result.current).toBe('updated')
  })

  it('resets timer when value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('a')

    rerender({ value: 'c' })

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('c')
  })
})