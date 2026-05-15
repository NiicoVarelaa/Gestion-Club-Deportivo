import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { inscripcionesService, sociosService, deportesService } from '../services'
import { inscripcionSchema } from '../schemas'
import { Plus, Trash2, User, Trophy } from 'lucide-react'
import { formatDate } from '../lib/utils'
import { Button } from '../components/ui/button'
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

export default function Inscripciones() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [cancelDialog, setCancelDialog] = useState(null)

  const { data: inscripciones, isLoading } = useQuery({
    queryKey: ['inscripciones'],
    queryFn: () => inscripcionesService.getAll().then((res) => res.data),
  })

  const { data: socios } = useQuery({
    queryKey: ['socios-select'],
    queryFn: () => sociosService.getAll({ activo: 'true', limit: 200 }).then((res) => res.data),
  })

  const { data: deportes } = useQuery({
    queryKey: ['deportes-select'],
    queryFn: () => deportesService.getAll({ activo: 'true' }).then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: inscripcionesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['inscripciones'])
      toast.success('Inscripcion realizada')
      setModalOpen(false)
      reset()
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Error al inscribir'),
  })

  const cancelMutation = useMutation({
    mutationFn: inscripcionesService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries(['inscripciones'])
      toast.success('Inscripcion cancelada')
      setCancelDialog(null)
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inscripcionSchema),
  })

  const onSubmit = (data) => {
    createMutation.mutate(data)
  }

  const list = inscripciones?.data || []
  const sociosList = socios?.data || []
  const deportesList = deportes?.data || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inscripciones</h1>
          <p className="text-muted-foreground">{list.length} inscripciones activas</p>
        </div>
        <Button onClick={() => { reset(); setModalOpen(true) }}>
          <Plus className="h-4 w-4" />
          Nueva Inscripcion
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Socio</TableHead>
                <TableHead>Deporte</TableHead>
                <TableHead>Fecha Inscripcion</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No hay inscripciones
                  </TableCell>
                </TableRow>
              ) : (
                list.map((insc) => (
                  <TableRow key={insc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{insc.socio.nombre} {insc.socio.apellido}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>{insc.deporte.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(insc.fechaInscripcion)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Activo</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setCancelDialog(insc)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) reset() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Inscripcion</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="socioId">Socio</Label>
              <select id="socioId" {...register('socioId')} className={selectStyles} defaultValue="">
                <option value="" disabled>Seleccionar socio</option>
                {sociosList.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre} {s.apellido} - DNI: {s.dni}</option>
                ))}
              </select>
              {errors.socioId && <p className="text-sm text-destructive">{errors.socioId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deporteId">Deporte</Label>
              <select id="deporteId" {...register('deporteId')} className={selectStyles} defaultValue="">
                <option value="" disabled>Seleccionar deporte</option>
                {deportesList.map((d) => (
                  <option key={d.id} value={d.id}>{d.nombre} - {d.cuotaMensual}/mes</option>
                ))}
              </select>
              {errors.deporteId && <p className="text-sm text-destructive">{errors.deporteId.message}</p>}
            </div>
            <DialogFooter>
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
          <p className="text-muted-foreground">Estas seguro que deseas cancelar esta inscripcion?</p>
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
