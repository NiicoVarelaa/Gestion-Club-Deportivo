import { z } from 'zod'

export const socioSchema = z.object({
  dni: z.string().min(6, 'DNI debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'Nombre es requerido'),
  apellido: z.string().min(2, 'Apellido es requerido'),
  email: z.string().email('Email invalido'),
  telefono: z.string().optional(),
  fechaNacimiento: z.string().optional(),
})

export const deporteSchema = z.object({
  nombre: z.string().min(2, 'Nombre es requerido'),
  descripcion: z.string().optional(),
  cuotaMensual: z.string().min(1, 'Cuota es requerida').refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, 'Cuota debe ser un numero positivo'),
})

export const inscripcionSchema = z.object({
  socioId: z.string().uuid('Selecciona un socio'),
  deporteId: z.string().uuid('Selecciona un deporte'),
})

export const pagoSchema = z.object({
  socioId: z.string().uuid('Selecciona un socio'),
  deporteId: z.string().uuid('Selecciona un deporte'),
  mes: z.coerce.number().min(1).max(12),
  anio: z.coerce.number().min(2020).max(2100),
  monto: z.string().min(1, 'Monto es requerido').refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, 'Monto debe ser un numero positivo'),
})

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
})

export const registroSchema = z.object({
  nombre: z.string().min(2, 'Minimo 2 caracteres').max(100),
  apellido: z.string().min(2, 'Minimo 2 caracteres').max(100),
  dni: z
    .string()
    .min(6, 'DNI debe tener al menos 6 digitos')
    .max(20)
    .regex(/^\d+$/, 'DNI debe contener solo numeros'),
  email: z.string().email('Email invalido'),
  telefono: z
    .string()
    .regex(/^\d{7,15}$/, 'Telefono invalido')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(8, 'Minimo 8 caracteres')
    .regex(/[A-Z]/, 'Al menos una mayuscula')
    .regex(/[0-9]/, 'Al menos un numero'),
})

export const socioLoginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
})
