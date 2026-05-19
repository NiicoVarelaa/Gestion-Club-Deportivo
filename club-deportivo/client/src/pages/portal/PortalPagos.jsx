import { useEffect } from 'react'
import { useSocioStore } from '@/stores/socioStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, MESES } from '@/lib/utils'
import { AlertTriangle, CreditCard, TrendingUp } from 'lucide-react'

export default function PortalPagos() {
  const { pagos, deuda, loading, fetchPortalData } = useSocioStore()

  useEffect(() => {
    fetchPortalData()
  }, [fetchPortalData])

  if (loading) {
    return (
    <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    )
  }

  const totalPagado = (pagos || [])
    .filter((p) => p.estado === 'PAGADO')
    .reduce((sum, p) => sum + parseFloat(p.monto), 0)

  const pagosDelAnio = (pagos || []).filter((p) => p.anio === new Date().getFullYear())
  const pagosPagados = pagosDelAnio.filter((p) => p.estado === 'PAGADO').length
  const totalDelAnio = pagosDelAnio.length
  const progresoPagos = totalDelAnio > 0 ? (pagosPagados / totalDelAnio) * 100 : 0

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mis Pagos</h1>

      {deuda?.total > 0 && (
        <Alert variant="destructive" className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <AlertTitle>Deuda Pendiente</AlertTitle>
          <AlertDescription>
            Tenés <span className="font-bold">{deuda.cantidadMeses}</span> {deuda.cantidadMeses === 1 ? 'cuota impaga' : 'cuotas impagas'} por un total de{' '}
            <span className="font-bold">{formatCurrency(deuda.total)}</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total abonado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <p className="text-2xl font-bold">{formatCurrency(totalPagado)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pagos este año</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <p className="text-2xl font-bold">{pagosPagados}/{totalDelAnio}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progreso anual</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progresoPagos} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">{Math.round(progresoPagos)}% del año</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de pagos</CardTitle>
        </CardHeader>
        <CardContent>
          {pagos?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay registros de pagos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mes</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Monto</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos?.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-sm font-medium">
                        {MESES[p.mes - 1]} {p.anio}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        {formatCurrency(parseFloat(p.monto))}
                      </td>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}