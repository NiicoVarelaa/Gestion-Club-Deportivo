import { getSupabase } from '../utils/supabase.js';
import { createInscripcionSchema } from '../utils/validations.js';

export async function getInscripciones(req, res, next) {
  try {
    const supabase = getSupabase();
    let query = supabase
      .from('Inscripcion')
      .select('*, Socio(*), Deporte(*)')
      .eq('activo', true)
      .order('fechaInscripcion', { ascending: false });

    if (req.query.socioId) query = query.eq('socioId', req.query.socioId);
    if (req.query.deporteId) query = query.eq('deporteId', req.query.deporteId);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ data: data || [] });
  } catch (err) {
    next(err);
  }
}

export async function createInscripcion(req, res, next) {
  try {
    const supabase = getSupabase();
    const validated = createInscripcionSchema.parse(req.body);

    const { data: existing } = await supabase
      .from('Inscripcion')
      .select('*')
      .eq('socioId', validated.socioId)
      .eq('deporteId', validated.deporteId)
      .single();

    if (existing?.activo) {
      return res.status(409).json({ error: 'Socio already enrolled in this sport' });
    }

    if (existing && !existing.activo) {
      const { data, error } = await supabase
        .from('Inscripcion')
        .update({ activo: true, fechaBaja: null })
        .eq('id', existing.id)
        .select('*, Socio(*), Deporte(*)')
        .single();

      if (error) throw error;
      return res.status(200).json({ data, message: 'Re-enrollment successful' });
    }

    const { data, error } = await supabase
      .from('Inscripcion')
      .insert([validated])
      .select('*, Socio(*), Deporte(*)')
      .single();

    if (error) throw error;
    res.status(201).json({ data, message: 'Inscription created successfully' });
  } catch (err) {
    next(err);
  }
}

export async function cancelInscripcion(req, res, next) {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('Inscripcion')
      .update({ activo: false, fechaBaja: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ data, message: 'Inscription cancelled successfully' });
  } catch (err) {
    next(err);
  }
}
