import { getSupabase } from '../utils/supabase.js';
import { createSocioSchema, updateSocioSchema } from '../utils/validations.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { buildPagination } from '../utils/pagination.js';

async function attachInscripciones(supabase, socios) {
  if (!socios.length) return socios;

  const { data: inscripciones } = await supabase
    .from('Inscripcion')
    .select('*')
    .in('socioId', socios.map((s) => s.id))
    .eq('activo', true);

  const list = inscripciones || [];

  let deporteMap = {};
  const deporteIds = [...new Set(list.map((i) => i.deporteId))];
  if (deporteIds.length > 0) {
    const { data: deportes } = await supabase.from('Deporte').select('*').in('id', deporteIds);
    deporteMap = Object.fromEntries((deportes || []).map((d) => [d.id, d]));
  }

  for (const i of list) {
    i.deporte = deporteMap[i.deporteId] || null;
  }

  const bySocio = new Map(socios.map((s) => [s.id, []]));
  for (const i of list) {
    bySocio.get(i.socioId)?.push(i);
  }

  return socios.map((s) => ({ ...s, inscripciones: bySocio.get(s.id) || [] }));
}

export const getSocios = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { page = 1, limit = 10, search, activo } = req.query;
  const from = (parseInt(page) - 1) * parseInt(limit);
  const to = from + parseInt(limit) - 1;

  let query = supabase.from('Socio').select('*', { count: 'exact' }).order('apellido', { ascending: true });

  if (activo !== undefined) query = query.eq('activo', activo === 'true');
  if (search) {
    const sanitized = search.replace(/[%_]/g, '');
    query = query.or(`nombre.ilike.%${sanitized}%,apellido.ilike.%${sanitized}%,dni.ilike.%${sanitized}%,email.ilike.%${sanitized}%`);
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  const sociosWithInscripciones = await attachInscripciones(supabase, data || []);

  res.json({
    data: sociosWithInscripciones,
    pagination: buildPagination(page, limit, count),
  });
});

export const getSocioById = asyncHandler(async (req, res) => {
  const supabase = getSupabase();

  const { data: socio, error } = await supabase
    .from('Socio')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !socio) return res.status(404).json({ error: 'Socio not found' });

  const [socioWithInscripciones] = await attachInscripciones(supabase, [socio]);

  res.json({ data: socioWithInscripciones });
});

export const createSocio = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const validated = createSocioSchema.parse(req.body);

  const { data, error } = await supabase
    .from('Socio')
    .insert([validated])
    .select()
    .single();

  if (error) throw error;
  res.status(201).json({ data, message: 'Socio created successfully' });
});

export const updateSocio = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const validated = updateSocioSchema.parse(req.body);

  const { data, error } = await supabase
    .from('Socio')
    .update(validated)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) throw error;
  res.json({ data, message: 'Socio updated successfully' });
});

export const deleteSocio = asyncHandler(async (req, res) => {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('Socio')
    .update({ activo: false })
    .eq('id', req.params.id);

  if (error) throw error;
  res.status(204).send();
});
