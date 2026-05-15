import { getSupabase } from '../utils/supabase.js';
import { createSocioSchema, updateSocioSchema } from '../utils/validations.js';

export async function getSocios(req, res, next) {
  try {
    const supabase = getSupabase();
    const { page = 1, limit = 10, search, activo } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    let query = supabase.from('Socio').select('*', { count: 'exact' }).order('apellido', { ascending: true });

    if (activo !== undefined) query = query.eq('activo', activo === 'true');
    if (search) {
      query = query.or(`nombre.ilike.%${search}%,apellido.ilike.%${search}%,dni.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, count, error } = await query.range(from, to);
    if (error) throw error;

    const inscripcionesPromises = (data || []).map(async (socio) => {
      const { data: insc } = await supabase
        .from('Inscripcion')
        .select('*, Deporte(*)')
        .eq('socioId', socio.id)
        .eq('activo', true);
      return { ...socio, inscripciones: insc || [] };
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
  } catch (err) {
    next(err);
  }
}

export async function getSocioById(req, res, next) {
  try {
    const supabase = getSupabase();

    const { data: socio, error } = await supabase
      .from('Socio')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !socio) return res.status(404).json({ error: 'Socio not found' });

    const { data: inscripciones } = await supabase
      .from('Inscripcion')
      .select('*, Deporte(*)')
      .eq('socioId', socio.id)
      .eq('activo', true);

    res.json({
      data: {
        ...socio,
        inscripciones: inscripciones || [],
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createSocio(req, res, next) {
  try {
    const supabase = getSupabase();
    const validated = createSocioSchema.parse(req.body);

    const { data, error } = await supabase
      .from('Socio')
      .insert([validated])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data, message: 'Socio created successfully' });
  } catch (err) {
    next(err);
  }
}

export async function updateSocio(req, res, next) {
  try {
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
  } catch (err) {
    next(err);
  }
}

export async function deleteSocio(req, res, next) {
  try {
    const supabase = getSupabase();

    const { error } = await supabase
      .from('Socio')
      .update({ activo: false })
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Socio deactivated successfully' });
  } catch (err) {
    next(err);
  }
}
