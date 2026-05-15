import { z } from 'zod';

export const createSocioSchema = z.object({
  dni: z.string().min(6).max(20),
  nombre: z.string().min(2).max(100),
  apellido: z.string().min(2).max(100),
  email: z.string().email(),
  telefono: z.string().max(20).optional().or(z.literal('')),
  fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato invalido').optional().or(z.literal('')),
});

export const updateSocioSchema = createSocioSchema.partial();

export const createDeporteSchema = z.object({
  nombre: z.string().min(2).max(100),
  descripcion: z.string().max(500).optional().or(z.literal('')),
  cuotaMensual: z.string().or(z.number()).transform((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return num;
  }).pipe(z.number().positive()),
});

export const updateDeporteSchema = createDeporteSchema.partial();

export const createInscripcionSchema = z.object({
  socioId: z.string().uuid(),
  deporteId: z.string().uuid(),
});

export const createPagoSchema = z.object({
  socioId: z.string().uuid(),
  deporteId: z.string().uuid(),
  mes: z.number().int().min(1).max(12),
  anio: z.number().int().min(2020).max(2100),
  monto: z.string().or(z.number()).transform((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return num;
  }).pipe(z.number().positive()),
});
