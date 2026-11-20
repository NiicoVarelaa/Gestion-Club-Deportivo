import { Link } from 'react-router-dom'
import {
  Users,
  Trophy,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  FileText,
  LayoutDashboardIcon,
  ArrowRight,
  ArrowUpRight,
  UserPlus,
  CalendarCheck,
} from 'lucide-react'
import { formatCurrency, cn, MESES } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Skeleton from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useDashboard } from '@/hooks/usePagos'

const CHART_TOOLTIP = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 10,
  fontSize: 12,
  padding: '8px 12px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
}

const quickActions = [
  {
    to: '/admin/socios',
    label: 'Nuevo socio',
    description: 'Dar de alta un socio',
    icon: UserPlus,
    tone: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
  },
  {
    to: '/admin/pagos',
    label: 'Registrar pago',
    description: 'Cobrar una cuota',
    icon: CreditCard,
    tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
  {
    to: '/admin/deportes',
    label: 'Gestionar deportes',
    description: 'Disciplinas y cuotas',
    icon: Trophy,
    tone: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400',
  },
  {
    to: '/admin/inscripciones',
    label: 'Inscripciones',
    description: 'Altas en disciplinas',
    icon: FileText,
    tone: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
  },
]

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural
}

export default function Dashboard() {
  const { data: dashboardResponse, isLoading, isError, refetch } = useDashboard()

  const data = dashboardResponse?.data

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={LayoutDashboardIcon}
        title="No pudimos cargar el dashboard"
        description="Revisá tu conexión e intentá de nuevo."
        action={{ label: 'Reintentar', onClick: () => refetch() }}
      />
    )
  }

  const {
    sociosActivos = 0,
    totalSocios = 0,
    totalDeportes = 0,
    inscripcionesActivas = 0,
    pagosDelMes = 0,
    pagosPendientes = 0,
    pagosVencidos = 0,
    ingresosDelMes = 0,
    mesActual = new Date().getMonth() + 1,
    anioActual = new Date().getFullYear(),
  } = data

  const totalCuotas = pagosDelMes + pagosPendientes + pagosVencidos
  const tasaCobro = totalCuotas > 0 ? Math.round((pagosDelMes / totalCuotas) * 100) : 0
  const porcentajeActivos = totalSocios > 0 ? Math.round((sociosActivos / totalSocios) * 100) : 0

  const statsCards = [
    {
      key: 'sociosActivos',
      label: 'Socios activos',
      value: sociosActivos,
      icon: Users,
      iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
      barClass: 'bg-blue-500',
      detail: `de ${totalSocios} socios registrados`,
      badge: `${porcentajeActivos}%`,
    },
    {
      key: 'totalDeportes',
      label: 'Deportes activos',
      value: totalDeportes,
      icon: Trophy,
      iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      barClass: 'bg-emerald-500',
      detail: `${inscripcionesActivas} ${pluralize(inscripcionesActivas, 'inscripción activa', 'inscripciones activas')}`,
    },
    {
      key: 'inscripcionesActivas',
      label: 'Inscripciones',
      value: inscripcionesActivas,
      icon: FileText,
      iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400',
      barClass: 'bg-violet-500',
      detail: totalDeportes > 0 ? `en ${totalDeportes} ${pluralize(totalDeportes, 'disciplina', 'disciplinas')}` : 'Sin disciplinas activas',
    },
    {
      key: 'pagosDelMes',
      label: 'Pagos del mes',
      value: pagosDelMes,
      icon: CreditCard,
      iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      barClass: 'bg-amber-500',
      detail: `${formatCurrency(ingresosDelMes)} cobrados`,
    },
  ]

  const paymentData = [
    { name: 'Pagados', value: pagosDelMes, color: '#10b981', dot: 'bg-emerald-500' },
    { name: 'Pendientes', value: pagosPendientes, color: '#f59e0b', dot: 'bg-amber-500' },
    { name: 'Vencidos', value: pagosVencidos, color: '#ef4444', dot: 'bg-red-500' },
  ].filter((item) => item.value > 0)

  const barData = [
    { name: 'Socios', value: sociosActivos, fill: '#3b82f6' },
    { name: 'Deportes', value: totalDeportes, fill: '#10b981' },
    { name: 'Inscripciones', value: inscripcionesActivas, fill: '#8b5cf6' },
    { name: 'Pagos', value: pagosDelMes, fill: '#f59e0b' },
  ]

  const periodo = `${MESES[mesActual - 1]} ${anioActual}`

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Panel administrativo
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Hola de nuevo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Así está el club en {periodo}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/socios">
              <UserPlus className="h-4 w-4" />
              Nuevo socio
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/pagos">
              <CreditCard className="h-4 w-4" />
              Registrar pago
            </Link>
          </Button>
        </div>
      </header>

      {pagosVencidos > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              Hay {pagosVencidos} {pluralize(pagosVencidos, 'cuota vencida', 'cuotas vencidas')}
            </p>
            <p className="text-xs text-muted-foreground">
              Revisá los pagos impagos y contactá a los socios para regularizar la situación.
            </p>
          </div>
          <Button variant="destructive" size="sm" asChild className="self-start sm:self-auto">
            <Link to="/admin/pagos">
              Ver pagos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {statsCards.map((stat) => (
          <Card
            key={stat.key}
            className="group relative overflow-hidden transition-shadow hover:shadow-md"
          >
            <span className={cn('absolute inset-x-0 top-0 h-1', stat.barClass)} aria-hidden="true" />
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <span className={cn('rounded-xl p-2.5', stat.iconClass)}>
                  <stat.icon className="h-5 w-5" />
                </span>
                {stat.badge && (
                  <Badge variant="secondary" className="font-semibold">
                    {stat.badge}
                  </Badge>
                )}
              </div>
              <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight">
                {stat.value.toLocaleString('es-AR')}
              </p>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
                <span className="text-xs text-muted-foreground">{stat.detail}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-3 sm:gap-4 lg:grid-cols-5">
        <Card className="relative overflow-hidden border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-card to-card dark:border-emerald-900/50 dark:from-emerald-950/40 dark:via-card dark:to-card lg:col-span-2">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl"
            aria-hidden="true"
          />
          <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
            <span className="rounded-lg bg-emerald-600/10 p-2 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </span>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos del mes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-3xl font-bold tabular-nums tracking-tight text-emerald-700 dark:text-emerald-400">
                {formatCurrency(ingresosDelMes)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Cobrado en {periodo}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Cuotas al día</span>
                <span className="font-semibold tabular-nums">
                  {pagosDelMes} de {totalCuotas}
                </span>
              </div>
              <Progress
                value={tasaCobro}
                className="h-2 bg-emerald-600/15 [&>div]:bg-emerald-600 dark:[&>div]:bg-emerald-500"
                aria-label={`${tasaCobro}% de las cuotas están al día`}
              />
              <p className="text-xs text-muted-foreground">
                {tasaCobro}% de las cuotas registradas están al día.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">Estado de pagos</CardTitle>
              <CardDescription>Distribución de cuotas registradas</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="-mr-2 text-muted-foreground">
              <Link to="/admin/pagos">
                Ver todo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {paymentData.length > 0 ? (
              <div className="grid items-center gap-4 sm:grid-cols-2">
                <figure className="relative">
                  <figcaption className="sr-only">
                    Estado de pagos: {paymentData.map((d) => `${d.name}: ${d.value}`).join(', ')}
                  </figcaption>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart
                      role="img"
                      aria-label={`Estado de pagos: ${paymentData.map((d) => `${d.name}: ${d.value}`).join(', ')}`}
                    >
                      <Pie
                        data={paymentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={92}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {paymentData.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={CHART_TOOLTIP} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold tabular-nums">{totalCuotas}</span>
                    <span className="text-xs text-muted-foreground">
                      {pluralize(totalCuotas, 'cuota', 'cuotas')}
                    </span>
                  </div>
                  <table className="sr-only" aria-label="Datos del gráfico estado de pagos">
                    <caption>Estado de pagos</caption>
                    <thead>
                      <tr>
                        <th scope="col">Estado</th>
                        <th scope="col">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentData.map((d) => (
                        <tr key={d.name}>
                          <td>{d.name}</td>
                          <td>{d.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </figure>

                <ul className="space-y-3">
                  {paymentData.map((item) => {
                    const porcentaje = totalCuotas > 0 ? Math.round((item.value / totalCuotas) * 100) : 0
                    return (
                      <li
                        key={item.name}
                        className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2.5"
                      >
                        <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', item.dot)} />
                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                        <span className="text-sm font-semibold tabular-nums">{item.value}</span>
                        <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                          {porcentaje}%
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarCheck className="mb-2 h-8 w-8 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">Todavía no hay cuotas registradas.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3 sm:gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Resumen general</CardTitle>
            <CardDescription>Indicadores principales del club</CardDescription>
          </CardHeader>
          <CardContent>
            <figure>
              <figcaption className="sr-only">
                Resumen general: {barData.map((d) => `${d.name}: ${d.value}`).join(', ')}
              </figcaption>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={barData}
                  role="img"
                  aria-label={`Resumen general: ${barData.map((d) => `${d.name}: ${d.value}`).join(', ')}`}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    width={40}
                    className="text-muted-foreground"
                  />
                  <Tooltip contentStyle={CHART_TOOLTIP} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} />
                  <Bar dataKey="value" name="Cantidad" radius={[6, 6, 0, 0]} barSize={40}>
                    {barData.map((item) => (
                      <Cell key={item.name} fill={item.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <table className="sr-only" aria-label="Datos del gráfico resumen general">
                <caption>Resumen general</caption>
                <thead>
                  <tr>
                    <th scope="col">Categoría</th>
                    <th scope="col">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {barData.map((d) => (
                    <tr key={d.name}>
                      <td>{d.name}</td>
                      <td>{d.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Acciones rápidas</CardTitle>
            <CardDescription>Atajos a las tareas más frecuentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-primary/40 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className={cn('inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', action.tone)}>
                    <action.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-tight">{action.label}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="mt-5 h-8 w-20" />
            <Skeleton className="mt-2 h-4 w-28" />
            <Skeleton className="mt-4 h-3 w-full" />
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-5">
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-xl lg:col-span-3" />
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-5">
        <Skeleton className="h-72 rounded-xl lg:col-span-3" />
        <Skeleton className="h-72 rounded-xl lg:col-span-2" />
      </div>
    </div>
  )
}
