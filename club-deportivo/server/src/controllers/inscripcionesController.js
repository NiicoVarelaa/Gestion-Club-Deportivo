import { getSupabase } from '../utils/supabase.js';
import { createInscripcionSchema } from '../utils/validations.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getInscripciones = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { page = 1, limit = 10 } = req.query;
  const from = (parseInt(page) - 1) * parseInt(limit);
  const to = from + parseInt(limit) - 1;

  const { data, count, error } = await supabase
    .from('Inscripcion')
    .select('*', { count: 'exact' })
    .eq('activo', true)
    .order('fechaInscripcion', { ascending: false })
    .range(from, to);

  if (error) throw error;

  const list = data || [];

  if (list.length > 0) {
    const socioIds = [...new Set(list.map((i) => i.socioId))];
    const deporteIds = [...new Set(list.map((i) => i.deporteId))];

    const [{ data: socios }, { data: deportes }] = await Promise.all([
      supabase.from('Socio').select('*').in('id', socioIds),
      supabase.from('Deporte').select('*').in('id', deporteIds),
    ]);

    const socioMap = Object.fromEntries((socios || []).map((s) => [s.id, s]));
    const deporteMap = Object.fromEntries((deportes || []).map((d) => [d.id, d]));

    for (const insc of list) {
      insc.socio = socioMap[insc.socioId] || null;
      insc.deporte = deporteMap[insc.deporteId] || null;
    }
  }

  res.json({
    data: list,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count || 0,
      pages: Math.ceil((count || 0) / parseInt(limit)),
    },
  });
});

export const createInscripcion = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const validated = createInscripcionSchema.parse(req.body);

  const { data: existing } = await supabase
    .from('Inscripcion')
    .select('*')
    .eq('socioId', validated.socioId)
    .eq('deporteId', validated.deporteId)
    .single();

  if (existing?.activo) {
    return res.status(409).json({ error: 'El socio ya esta inscripto en este deporte' });
  }

  if (existing && !existing.activo) {
    const { data, error } = await supabase
      .from('Inscripcion')
      .update({ activo: true, fechaBaja: null })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json({ data, message: 'Reinscripcion exitosa' });
  }

  const { data, error } = await supabase
    .from('Inscripcion')
    .insert([validated])
    .select()
    .single();

  if (error) throw error;
  res.status(201).json({ data, message: 'Inscripcion creada exitosamente' });
});

export const cancelInscripcion = asyncHandler(async (req, res) => {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('Inscripcion')
    .update({ activo: false, fechaBaja: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) throw error;
  res.status(204).send();
});
