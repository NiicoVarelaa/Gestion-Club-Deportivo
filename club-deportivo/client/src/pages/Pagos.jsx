import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { pagosService, sociosService, deportesService } from '../services'
import { pagoSchema } from '../schemas'
import { Plus, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react'
import { formatCurrency, MESES } from '../lib/utils'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'

const selectStyles = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

const estadoIcon = {
  PAGADO: CheckCircle,
  PENDIENTE: Clock,
  VENCIDO: AlertTriangle,
}

const estadoVariant = {
  PAGADO: 'default',
  PENDIENTE: 'secondary',
  VENCIDO: 'destructive',
}

const estadoColor = {
  PAGADO: 'text-green-600',
  PENDIENTE: 'text-yellow-600',
  VENCIDO: 'text-destructive',
}

export default function Pagos() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSocio, setSelectedSocio] = useState(null)
  const [filterEstado, setFilterEstado] = useState('')

  const now = new Date()
  const currentMes = now.getMonth() + 1
  const currentAnio = now.getFullYear()

  const { data: pagosData, isLoading } = useQuery({
    queryKey: ['pagos', filterEstado],
    queryFn: () => pagosService.getAll({ estado: filterEstado || undefined, limit: 100 }).then((res) => res.data),
  })

  const { data: socios } = useQuery({
    queryKey: ['socios-select'],
    queryFn: () => sociosService.getAll({ activo: 'true', limit: 200 }).then((res) => res.data),
  })

  const { data: deportes } = useQuery({
    queryKey: ['deportes-select'],
    queryFn: () => deportesService.getAll({ activo: 'true' }).then((res) => res.data),
  })

  const { data: deudas, refetch: refetchDeudas } = useQuery({
    queryKey: ['deudas', selectedSocio],
    queryFn: () => pagosService.getDeudas(selectedSocio).then((res) => res.data),
    enabled: !!selectedSocio,
  })

  const createMutation = useMutation({
    mutationFn: pagosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['pagos'])
      queryClient.invalidateQueries(['deudas'])
      toast.success('Pago registrado correctamente')
      setModalOpen(false)
      reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error al registrar pago'),
  })

  const generateMutation = useMutation({
    mutationFn: pagosService.generateMonthly,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['pagos'])
      toast.success(res.data.message)
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      mes: currentMes,
      anio: currentAnio,
    },
  })

  const onSubmit = (data) => {
    createMutation.mutate(data)
  }

  const handleSocioChange = (e) => {
    const socioId = e.target.value
    setSelectedSocio(socioId)
    setValue('socioId', socioId)
    if (socioId) refetchDeudas()
  }

  const pagos = pagosData?.data || []
  const sociosList = socios?.data || []
  const deportesList = deportes?.data || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pagos</h1>
          <p className="text-muted-foreground">Gestion de cuotas y pagos</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => generateMutation.mutate()}>
            <RefreshCw className="h-4 w-4" />
            Generar Cuotas del Mes
          </Button>
          <Button onClick={() => { reset(); setModalOpen(true) }}>
            <Plus className="h-4 w-4" />
            Registrar Pago
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        {['', 'PAGADO', 'PENDIENTE', 'VENCIDO'].map((estado) => (
          <Button
            key={estado}
            variant={filterEstado === estado ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterEstado(estado)}
          >
            {estado || 'Todos'}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Socio</TableHead>
                <TableHead>Deporte</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : pagos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No hay pagos registrados
                  </TableCell>
                </TableRow>
              ) : (
                pagos.map((pago) => {
                  const Icon = estadoIcon[pago.estado]
                  return (
                    <TableRow key={pago.id}>
                      <TableCell className="font-medium">
                        {pago.socio.nombre} {pago.socio.apellido}
                      </TableCell>
                      <TableCell>{pago.deporte.nombre}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {MESES[pago.mes - 1]} {pago.anio}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(pago.monto)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={estadoVariant[pago.estado]} className="gap-1.5">
                          <Icon className={`h-3.5 w-3.5 ${estadoColor[pago.estado]}`} />
                          {pago.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString('es-AR') : '-'}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) reset() }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="socioId">Socio</Label>
                <select
                  id="socioId"
                  className={selectStyles}
                  defaultValue=""
                  onChange={handleSocioChange}
                >
                  <option value="" disabled>Seleccionar socio</option>
                  {sociosList.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre} {s.apellido}</option>
                  ))}
                </select>
                {errors.socioId && <p className="text-sm text-destructive">{errors.socioId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deporteId">Deporte</Label>
                <select id="deporteId" {...register('deporteId')} className={selectStyles} defaultValue="">
                  <option value="" disabled>Seleccionar deporte</option>
                  {deportesList.map((d) => (
                    <option key={d.id} value={d.id}>{d.nombre}</option>
                  ))}
                </select>
                {errors.deporteId && <p className="text-sm text-destructive">{errors.deporteId.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="mes">Mes</Label>
                <select id="mes" {...register('mes')} className={selectStyles}>
                  {MESES.map((mes, i) => (
                    <option key={i} value={i + 1}>{mes}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="anio">Anio</Label>
                <Input id="anio" type="number" {...register('anio')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monto">Monto ($)</Label>
                <Input id="monto" type="number" step="0.01" {...register('monto')} />
                {errors.monto && <p className="text-sm text-destructive">{errors.monto.message}</p>}
              </div>
            </div>

            {deudas && deudas.deudasPorDeporte.length > 0 && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-yellow-800">Deudas pendientes del socio:</h4>
                <div className="space-y-1">
                  {deudas.deudasPorDeporte.map((d) => (
                    <div key={d.deporteId} className="flex justify-between text-sm">
                      <span>{d.deporteNombre}</span>
                      <span className="font-medium">{formatCurrency(d.totalDeuda)} ({d.cantidadMeses} meses)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => { setModalOpen(false); reset() }}>
                Cancelar
              </Button>
              <Button type="submit">
                Registrar Pago
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
