import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const DEMO_EMAIL = 'demo@gesclub.com'
const DEMO_PASSWORD = 'Demo1234'

const DEPORTES = [
  { nombre: 'Fútbol', descripcion: 'Fútbol 11, categoría libre', cuotaMensual: 5000 },
  { nombre: 'Natación', descripcion: 'Pileta cubierta climatizada', cuotaMensual: 4000 },
  { nombre: 'Básquet', descripcion: 'Primera división y formativas', cuotaMensual: 4500 },
  { nombre: 'Tenis', descripcion: 'Clases y torneos todos los niveles', cuotaMensual: 6000 },
  { nombre: 'Vóley', descripcion: 'Femenino y masculino', cuotaMensual: 3500 },
]

// Month 1-5 (Enero a Mayo 2026)
// socio deportes: Fútbol (id 0), Natación (id 1), Básquet (id 2)
// null = no inscrito ese mes
const PAGOS = [
  // Fútbol:  Ene    Feb    Mar    Abr      May
  //          pagado pagado pagado pendiente vencido
  { deporteIdx: 0, meses: [1, 2, 3, 4, 5], estados: ['PAGADO', 'PAGADO', 'PAGADO', 'PENDIENTE', 'VENCIDO'], fechas: ['2026-01-05', '2026-02-03', '2026-03-07', null, null] },
  // Natación:        Mar    Abr      May
  //                  pagado pagado   pendiente
  { deporteIdx: 1, meses: [3, 4, 5], estados: ['PAGADO', 'PAGADO', 'PENDIENTE'], fechas: ['2026-03-10', '2026-04-08', null] },
  // Básquet:  Ene    Feb      Mar      Abr      May
  //          pagado vencido  vencido  vencido  vencido
  { deporteIdx: 2, meses: [1, 2, 3, 4, 5], estados: ['PAGADO', 'VENCIDO', 'VENCIDO', 'VENCIDO', 'VENCIDO'], fechas: ['2026-01-12', null, null, null, null] },
]

async function main() {
  console.log('=== Seed Demo - GesClub ===\n')

  // 1. Check if demo socio already exists
  const { data: existingSocio } = await supabase
    .from('Socio')
    .select('id, nombre, apellido')
    .eq('email', DEMO_EMAIL)
    .maybeSingle()
  if (existingSocio) {
    console.log(`El socio ${existingSocio.nombre} ${existingSocio.apellido} (${DEMO_EMAIL}) ya existe.`)
    console.log('Si querés regenerar los datos, eliminalo desde el dashboard de Supabase (Socio + Auth User).')
    return
  }

  // 2. Create auth user (catch "already registered" error)
  console.log('Creando usuario auth...')
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { nombre: 'Juan', apellido: 'Pérez', dni: '40123456' },
  })
  let userId
  if (authError) {
    if (!authError.message?.toLowerCase().includes('already been registered')) {
      console.error('Error creando usuario:', authError.message)
      return
    }
    console.log('  ~ Usuario ya registrado en Auth, buscando ID...')
    const { data: users } = await supabase.auth.admin.listUsers()
    const existing = users?.users?.find((u) => u.email === DEMO_EMAIL)
    if (!existing) { console.error('No se pudo encontrar el usuario en Auth'); return }
    userId = existing.id
    console.log(`  ~ Usando usuario existente (id: ${userId})`)
  } else {
    userId = authData.user.id
    console.log(`  ✓ Usuario creado: ${DEMO_EMAIL} (id: ${userId})`)
  }

  // 3. Create Socio record
  console.log('Creando socio...')
  const { data: socio, error: socioError } = await supabase
    .from('Socio')
    .insert({
      dni: '40123456',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: DEMO_EMAIL,
      telefono: '3815550101',
      fechaNacimiento: '1995-06-15',
      supabaseUserId: userId,
    })
    .select('*')
    .single()
  if (socioError) { console.error('Error creando socio:', socioError.message); return }
  console.log(`  ✓ Socio creado: ${socio.nombre} ${socio.apellido} (id: ${socio.id})`)

  // 4. Create Deportes (skip if already exist by nombre)
  console.log('Creando deportes...')
  const deporteIds = []
  for (const dep of DEPORTES) {
    const { data: existing } = await supabase.from('Deporte').select('id').eq('nombre', dep.nombre).maybeSingle()
    if (existing) {
      deporteIds.push(existing.id)
      console.log(`  ~ ${dep.nombre} ya existe (id: ${existing.id})`)
      continue
    }
    const { data: d, error: de } = await supabase.from('Deporte').insert(dep).select('*').single()
    if (de) { console.error(`  ✗ Error creando ${dep.nombre}:`, de.message); return }
    deporteIds.push(d.id)
    console.log(`  ✓ ${dep.nombre} creado (id: ${d.id}, cuota: $${dep.cuotaMensual})`)
  }

  // 5. Create Inscripciones (Fútbol, Natación, Básquet)
  console.log('Creando inscripciones...')
  const inscDeportes = [0, 1, 2] // Fútbol, Natación, Básquet
  for (const idx of inscDeportes) {
    const depId = deporteIds[idx]
    const { data: existing } = await supabase
      .from('Inscripcion')
      .select('id')
      .eq('socioId', socio.id)
      .eq('deporteId', depId)
      .maybeSingle()
    if (existing) {
      console.log(`  ~ ${DEPORTES[idx].nombre} ya inscrito`)
      continue
    }
    const { error: ie } = await supabase.from('Inscripcion').insert({
      socioId: socio.id,
      deporteId: depId,
      activo: true,
    })
    if (ie) { console.error(`  ✗ Error inscribiendo en ${DEPORTES[idx].nombre}:`, ie.message); return }
    console.log(`  ✓ Inscripto en ${DEPORTES[idx].nombre}`)
  }

  // 6. Create Pagos
  console.log('Creando pagos...')
  let totalPagos = 0
  for (const plan of PAGOS) {
    const depId = deporteIds[plan.deporteIdx]
    const cuota = DEPORTES[plan.deporteIdx].cuotaMensual
    for (let i = 0; i < plan.meses.length; i++) {
      const mes = plan.meses[i]
      const estado = plan.estados[i]
      const fechaPago = plan.fechas[i]

      const { data: existing } = await supabase
        .from('Pago')
        .select('id')
        .eq('socioId', socio.id)
        .eq('deporteId', depId)
        .eq('mes', mes)
        .eq('anio', 2026)
        .maybeSingle()
      if (existing) {
        console.log(`  ~ Pago ${DEPORTES[plan.deporteIdx].nombre} ${mes}/2026 ya existe`)
        continue
      }

      const { error: pe } = await supabase.from('Pago').insert({
        socioId: socio.id,
        deporteId: depId,
        mes,
        anio: 2026,
        monto: cuota,
        estado,
        fechaPago: fechaPago || null,
      })
      if (pe) { console.error(`  ✗ Error creando pago:`, pe.message); return }
      totalPagos++
      console.log(`  ✓ ${DEPORTES[plan.deporteIdx].nombre} ${mes}/2026 → ${estado}${fechaPago ? ` (${fechaPago})` : ''}`)
    }
  }

  console.log('\n=== Seed completado ===')
  console.log(`  Socio:  ${socio.nombre} ${socio.apellido} (${DEMO_EMAIL} / ${DEMO_PASSWORD})`)
  console.log(`  Deportes: ${deporteIds.length}`)
  console.log(`  Inscripciones: ${inscDeportes.length}`)
  console.log(`  Pagos: ${totalPagos}`)
}

main().catch(console.error)
