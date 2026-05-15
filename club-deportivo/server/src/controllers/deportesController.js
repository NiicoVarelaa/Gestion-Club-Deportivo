import { getSupabase } from '../utils/supabase.js';
import { createDeporteSchema, updateDeporteSchema } from '../utils/validations.js';

export async function getDeportes(req, res, next) {
  try {
    const supabase = getSupabase();
    let query = supabase.from('Deporte').select('*').order('nombre', { ascending: true });

    if (req.query.activo !== undefined) {
      query = query.eq('activo', req.query.activo === 'true');
    }

    const { data, error } = await query;
    if (error) throw error;

    const deportesWithCount = await Promise.all(
      (data || []).map(async (deporte) => {
        const { count } = await supabase
          .from('Inscripcion')
          .select('*', { count: 'exact', head: true })
          .eq('deporteId', deporte.id)
          .eq('activo', true);
        return { ...deporte, _count: { inscripciones: count || 0 } };
      })
    );

    res.json({ data: deportesWithCount });
  } catch (err) {
    next(err);
  }
}

export async function getDeporteById(req, res, next) {
  try {
    const supabase = getSupabase();

    const { data: deporte, error } = await supabase
      .from('Deporte')
      .select('*, Inscripcion(*, Socio(*))')
      .eq('id', req.params.id)
      .single();

    if (error || !deporte) return res.status(404).json({ error: 'Deporte not found' });
    res.json({ data: deporte });
  } catch (err) {
    next(err);
  }
}

export async function createDeporte(req, res, next) {
  try {
    const supabase = getSupabase();
    const validated = createDeporteSchema.parse(req.body);

    const { data, error } = await supabase
      .from('Deporte')
      .insert([validated])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data, message: 'Deporte created successfully' });
  } catch (err) {
    next(err);
  }
}

export async function updateDeporte(req, res, next) {
  try {
    const supabase = getSupabase();
    const validated = updateDeporteSchema.parse(req.body);

    const { data, error } = await supabase
      .from('Deporte')
      .update(validated)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ data, message: 'Deporte updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteDeporte(req, res, next) {
  try {
    const supabase = getSupabase();

    const { error } = await supabase
      .from('Deporte')
      .update({ activo: false })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Deporte deactivated successfully' });
  } catch (err) {
    next(err);
  }
}
