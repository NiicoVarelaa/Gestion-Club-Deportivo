import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { pagosService } from '../services'
import { Users, Trophy, CreditCard, AlertTriangle, TrendingUp, FileText, LayoutDashboardIcon } from 'lucide-react'
import { formatCurrency } from '../lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { StatsSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const statsCards = [
  { key: 'sociosActivos', label: 'Socios Activos', icon: Users, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
  { key: 'totalDeportes', label: 'Deportes', icon: Trophy, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  { key: 'inscripcionesActivas', label: 'Inscripciones', icon: FileText, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
  { key: 'pagosDelMes', label: 'Pagos del Mes', icon: CreditCard, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
]

const PIE_COLORS = ['#16a34a', '#d97706', '#dc2626']

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => pagosService.getDashboard().then((res) => res.data),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Resumen del club deportivo</p>
        </div>
        <StatsSkeleton />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={LayoutDashboardIcon}
        title="Error al cargar"
        description="No se pudo cargar la informacion del dashboard."
      />
    )
  }

  const paymentData = [
    { name: 'Pagados', value: data.pagosDelMes ?? 0 },
    { name: 'Pendientes', value: data.pagosPendientes ?? 0 },
    { name: 'Vencidos', value: data.pagosVencidos ?? 0 },
  ].filter((d) => d.value > 0)

  const barData = statsCards.map((s) => ({
    name: s.label,
    value: data[s.key] ?? 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen del club deportivo</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.key}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`rounded-lg p-2.5 sm:p-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold">{data[stat.key] ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg">Ingresos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
              {formatCurrency(data.ingresosDelMes || 0)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Mes {data.mesActual}/{data.anioActual}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg">Pagos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 sm:gap-8">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-amber-600">{data.pagosPendientes ?? 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Pendientes</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-destructive">{data.pagosVencidos ?? 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Vencidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {paymentData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">Sin datos de pagos</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen General</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acciones Rapidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button asChild>
              <Link to="/socios">
                <Users className="h-4 w-4" />
                Nuevo Socio
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/deportes">
                <Trophy className="h-4 w-4" />
                Gestionar Deportes
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/pagos">
                <CreditCard className="h-4 w-4" />
                Registrar Pago
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
