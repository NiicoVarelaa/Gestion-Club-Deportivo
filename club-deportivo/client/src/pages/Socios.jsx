import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { sociosService } from '../services'
import { socioSchema } from '../schemas'
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
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
import { useDebounce } from '../hooks/useDebounce'

export default function Socios() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(null)
  const [search, setSearch] = useState('')
  const [editingSocio, setEditingSocio] = useState(null)
  const [page, setPage] = useState(1)
  const limit = 10

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ['socios', debouncedSearch, page],
    queryFn: () => sociosService.getAll({ search: debouncedSearch, page, limit }).then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: sociosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['socios'])
      toast.success('Socio creado correctamente')
      setModalOpen(false)
      resetForm()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error al crear socio'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => sociosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['socios'])
      toast.success('Socio actualizado correctamente')
      setModalOpen(false)
      resetForm()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error al actualizar'),
  })

  const deleteMutation = useMutation({
    mutationFn: sociosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['socios'])
      toast.success('Socio dado de baja correctamente')
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
    resolver: zodResolver(socioSchema),
  })

  const resetForm = () => {
    reset()
    setEditingSocio(null)
  }

  const onSubmit = (data) => {
    if (editingSocio) {
      updateMutation.mutate({ id: editingSocio.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (socio) => {
    setEditingSocio(socio)
    reset({
      dni: socio.dni,
      nombre: socio.nombre,
      apellido: socio.apellido,
      email: socio.email,
      telefono: socio.telefono || '',
      fechaNacimiento: socio.fechaNacimiento
        ? new Date(socio.fechaNacimiento).toISOString().split('T')[0]
        : '',
    })
    setModalOpen(true)
  }

  const socios = data?.data || []
  const pagination = data?.pagination
  const total = pagination?.total ?? socios.length

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Socios</h1>
          <p className="text-muted-foreground">{total} socios registrados</p>
        </div>
        <Button onClick={() => { resetForm(); setModalOpen(true) }} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nuevo Socio
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nombre, apellido, DNI o email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <TableSkeleton rows={6} cols={6} />
          ) : socios.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No se encontraron socios"
              description={debouncedSearch ? 'No hay resultados para tu busqueda.' : 'Todavia no hay socios registrados.'}
              action={!debouncedSearch ? { label: 'Crear Socio', onClick: () => { resetForm(); setModalOpen(true) } } : undefined}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>DNI</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden sm:table-cell">Telefono</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {socios.map((socio) => (
                      <TableRow key={socio.id}>
                        <TableCell className="font-medium">
                          {socio.nombre} {socio.apellido}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{socio.dni}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{socio.email}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{socio.telefono || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={socio.activo ? 'default' : 'destructive'}>
                            {socio.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-0.5">
                            <Button size="icon" variant="ghost" asChild className="h-8 w-8">
                              <Link to={`/socios/${socio.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(socio)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDeleteDialog(socio)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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

      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) resetForm() }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSocio ? 'Editar Socio' : 'Nuevo Socio'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI</Label>
                <Input id="dni" {...register('dni')} />
                {errors.dni && <p className="text-sm text-destructive">{errors.dni.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" {...register('nombre')} />
                {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" {...register('apellido')} />
              {errors.apellido && <p className="text-sm text-destructive">{errors.apellido.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telefono">Telefono</Label>
                <Input id="telefono" {...register('telefono')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <Input id="fechaNacimiento" type="date" {...register('fechaNacimiento')} />
              </div>
            </div>
            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
              <Button type="button" variant="secondary" onClick={() => { setModalOpen(false); resetForm() }}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingSocio ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dar de baja socio</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Estas seguro que deseas dar de baja a <strong>{deleteDialog?.nombre} {deleteDialog?.apellido}</strong>? Esta accion no se puede deshacer.
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
