import { getSupabase } from '../utils/supabase.js';
import { createSocioSchema, updateSocioSchema } from '../utils/validations.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

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

  const inscripcionesPromises = (data || []).map(async (socio) => {
    const { data: insc } = await supabase
      .from('Inscripcion')
      .select('*')
      .eq('socioId', socio.id)
      .eq('activo', true);

    const list = insc || [];
    if (list.length > 0) {
      const deporteIds = [...new Set(list.map((i) => i.deporteId))];
      const { data: deportes } = await supabase
        .from('Deporte')
        .select('*')
        .in('id', deporteIds);

      const deporteMap = Object.fromEntries((deportes || []).map((d) => [d.id, d]));
      for (const i of list) {
        i.deporte = deporteMap[i.deporteId] || null;
      }
    }

    return { ...socio, inscripciones: list };
  });

  const sociosWithInscripciones = await Promise.all(inscripcionesPromises);

  res.json({
    data: sociosWithInscripciones,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count || 0,
      pages: Math.ceil((count || 0) / parseInt(limit)),
    },
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

  const { data: inscripciones } = await supabase
    .from('Inscripcion')
    .select('*')
    .eq('socioId', socio.id)
    .eq('activo', true);

  const list = inscripciones || [];
  if (list.length > 0) {
    const deporteIds = [...new Set(list.map((i) => i.deporteId))];
    const { data: deportes } = await supabase
      .from('Deporte')
      .select('*')
      .in('id', deporteIds);

    const deporteMap = Object.fromEntries((deportes || []).map((d) => [d.id, d]));
    for (const i of list) {
      i.deporte = deporteMap[i.deporteId] || null;
    }
  }

  res.json({
    data: {
      ...socio,
      inscripciones: list,
    },
  });
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
