import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, formatDate, MESES } from './utils.js'

describe('cn', () => {
  it('merges class names into a string', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('ignores falsy values', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar')
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
})

describe('formatDate', () => {
  it('formats a date as dd/mm/yyyy', () => {
    expect(formatDate('2025-06-15T12:00:00')).toBe('15/06/2025')
  })
})

describe('MESES', () => {
  it('is an array with the 12 months', () => {
    expect(MESES).toHaveLength(12)
    expect(MESES[0]).toBe('Enero')
    expect(MESES[11]).toBe('Diciembre')
  })
})