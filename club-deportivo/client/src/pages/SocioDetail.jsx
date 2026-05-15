import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { sociosService, pagosService } from '../services'
import { ArrowLeft, Mail, Phone, Calendar, CreditCard } from 'lucide-react'
import { formatCurrency, formatDate, MESES } from '../lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

export default function SocioDetail() {
  const { id } = useParams()

  const { data: socioData, isLoading, isError } = useQuery({
    queryKey: ['socio', id],
    queryFn: () => sociosService.getById(id).then((res) => res.data),
  })

  const { data: deudasData } = useQuery({
    queryKey: ['deudas', id],
    queryFn: () => pagosService.getDeudas(id).then((res) => res.data),
    enabled: !!id,
  })

  if (isLoading) return <div className="flex justify-center py-12 text-muted-foreground">Cargando...</div>
  if (isError || !socioData) return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <p className="text-muted-foreground">No se pudo cargar el socio</p>
      <Button variant="outline" asChild>
        <Link to="/socios">Volver a Socios</Link>
      </Button>
    </div>
  )

  const socio = socioData
  const deudas = deudasData || { deudasPorDeporte: [], totalDeuda: 0 }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button size="icon" variant="ghost" asChild>
          <Link to="/socios">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{socio.nombre} {socio.apellido}</h1>
          <p className="text-muted-foreground">DNI: {socio.dni}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Informacion Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{socio.email}</span>
            </div>
            {socio.telefono && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{socio.telefono}</span>
              </div>
            )}
            {socio.fechaNacimiento && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(socio.fechaNacimiento)}</span>
              </div>
            )}
            {socio.fechaAlta && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Alta: {formatDate(socio.fechaAlta)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deportes Inscriptos</CardTitle>
          </CardHeader>
          <CardContent>
            {socio.inscripciones?.length > 0 ? (
              <div className="space-y-2">
                {socio.inscripciones.map((insc) => (
                  <div key={insc.id} className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">{insc.deporte.nombre}</span>
                    <span className="text-sm text-muted-foreground">{formatCurrency(insc.deporte.cuotaMensual)}/mes</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tiene deportes asignados</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
            <CreditCard className="h-5 w-5 text-destructive" />
            <CardTitle>Deuda Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{formatCurrency(deudas.totalDeuda)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {deudas.totalMesesPendientes} meses pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      {deudas.deudasPorDeporte.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Deudas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deudas.deudasPorDeporte.map((deuda) => (
              <div key={deuda.deporteId} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-medium">{deuda.deporteNombre}</h4>
                  <span className="font-semibold text-destructive">{formatCurrency(deuda.totalDeuda)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {deuda.mesesPendientes.map((m, i) => (
                    <Badge key={i} variant={m.estado === 'VENCIDO' ? 'destructive' : 'secondary'}>
                      {MESES[m.mes - 1]} {m.anio}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
