import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { deportesService } from '../services'
import { deporteSchema } from '../schemas'
import { Plus, Edit, Trash2, Users, Trophy } from 'lucide-react'
import { formatCurrency } from '../lib/utils'
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
import { CardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'

export default function Deportes() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(null)
  const [editingDeporte, setEditingDeporte] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['deportes'],
    queryFn: () => deportesService.getAll().then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: deportesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['deportes'])
      toast.success('Deporte creado correctamente')
      setModalOpen(false)
      resetForm()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error al crear'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => deportesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['deportes'])
      toast.success('Deporte actualizado correctamente')
      setModalOpen(false)
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deportesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['deportes'])
      toast.success('Deporte dado de baja correctamente')
      setDeleteDialog(null)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error al dar de baja'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(deporteSchema),
  })

  const resetForm = () => {
    reset()
    setEditingDeporte(null)
  }

  const onSubmit = (data) => {
    if (editingDeporte) {
      updateMutation.mutate({ id: editingDeporte.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (deporte) => {
    setEditingDeporte(deporte)
    reset({
      nombre: deporte.nombre,
      descripcion: deporte.descripcion || '',
      cuotaMensual: deporte.cuotaMensual.toString(),
    })
    setModalOpen(true)
  }

  const deportes = data?.data || []

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deportes</h1>
          <p className="text-muted-foreground">{deportes.length} deportes disponibles</p>
        </div>
        <Button onClick={() => { resetForm(); setModalOpen(true) }} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nuevo Deporte
        </Button>
      </div>

      {isLoading ? (
        <CardSkeleton count={6} />
      ) : deportes.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No hay deportes"
          description="Todavia no se cargaron deportes en el sistema."
          action={{ label: 'Crear Deporte', onClick: () => { resetForm(); setModalOpen(true) } }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deportes.map((deporte) => (
            <Card key={deporte.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold">{deporte.nombre}</h3>
                    {deporte.descripcion && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{deporte.descripcion}</p>
                    )}
                  </div>
                  <Badge variant={deporte.activo ? 'default' : 'destructive'} className="shrink-0">
                    {deporte.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">{formatCurrency(deporte.cuotaMensual)}</p>
                    <p className="text-sm text-muted-foreground">cuota mensual</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {deporte._count?.inscripciones || 0}
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-1 border-t pt-4">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(deporte)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDeleteDialog(deporte)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) resetForm() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDeporte ? 'Editar Deporte' : 'Nuevo Deporte'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" {...register('nombre')} placeholder="Ej: Futbol, Natacion" />
              {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripcion</Label>
              <Input id="descripcion" {...register('descripcion')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuotaMensual">Cuota Mensual ($)</Label>
              <Input id="cuotaMensual" type="number" step="0.01" {...register('cuotaMensual')} />
              {errors.cuotaMensual && <p className="text-sm text-destructive">{errors.cuotaMensual.message}</p>}
            </div>
            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
              <Button type="button" variant="secondary" onClick={() => { setModalOpen(false); resetForm() }}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingDeporte ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dar de baja deporte</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Estas seguro que deseas dar de baja a <strong>{deleteDialog?.nombre}</strong>?
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteDialog(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate(deleteDialog.id)}>
              Dar de baja
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
