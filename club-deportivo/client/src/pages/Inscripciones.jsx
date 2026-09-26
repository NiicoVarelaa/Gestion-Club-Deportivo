import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { inscripcionSchema } from '../schemas'
import { Plus, Trash2, User, Trophy, FileText, FileDown } from 'lucide-react'
import { formatDate, selectClassName } from '../lib/utils'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
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
import DataTable from '../components/DataTable'
import { exportToPDF, exportToExcel, inscripcionesExportColumns, formatInscripcionForExport } from '../lib/export'
import { useInscripciones, useCreateInscripcion, useCancelInscripcion } from '../hooks/useInscripciones'
import { useSocioOptions } from '../hooks/useSocios'
import { useDeportes } from '../hooks/useDeportes'

export default function Inscripciones() {
  const [modalOpen, setModalOpen] = useState(false)
  const [cancelDialog, setCancelDialog] = useState(null)
  const [page, setPage] = useState(1)
  const limit = 10

  const { data: inscripciones, isLoading } = useInscripciones({ page, limit })

  const { data: sociosList = [] } = useSocioOptions()
  const { data: deportesList = [] } = useDeportes({ activo: 'true' })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inscripcionSchema),
  })

  const createMutation = useCreateInscripcion({
    onSuccess: () => {
      setModalOpen(false)
      reset()
    },
  })

  const cancelMutation = useCancelInscripcion({
    onSuccess: () => setCancelDialog(null),
  })

  const onSubmit = (data) => {
    createMutation.mutate(data)
  }

  const list = inscripciones?.data || []
  const pagination = inscripciones?.pagination
  const total = pagination?.total ?? list.length

  const handleExportPDF = () => {
    const cols = inscripcionesExportColumns()
    const rows = list.map(formatInscripcionForExport)
    exportToPDF({ title: 'Reporte de Inscripciones', columns: cols, rows, filename: 'inscripciones' })
    toast.success('PDF exportado correctamente')
  }

  const handleExportExcel = () => {
    const cols = inscripcionesExportColumns()
    const rows = list.map(formatInscripcionForExport)
    exportToExcel({ columns: cols, rows, filename: 'inscripciones' })
    toast.success('Excel exportado correctamente')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inscripciones</h1>
          <p className="text-muted-foreground">{total} inscripciones activas</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={list.length === 0}>
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={list.length === 0}>
            <FileDown className="h-4 w-4" />
            Excel
          </Button>
          <Button onClick={() => { reset(); setModalOpen(true) }} className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Nueva Inscripcion
          </Button>
        </div>
      </div>

      <DataTable
        loading={isLoading}
        skeleton={{ rows: 5, cols: 5 }}
        isEmpty={list.length === 0}
        emptyState={{
          icon: FileText,
          title: 'No hay inscripciones',
          description: 'Todavia no se registraron inscripciones en el sistema.',
          action: { label: 'Nueva Inscripcion', onClick: () => { reset(); setModalOpen(true) } },
        }}
        pagination={pagination}
        onPageChange={setPage}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Socio</TableHead>
              <TableHead>Deporte</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha Inscripcion</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((insc) => (
              <TableRow key={insc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium truncate">{insc.socio?.nombre} {insc.socio?.apellido}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{insc.deporte?.nombre}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {formatDate(insc.fechaInscripcion)}
                </TableCell>
                <TableCell>
                  <Badge variant="default">Activo</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setCancelDialog(insc)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>

      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) reset() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Inscripcion</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="socioId">Socio</Label>
              <select id="socioId" {...register('socioId')} className={selectClassName} defaultValue="">
                <option value="" disabled>Seleccionar socio</option>
                {sociosList.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre} {s.apellido} - DNI: {s.dni}</option>
                ))}
              </select>
              {errors.socioId && <p className="text-sm text-destructive">{errors.socioId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deporteId">Deporte</Label>
              <select id="deporteId" {...register('deporteId')} className={selectClassName} defaultValue="">
                <option value="" disabled>Seleccionar deporte</option>
                {deportesList.map((d) => (
                  <option key={d.id} value={d.id}>{d.nombre} - {d.cuotaMensual}/mes</option>
                ))}
              </select>
              {errors.deporteId && <p className="text-sm text-destructive">{errors.deporteId.message}</p>}
            </div>
            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
              <Button type="button" variant="secondary" onClick={() => { setModalOpen(false); reset() }}>
                Cancelar
              </Button>
              <Button type="submit">
                Inscribir
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!cancelDialog} onOpenChange={() => setCancelDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar inscripcion</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Estas seguro que deseas cancelar esta inscripcion? Esta accion no se puede deshacer.</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setCancelDialog(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => cancelMutation.mutate(cancelDialog.id)}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}