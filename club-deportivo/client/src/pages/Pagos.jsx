import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { pagoSchema } from '@/schemas'
import { Plus, AlertTriangle, CheckCircle, Clock, RefreshCw, CreditCard, FileDown } from 'lucide-react'
import { formatCurrency, formatDate, MESES, selectClassName } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DataTable from '@/components/DataTable'
import SocioSelect from '@/components/SocioSelect'
import { exportToPDF, exportToExcel, pagosExportColumns, formatPagoForExport } from '@/lib/export'
import { usePagos, useDeudas, useCreatePago, useGenerateCuotas } from '@/hooks/usePagos'
import { useSocioOptions } from '@/hooks/useSocios'
import { useDeportes } from '@/hooks/useDeportes'

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
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSocio, setSelectedSocio] = useState(null)
  const [filterEstado, setFilterEstado] = useState('')
  const [page, setPage] = useState(1)
  const [socioSelectKey, setSocioSelectKey] = useState(0)
  const limit = 15

  const now = new Date()
  const currentMes = now.getMonth() + 1
  const currentAnio = now.getFullYear()

  const { data: pagosData, isLoading } = usePagos({ estado: filterEstado, page, limit })

  const { data: sociosList = [] } = useSocioOptions()
  const { data: deportesList = [] } = useDeportes({ activo: 'true' })
  const { data: deudas } = useDeudas(selectedSocio)

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

  const createMutation = useCreatePago({
    onSuccess: () => {
      setModalOpen(false)
      resetDialog()
    },
  })

  const generateMutation = useGenerateCuotas()

  const onSubmit = (data) => {
    createMutation.mutate(data)
  }

  const selectSocio = (socio) => {
    setSelectedSocio(socio.id)
    setValue('socioId', socio.id)
  }

  const clearSocio = () => {
    setSelectedSocio(null)
    setValue('socioId', '')
  }

  const pagos = pagosData?.data || []
  const pagination = pagosData?.pagination

  const resetDialog = () => {
    reset()
    setSelectedSocio(null)
    setSocioSelectKey((k) => k + 1)
  }

  const handleExportPDF = () => {
    const cols = pagosExportColumns()
    const rows = pagos.map(formatPagoForExport)
    exportToPDF({ title: 'Reporte de Pagos', columns: cols, rows, filename: 'pagos' })
    toast.success('PDF exportado correctamente')
  }

  const handleExportExcel = () => {
    const cols = pagosExportColumns()
    const rows = pagos.map(formatPagoForExport)
    exportToExcel({ columns: cols, rows, filename: 'pagos' })
    toast.success('Excel exportado correctamente')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pagos</h1>
          <p className="text-muted-foreground">Gestion de cuotas y pagos</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={pagos.length === 0}>
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={pagos.length === 0}>
            <FileDown className="h-4 w-4" />
            Excel
          </Button>
          <Button variant="secondary" onClick={() => generateMutation.mutate()} size="sm">
            <RefreshCw className="h-4 w-4" />
            Generar Cuotas
          </Button>
          <Button onClick={() => { resetDialog(); setModalOpen(true) }} size="sm">
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

      <DataTable
        loading={isLoading}
        skeleton={{ rows: 8, cols: 6 }}
        isEmpty={pagos.length === 0}
        emptyState={{
          icon: CreditCard,
          title: 'No hay pagos registrados',
          description: filterEstado ? 'No hay pagos con ese estado.' : 'Todavia no se registraron pagos en el sistema.',
          action: !filterEstado ? { label: 'Generar Cuotas', onClick: () => generateMutation.mutate() } : undefined,
        }}
        pagination={pagination}
        onPageChange={setPage}
      >
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
      </DataTable>

      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) resetDialog() }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <SocioSelect
                key={socioSelectKey}
                socios={sociosList}
                value={selectedSocio}
                onSelect={selectSocio}
                onClear={clearSocio}
                error={errors.socioId?.message}
              />
              <div className="space-y-2">
                <Label htmlFor="deporteId">Deporte</Label>
                <select id="deporteId" {...register('deporteId')} className={selectClassName} defaultValue="">
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
                <select id="mes" {...register('mes')} className={selectClassName}>
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
              <Button type="button" variant="secondary" onClick={() => { setModalOpen(false); resetDialog() }}>
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