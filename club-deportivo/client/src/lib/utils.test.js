import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, formatDate, MESES } from '@/lib/utils'

describe('cn', () => {
  it('merges class names into a string', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('ignores falsy values', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar')
  })

  it('deduplicates tailwind classes via twMerge', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('resolves conflicting bg colors', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'active')).toBe('base active')
  })
})

describe('formatCurrency', () => {
  it('formats the amount in ARS', () => {
    const formatter = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    })
    expect(formatCurrency(1000)).toBe(formatter.format(1000))
    expect(formatCurrency(1000)).toContain('1.000')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toContain('0')
  })

  it('formats decimal amounts', () => {
    expect(formatCurrency(1500.5)).toContain('1.500')
  })
})

describe('formatDate', () => {
  it('formats a date as dd/mm/yyyy', () => {
    expect(formatDate('2025-06-15T12:00:00')).toBe('15/06/2025')
  })

  it('formats a date string with noon time', () => {
    expect(formatDate('2025-01-01T12:00:00')).toBe('01/01/2025')
  })

  it('handles single-digit day and month', () => {
    expect(formatDate('2025-03-05T12:00:00')).toBe('05/03/2025')
  })
})

describe('MESES', () => {
  it('is an array with the 12 months', () => {
    expect(MESES).toHaveLength(12)
    expect(MESES[0]).toBe('Enero')
    expect(MESES[11]).toBe('Diciembre')
  })
})