import { describe, it, expect } from 'vitest'
import { socioSchema, deporteSchema, inscripcionSchema, pagoSchema, loginSchema, registroSchema, socioLoginSchema } from '@/schemas/index'

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

describe('registroSchema', () => {
  const valid = {
    nombre: 'Juan',
    apellido: 'Perez',
    dni: '12345678',
    email: 'juan@example.com',
    password: 'Password1',
  }

  it('validates a correct registro', () => {
    expect(registroSchema.safeParse(valid).success).toBe(true)
  })

  it('fails when dni contains letters', () => {
    const result = registroSchema.safeParse({ ...valid, dni: '12345abc' })
    expect(result.success).toBe(false)
  })

  it('fails when dni is too short', () => {
    const result = registroSchema.safeParse({ ...valid, dni: '12345' })
    expect(result.success).toBe(false)
  })

  it('fails when dni is too long', () => {
    const result = registroSchema.safeParse({ ...valid, dni: '1'.repeat(21) })
    expect(result.success).toBe(false)
  })

  it('fails when password has no uppercase', () => {
    const result = registroSchema.safeParse({ ...valid, password: 'password1' })
    expect(result.success).toBe(false)
  })

  it('fails when password has no number', () => {
    const result = registroSchema.safeParse({ ...valid, password: 'Password' })
    expect(result.success).toBe(false)
  })

  it('fails when password is too short', () => {
    const result = registroSchema.safeParse({ ...valid, password: 'Ab1' })
    expect(result.success).toBe(false)
  })

  it('accepts empty string for telefono', () => {
    const result = registroSchema.safeParse({ ...valid, telefono: '' })
    expect(result.success).toBe(true)
  })

  it('accepts missing telefono', () => {
    const result = registroSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('fails with invalid telefono format', () => {
    const result = registroSchema.safeParse({ ...valid, telefono: 'abc' })
    expect(result.success).toBe(false)
  })

  it('fails when nombre is too short', () => {
    const result = registroSchema.safeParse({ ...valid, nombre: 'J' })
    expect(result.success).toBe(false)
  })

  it('fails with invalid email', () => {
    const result = registroSchema.safeParse({ ...valid, email: 'not-email' })
    expect(result.success).toBe(false)
  })
})

describe('socioLoginSchema', () => {
  it('validates a correct login', () => {
    const result = socioLoginSchema.safeParse({
      email: 'user@example.com',
      password: 'pass123',
    })
    expect(result.success).toBe(true)
  })

  it('fails with invalid email', () => {
    const result = socioLoginSchema.safeParse({
      email: 'not-email',
      password: 'pass123',
    })
    expect(result.success).toBe(false)
  })

  it('fails with short password', () => {
    const result = socioLoginSchema.safeParse({
      email: 'user@example.com',
      password: '12345',
    })
    expect(result.success).toBe(false)
  })
})