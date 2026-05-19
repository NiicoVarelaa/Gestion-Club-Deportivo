import { useEffect } from 'react'
import { useSocioStore } from '@/stores/socioStore'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { formatCurrency, formatDate, MESES } from '@/lib/utils'
import { AlertTriangle, Dumbbell, CalendarCheck, TrendingUp } from 'lucide-react'

export default function PortalDashboard() {
  const { socio, deportes, pagos, deuda, loading, fetchPortalData } = useSocioStore()

  useEffect(() => {
    fetchPortalData()
  }, [fetchPortalData])

  if (loading) {
    return (
    <div className="space-y-8 animate-fade-in">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const now = new Date()
  const mesActual = now.getMonth() + 1
  const anioActual = now.getFullYear()

  const pagosDelMes = pagos?.filter(
    (p) => p.mes === mesActual && p.anio === anioActual && p.estado === 'PAGADO'
  ) || []

  const totalAbonado = (pagos || [])
    .filter((p) => p.estado === 'PAGADO')
    .reduce((sum, p) => sum + parseFloat(p.monto), 0)

  const statusMesActual = pagosDelMes.length > 0 ? 'Al día' : 'Pendiente'

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        ¡Hola, <span className="text-primary">{socio?.nombre}</span>!
      </h1>

      {deuda?.total > 0 && (
        <Alert variant="destructive" className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <AlertTitle>Tenés cuotas pendientes</AlertTitle>
          <AlertDescription>
            Adeudás <span className="font-bold">{formatCurrency(deuda.total)}</span> correspondiente
            a {deuda.cantidadMeses} {deuda.cantidadMeses === 1 ? 'mes' : 'meses'}.
            <br />
            Regularizá tu situación para mantener el acceso a todas las disciplinas.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estado de cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            {deuda?.total > 0 ? (
              <Badge variant="destructive" className="text-base px-3 py-1">Deudor</Badge>
            ) : (
              <Badge className="text-base px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                Al día
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deportes activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              <p className="text-3xl font-bold">{deportes?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mes actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-500" />
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {statusMesActual}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total abonado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <p className="text-2xl font-bold">{formatCurrency(totalAbonado)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {deportes?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-12">Mis Disciplinas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deportes.map((d) => (
              <Card key={d.id} className="p-6 flex items-center gap-4 hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{d.nombre}</h3>
                  <p className="text-sm text-muted-foreground">
                    Inscripto desde {d.fechaInscripcion ? formatDate(d.fechaInscripcion) : '—'}
                  </p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {formatCurrency(parseFloat(d.cuotaMensual))}
                </Badge>
              </Card>
            ))}
          </div>
        </>
      )}

      {pagos?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-12">Últimos pagos</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mes</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Deporte</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Monto</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.slice(0, 5).map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-3 px-4 text-sm">
                        {MESES[p.mes - 1]} {p.anio}
                      </td>
                      <td className="py-3 px-4 text-sm">{p.deporteId?.slice(0, 8)}...</td>
                      <td className="py-3 px-4 text-sm text-right">{formatCurrency(parseFloat(p.monto))}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant={p.estado === 'PAGADO' ? 'default' : p.estado === 'VENCIDO' ? 'destructive' : 'secondary'}
                          className={
                            p.estado === 'PAGADO'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : ''
                          }
                        >
                          {p.estado}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}