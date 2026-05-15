import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { pagosService, sociosService, deportesService } from '../services'
import { pagoSchema } from '../schemas'
import { Plus, AlertTriangle, CheckCircle, Clock, RefreshCw, CreditCard } from 'lucide-react'
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
import { TableSkeleton } from '../components/Skeleton'
import Pagination from '../components/Pagination'
import EmptyState from '../components/EmptyState'

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

const FILTROS = [
  { value: '', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'VENCIDO', label: 'Vencidos' },
  { value: 'PAGADO', label: 'Pagados' },
]

export default function Pagos() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSocio, setSelectedSocio] = useState(null)
  const [filterEstado, setFilterEstado] = useState('')
  const [page, setPage] = useState(1)
  const limit = 15

  const now = new Date()
  const currentMes = now.getMonth() + 1
  const currentAnio = now.getFullYear()

  const { data: pagosData, isLoading } = useQuery({
    queryKey: ['pagos', filterEstado, page],
    queryFn: () => pagosService.getAll({ estado: filterEstado || undefined, page, limit }).then((res) => res.data),
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
      toast.success(res.data.message || 'Cuotas generadas correctamente')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error al generar cuotas'),
  })

  const {
    register,
    handleSubmit,
    reset,
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
  const pagination = pagosData?.pagination
  const total = pagination?.total ?? pagos.length

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pagos</h1>
          <p className="text-muted-foreground">Gestion de cuotas y pagos</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => generateMutation.mutate()} size="sm">
            <RefreshCw className="h-4 w-4" />
            Generar Cuotas
          </Button>
          <Button onClick={() => { reset(); setModalOpen(true) }} size="sm">
            <Plus className="h-4 w-4" />
            Registrar Pago
          </Button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {FILTROS.map(({ value, label }) => (
          <Button
            key={value}
            variant={filterEstado === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilterEstado(value); setPage(1) }}
            className="shrink-0"
          >
            {label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <TableSkeleton rows={8} cols={6} />
          ) : pagos.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No hay pagos registrados"
              description={filterEstado ? 'No hay pagos con ese estado.' : 'Todavia no se registraron pagos en el sistema.'}
              action={!filterEstado ? { label: 'Generar Cuotas', onClick: () => generateMutation.mutate() } : undefined}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Socio</TableHead>
                      <TableHead className="hidden sm:table-cell">Deporte</TableHead>
                      <TableHead>Periodo</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="hidden md:table-cell">Fecha Pago</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagos.map((pago) => {
                      const Icon = estadoIcon[pago.estado]
                      const iconColor = pago.estado === 'PAGADO' ? 'text-emerald-600' : pago.estado === 'PENDIENTE' ? 'text-amber-600' : 'text-destructive'
                      return (
                        <TableRow key={pago.id}>
                          <TableCell className="font-medium">
                            {pago.socio?.nombre} {pago.socio?.apellido}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{pago.deporte?.nombre}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">
                            {MESES[pago.mes - 1]?.slice(0, 3)} {pago.anio}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(pago.monto)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={estadoVariant[pago.estado]} className="gap-1">
                              <Icon className={`h-3 w-3 ${iconColor}`} />
                              <span className="hidden xs:inline">{pago.estado}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {pago.fechaPago ? formatDate(pago.fechaPago) : '-'}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              {pagination && (
                <Pagination
                  page={pagination.page}
                  pages={pagination.pages}
                  total={pagination.total}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) { reset(); setSelectedSocio(null) } }}>
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
                    <option key={i} value={i + 1}>{mes.slice(0, 3)}</option>
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
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 sm:p-4">
                <h4 className="mb-2 text-sm font-medium text-amber-800">Deudas pendientes del socio:</h4>
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

            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
              <Button type="button" variant="secondary" onClick={() => { setModalOpen(false); reset(); setSelectedSocio(null) }}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Registrar Pago
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
