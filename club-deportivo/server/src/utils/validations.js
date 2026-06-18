import { z } from 'zod';

function sanitizeHtml(str) {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

const stringField = (min, max) => z.string().min(min).max(max).transform(sanitizeHtml);

export const createSocioSchema = z.object({
  dni: z.string().min(6).max(20),
  nombre: stringField(2, 100),
  apellido: stringField(2, 100),
  email: z.string().email(),
  telefono: z.string().max(20).optional().or(z.literal('')),
  fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato invalido').optional().or(z.literal('')),
});

export const updateSocioSchema = createSocioSchema.partial();

export const createDeporteSchema = z.object({
  nombre: stringField(2, 100),
  descripcion: z.string().max(500).transform(sanitizeHtml).optional().or(z.literal('')),
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

export const registroSchema = z.object({
  nombre: stringField(2, 100),
  apellido: stringField(2, 100),
  dni: z.string().min(6).max(20).regex(/^\d+$/, 'DNI debe contener solo numeros'),
  email: z.string().email(),
  telefono: z.string().max(20).optional().or(z.literal('')),
  password: z.string().min(8).regex(/[A-Z]/, 'Al menos una mayuscula').regex(/[0-9]/, 'Al menos un numero'),
});

export const socioLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
