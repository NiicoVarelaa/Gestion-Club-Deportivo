import { getSupabase } from '../utils/supabase.js';
import { createPagoSchema } from '../utils/validations.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getPagos = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { socioId, estado, mes, anio, page = 1, limit = 20 } = req.query;
  const from = (parseInt(page) - 1) * parseInt(limit);
  const to = from + parseInt(limit) - 1;

  let query = supabase
    .from('Pago')
    .select('*', { count: 'exact' })
    .order('anio', { ascending: false })
    .order('mes', { ascending: false })
    .range(from, to);

  if (socioId) query = query.eq('socioId', socioId);
  if (estado) query = query.eq('estado', estado);
  if (mes) query = query.eq('mes', parseInt(mes));
  if (anio) query = query.eq('anio', parseInt(anio));

  const { data, count, error } = await query;
  if (error) throw error;

  const list = data || [];

  if (list.length > 0) {
    const socioIds = [...new Set(list.map((p) => p.socioId))];
    const deporteIds = [...new Set(list.map((p) => p.deporteId))];

    const [{ data: socios }, { data: deportes }] = await Promise.all([
      supabase.from('Socio').select('*').in('id', socioIds),
      supabase.from('Deporte').select('*').in('id', deporteIds),
    ]);

    const socioMap = Object.fromEntries((socios || []).map((s) => [s.id, s]));
    const deporteMap = Object.fromEntries((deportes || []).map((d) => [d.id, d]));

    for (const pago of list) {
      pago.socio = socioMap[pago.socioId] || null;
      pago.deporte = deporteMap[pago.deporteId] || null;
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

export const createPago = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const validated = createPagoSchema.parse(req.body);

  const { data: existing } = await supabase
    .from('Pago')
    .select('*')
    .eq('socioId', validated.socioId)
    .eq('deporteId', validated.deporteId)
    .eq('mes', validated.mes)
    .eq('anio', validated.anio)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('Pago')
      .update({ estado: 'PAGADO', monto: validated.monto, fechaPago: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ data, message: 'Payment updated successfully' });
  } else {
    const { data, error } = await supabase
      .from('Pago')
      .insert([{ ...validated, estado: 'PAGADO', fechaPago: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data, message: 'Payment recorded successfully' });
  }
});

export const getDeudasBySocio = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const { socioId } = req.params;

  const { data: inscripciones } = await supabase
    .from('Inscripcion')
    .select('*')
    .eq('socioId', socioId)
    .eq('activo', true);

  if (!inscripciones?.length) {
    return res.json({ data: { socioId, deudasPorDeporte: [], totalDeuda: 0, totalMesesPendientes: 0 } });
  }

  const deporteIds = [...new Set(inscripciones.map((i) => i.deporteId))];
  const { data: deportes } = await supabase.from('Deporte').select('*').in('id', deporteIds);
  const deporteMap = Object.fromEntries((deportes || []).map((d) => [d.id, d]));

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const deudasPorDeporte = [];
  let totalDeuda = 0;

  for (const inscripcion of inscripciones) {
    const deporte = deporteMap[inscripcion.deporteId];
    if (!deporte) continue;

    const mesInscripcion = new Date(inscripcion.fechaInscripcion).getMonth() + 1;
    const anioInscripcion = new Date(inscripcion.fechaInscripcion).getFullYear();

    const mesesPendientes = [];
    let mes = mesInscripcion;
    let anio = anioInscripcion;

    while (anio < currentYear || (anio === currentYear && mes <= currentMonth)) {
      const { data: pago } = await supabase
        .from('Pago')
        .select('*')
        .eq('socioId', socioId)
        .eq('deporteId', inscripcion.deporteId)
        .eq('mes', mes)
        .eq('anio', anio)
        .single();

      if (!pago || pago.estado !== 'PAGADO') {
        const isVencido = anio < currentYear || (anio === currentYear && mes < currentMonth);
        mesesPendientes.push({
          mes,
          anio,
          monto: parseFloat(deporte.cuotaMensual),
          estado: isVencido ? 'VENCIDO' : 'PENDIENTE',
        });
      }

      mes++;
      if (mes > 12) { mes = 1; anio++; }
    }

    const deudaDeporte = mesesPendientes.reduce((sum, m) => sum + m.monto, 0);
    totalDeuda += deudaDeporte;

    if (mesesPendientes.length > 0) {
      deudasPorDeporte.push({
        deporteId: inscripcion.deporteId,
        deporteNombre: deporte.nombre,
        cuotaMensual: parseFloat(deporte.cuotaMensual),
        mesesPendientes,
        totalDeuda: deudaDeporte,
        cantidadMeses: mesesPendientes.length,
      });
    }
  }

  res.json({
    data: {
      socioId,
      deudasPorDeporte,
      totalDeuda,
      totalMesesPendientes: deudasPorDeporte.reduce((sum, d) => sum + d.cantidadMeses, 0),
    },
  });
});

export const generateMonthlyPayments = asyncHandler(async (req, res) => {
  const supabase = getSupabase();
  const now = new Date();
  const mes = now.getMonth() + 1;
  const anio = now.getFullYear();

  const { data: inscripciones } = await supabase
    .from('Inscripcion')
    .select('*')
    .eq('activo', true);

  if (!inscripciones?.length) {
    return res.json({ message: `No hay inscripciones activas para generar cuotas`, created: 0 });
  }

  const deporteIds = [...new Set(inscripciones.map((i) => i.deporteId))];
  const { data: deportes } = await supabase.from('Deporte').select('*').in('id', deporteIds);
  const deporteMap = Object.fromEntries((deportes || []).map((d) => [d.id, d]));

  let created = 0;

  for (const inscripcion of inscripciones) {
    const deporte = deporteMap[inscripcion.deporteId];
    if (!deporte) continue;

    const { data: existing } = await supabase
      .from('Pago')
      .select('*')
      .eq('socioId', inscripcion.socioId)
      .eq('deporteId', inscripcion.deporteId)
      .eq('mes', mes)
      .eq('anio', anio)
      .single();

    if (!existing) {
      await supabase.from('Pago').insert([{
        socioId: inscripcion.socioId,
        deporteId: inscripcion.deporteId,
        mes,
        anio,
        monto: deporte.cuotaMensual,
        estado: 'PENDIENTE',
      }]);
      created++;
    }
  }

  const { data: pagosPendientes } = await supabase
    .from('Pago')
    .select('id, mes, anio')
    .eq('estado', 'PENDIENTE');

  for (const pago of pagosPendientes || []) {
    if (pago.anio < anio || (pago.anio === anio && pago.mes < mes)) {
      await supabase.from('Pago').update({ estado: 'VENCIDO' }).eq('id', pago.id);
    }
  }

  res.json({ message: `Generated ${created} pending payments for ${mes}/${anio}`, created });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const supabase = getSupabase();

  const [
    { count: totalSocios },
    { count: sociosActivos },
    { count: totalDeportes },
    { count: inscripcionesActivas },
  ] = await Promise.all([
    supabase.from('Socio').select('*', { count: 'exact', head: true }),
    supabase.from('Socio').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('Deporte').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('Inscripcion').select('*', { count: 'exact', head: true }).eq('activo', true),
  ]);

  const now = new Date();
  const mes = now.getMonth() + 1;
  const anio = now.getFullYear();

  const { data: pagosMes } = await supabase
    .from('Pago')
    .select('monto')
    .eq('mes', mes)
    .eq('estado', 'PAGADO');

  const { count: pagosPendientes } = await supabase
    .from('Pago')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'PENDIENTE');

  const { count: pagosVencidos } = await supabase
    .from('Pago')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'VENCIDO');

  const ingresosDelMes = pagosMes?.reduce((sum, p) => sum + parseFloat(p.monto), 0) || 0;

  res.json({
    data: {
      totalSocios: totalSocios || 0,
      sociosActivos: sociosActivos || 0,
      totalDeportes: totalDeportes || 0,
      inscripcionesActivas: inscripcionesActivas || 0,
      pagosDelMes: pagosMes?.length || 0,
      pagosPendientes: pagosPendientes || 0,
      pagosVencidos: pagosVencidos || 0,
      ingresosDelMes,
      mesActual: mes,
      anioActual: anio,
    },
  });
});
