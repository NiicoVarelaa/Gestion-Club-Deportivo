import { describe, it, expect } from 'vitest'
import { socioSchema, deporteSchema, inscripcionSchema, pagoSchema, loginSchema } from './index.js'

describe('socioSchema', () => {
  it('validates a correct socio', () => {
    const result = socioSchema.safeParse({
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@example.com',
      telefono: '1234567890',
      fechaNacimiento: '1990-01-01',
    })
    expect(result.success).toBe(true)
  })

  it('fails with invalid email', () => {
    const result = socioSchema.safeParse({
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'not-email',
    })
    expect(result.success).toBe(false)
  })

  it('fails when nombre is too short', () => {
    const result = socioSchema.safeParse({
      dni: '12345678',
      nombre: 'J',
      apellido: 'Perez',
      email: 'juan@example.com',
    })
    expect(result.success).toBe(false)
  })

  it('fails when dni is too short', () => {
    const result = socioSchema.safeParse({
      dni: '12345',
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@example.com',
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional fields as undefined', () => {
    const result = socioSchema.safeParse({
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@example.com',
    })
    expect(result.success).toBe(true)
  })
})

describe('deporteSchema', () => {
  it('validates a correct deporte', () => {
    const result = deporteSchema.safeParse({
      nombre: 'Futbol',
      descripcion: 'Sport practice',
      cuotaMensual: '500',
    })
    expect(result.success).toBe(true)
  })

  it('fails with invalid cuota string', () => {
    const result = deporteSchema.safeParse({
      nombre: 'Tenis',
      cuotaMensual: 'abc',
    })
    expect(result.success).toBe(false)
  })

  it('fails with negative cuota', () => {
    const result = deporteSchema.safeParse({
      nombre: 'Tenis',
      cuotaMensual: '-100',
    })
    expect(result.success).toBe(false)
  })

  it('fails when nombre is too short', () => {
    const result = deporteSchema.safeParse({
      nombre: 'F',
      cuotaMensual: '500',
    })
    expect(result.success).toBe(false)
  })
})

describe('inscripcionSchema', () => {
  it('validates a correct inscripcion', () => {
    const result = inscripcionSchema.safeParse({
      socioId: '550e8400-e29b-41d4-a716-446655440000',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
    })
    expect(result.success).toBe(true)
  })

  it('fails with invalid socioId uuid', () => {
    const result = inscripcionSchema.safeParse({
      socioId: 'not-uuid',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
    })
    expect(result.success).toBe(false)
  })

  it('fails with missing fields', () => {
    const result = inscripcionSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('pagoSchema', () => {
  it('validates a correct pago', () => {
    const result = pagoSchema.safeParse({
      socioId: '550e8400-e29b-41d4-a716-446655440000',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
      mes: '6',
      anio: '2025',
      monto: '500',
    })
    expect(result.success).toBe(true)
  })

  it('coerces string numbers', () => {
    const result = pagoSchema.safeParse({
      socioId: '550e8400-e29b-41d4-a716-446655440000',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
      mes: '6',
      anio: '2025',
      monto: '500',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.mes).toBe(6)
      expect(result.data.anio).toBe(2025)
      expect(result.data.monto).toBe('500')
    }
  })

  it('fails with mes out of range', () => {
    const result = pagoSchema.safeParse({
      socioId: '550e8400-e29b-41d4-a716-446655440000',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
      mes: '13',
      anio: '2025',
      monto: '500',
    })
    expect(result.success).toBe(false)
  })

  it('fails with negative monto', () => {
    const result = pagoSchema.safeParse({
      socioId: '550e8400-e29b-41d4-a716-446655440000',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
      mes: '6',
      anio: '2025',
      monto: '-100',
    })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('validates a correct login', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('fails with invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('fails with short password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '12345',
    })
    expect(result.success).toBe(false)
  })
})