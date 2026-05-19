import { getSupabase } from '../utils/supabase.js';

export async function getPortalData(req, res, next) {
  try {
    const supabase = getSupabase();
    const userId = req.user.id;

    const { data: socio, error: socioError } = await supabase
      .from('Socio')
      .select('*')
      .eq('supabaseUserId', userId)
      .single();

    if (socioError || !socio) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    const { data: inscripciones } = await supabase
      .from('Inscripcion')
      .select('*')
      .eq('socioId', socio.id)
      .eq('activo', true);

    const deporteIds = (inscripciones || []).map((i) => i.deporteId);

    let deportes = [];
    if (deporteIds.length > 0) {
      const { data } = await supabase
        .from('Deporte')
        .select('*')
        .in('id', deporteIds);
      deportes = data || [];
    }

    const { data: pagos } = await supabase
      .from('Pago')
      .select('*')
      .eq('socioId', socio.id)
      .order('anio', { ascending: false })
      .order('mes', { ascending: false });

    const deuda = (pagos || []).filter((p) => p.estado === 'PENDIENTE' || p.estado === 'VENCIDO');

    const deportesConFecha = deportes.map((d) => {
      const insc = inscripciones.find((i) => i.deporteId === d.id);
      return { ...d, fechaInscripcion: insc?.fechaInscripcion || null };
    });

    res.json({
      socio,
      deportes: deportesConFecha,
      pagos: pagos || [],
      deuda: {
        total: deuda.reduce((sum, p) => sum + parseFloat(p.monto), 0),
        detalle: deuda,
        cantidadMeses: deuda.length,
      },
    });
  } catch (err) {
    next(err);
  }
}