import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSocioStore } from '@/stores/socioStore'
import { portalService } from '@/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { User, Mail, Phone, Calendar, Pencil, Loader2, Badge as BadgeIcon } from 'lucide-react'

export default function PortalPerfil() {
  const { socio, loading, fetchPortalData, updateSocio } = useSocioStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '' })

  useEffect(() => {
    fetchPortalData()
  }, [fetchPortalData])

  useEffect(() => {
    if (socio) {
      setForm({
        nombre: socio.nombre || '',
        apellido: socio.apellido || '',
        telefono: socio.telefono || '',
      })
    }
  }, [socio])

  const mutation = useMutation({
    mutationFn: (data) => portalService.updateProfile(data),
    onSuccess: (res) => {
      updateSocio(res.data.data)
      setEditing(false)
      toast.success('Perfil actualizado correctamente')
    },
    onError: () => {
      toast.error('Error al actualizar el perfil')
    },
  })

  const handleSave = () => {
    mutation.mutate({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      telefono: form.telefono.trim(),
    })
  }

  const handleCancel = () => {
    if (socio) {
      setForm({
        nombre: socio.nombre || '',
        apellido: socio.apellido || '',
        telefono: socio.telefono || '',
      })
    }
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    )
  }

  const infoItems = [
    { icon: BadgeIcon, label: 'DNI', value: socio?.dni },
    { icon: Mail, label: 'Email', value: socio?.email },
    { icon: Calendar, label: 'Fecha de alta', value: socio?.fechaAlta ? formatDate(socio.fechaAlta) : '—' },
  ]

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="w-4 h-4 mr-1" />
            Editar
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-transparent outline-none focus:border-primary transition-colors"
                />
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Apellido
                </label>
                <input
                  type="text"
                  value={form.apellido}
                  onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-transparent outline-none focus:border-primary transition-colors"
                />
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={form.telefono}
                  onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                  placeholder="Ej: 3815550101"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-transparent outline-none focus:border-primary transition-colors"
                />
              </div>

              {infoItems.map(({ icon: Icon, label, value }, index) => (
                <div key={label}>
                  <Separator />
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="font-medium text-sm">{value}</p>
                    </div>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {socio?.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="font-medium text-sm">{socio?.activo ? 'Socio activo' : 'Socio inactivo'}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={mutation.isPending}>
                  {mutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                  Guardar cambios
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={mutation.isPending}>
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{socio?.nombre} {socio?.apellido}</p>
                </div>
              </div>

              {infoItems.map(({ icon: Icon, label, value }, index) => (
                <div key={label}>
                  <Separator className="mb-4" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  </div>
                </div>
              ))}

              <Separator className="mb-4" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {socio?.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="font-medium">{socio?.activo ? 'Socio activo' : 'Socio inactivo'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-1">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{socio?.telefono || 'No registrado'}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
