import { describe, it, expect } from 'vitest'
import {
  createSocioSchema,
  updateSocioSchema,
  createDeporteSchema,
  createInscripcionSchema,
  createPagoSchema,
} from '../src/utils/validations.js'

describe('createSocioSchema', () => {
  it('validates a correct socio', () => {
    const result = createSocioSchema.safeParse({
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
    const result = createSocioSchema.safeParse({
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'invalid-email',
    })
    expect(result.success).toBe(false)
  })

  it('fails when nombre is too short', () => {
    const result = createSocioSchema.safeParse({
      dni: '12345678',
      nombre: 'J',
      apellido: 'Perez',
      email: 'juan@example.com',
    })
    expect(result.success).toBe(false)
  })

  it('fails when dni is too short', () => {
    const result = createSocioSchema.safeParse({
      dni: '12345',
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@example.com',
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional fields as empty strings', () => {
    const result = createSocioSchema.safeParse({
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@example.com',
      telefono: '',
      fechaNacimiento: '',
    })
    expect(result.success).toBe(true)
  })

  it('fails with invalid date format', () => {
    const result = createSocioSchema.safeParse({
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@example.com',
      fechaNacimiento: '01-01-1990',
    })
    expect(result.success).toBe(false)
  })
})

describe('createDeporteSchema', () => {
  it('validates a correct deporte with numeric cuota', () => {
    const result = createDeporteSchema.safeParse({
      nombre: 'Futbol',
      descripcion: 'Sport practice',
      cuotaMensual: 500,
    })
    expect(result.success).toBe(true)
  })

  it('validates a correct deporte with string cuota', () => {
    const result = createDeporteSchema.safeParse({
      nombre: 'Natacion',
      cuotaMensual: '1000.50',
    })
    expect(result.success).toBe(true)
  })

  it('fails with negative cuota', () => {
    const result = createDeporteSchema.safeParse({
      nombre: 'Tenis',
      cuotaMensual: -100,
    })
    expect(result.success).toBe(false)
  })

  it('fails when nombre is too short', () => {
    const result = createDeporteSchema.safeParse({
      nombre: 'F',
      cuotaMensual: 500,
    })
    expect(result.success).toBe(false)
  })

  it('fails with invalid string cuota', () => {
    const result = createDeporteSchema.safeParse({
      nombre: 'Tenis',
      cuotaMensual: 'abc',
    })
    expect(result.success).toBe(false)
  })
})

describe('createInscripcionSchema', () => {
  it('validates a correct inscripcion', () => {
    const result = createInscripcionSchema.safeParse({
      socioId: '550e8400-e29b-41d4-a716-446655440000',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
    })
    expect(result.success).toBe(true)
  })

  it('fails with invalid socioId uuid', () => {
    const result = createInscripcionSchema.safeParse({
      socioId: 'not-a-uuid',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
    })
    expect(result.success).toBe(false)
  })

  it('fails with missing fields', () => {
    const result = createInscripcionSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('createPagoSchema', () => {
  it('validates a correct pago', () => {
    const result = createPagoSchema.safeParse({
      socioId: '550e8400-e29b-41d4-a716-446655440000',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
      mes: 6,
      anio: 2025,
      monto: 500,
    })
    expect(result.success).toBe(true)
  })

  it('accepts monto as string', () => {
    const result = createPagoSchema.safeParse({
      socioId: '550e8400-e29b-41d4-a716-446655440000',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
      mes: 6,
      anio: 2025,
      monto: '500',
    })
    expect(result.success).toBe(true)
  })

  it('fails with mes out of range', () => {
    const result = createPagoSchema.safeParse({
      socioId: '550e8400-e29b-41d4-a716-446655440000',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
      mes: 13,
      anio: 2025,
      monto: 500,
    })
    expect(result.success).toBe(false)
  })

  it('fails with negative monto', () => {
    const result = createPagoSchema.safeParse({
      socioId: '550e8400-e29b-41d4-a716-446655440000',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
      mes: 6,
      anio: 2025,
      monto: -100,
    })
    expect(result.success).toBe(false)
  })

  it('fails with anio out of range', () => {
    const result = createPagoSchema.safeParse({
      socioId: '550e8400-e29b-41d4-a716-446655440000',
      deporteId: '550e8400-e29b-41d4-a716-446655440001',
      mes: 6,
      anio: 1999,
      monto: 500,
    })
    expect(result.success).toBe(false)
  })
})