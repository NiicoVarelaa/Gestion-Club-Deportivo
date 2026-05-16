import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { User, Mail, Shield, Save, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'

const profileSchema = z.object({
  nombre: z.string().min(2, 'Minimo 2 caracteres'),
  apellido: z.string().min(2, 'Minimo 2 caracteres'),
  email: z.string().email('Email invalido'),
})

export default function Profile() {
  const { user, session } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({ password: '', confirm: '' })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      nombre: user?.user_metadata?.nombre || '',
      apellido: user?.user_metadata?.apellido || '',
      email: user?.email || '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email !== user?.email ? data.email : undefined,
        data: { nombre: data.nombre, apellido: data.apellido },
      })
      if (error) throw error
      toast.success('Perfil actualizado correctamente')
    } catch (err) {
      toast.error(err.message || 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.password !== passwordData.confirm) {
      toast.error('Las passwords no coinciden')
      return
    }
    if (passwordData.password.length < 6) {
      toast.error('La password debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.password })
      if (error) throw error
      toast.success('Password actualizada correctamente')
      setPasswordOpen(false)
      setPasswordData({ password: '', confirm: '' })
    } catch (err) {
      toast.error(err.message || 'Error al cambiar password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu informacion personal y seguridad</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informacion Personal
          </CardTitle>
          <CardDescription>Actualiza tus datos personales</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" {...register('nombre')} />
                {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input id="apellido" {...register('apellido')} />
                {errors.apellido && <p className="text-sm text-destructive">{errors.apellido.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input id="email" {...register('email')} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">El email se gestiona desde Supabase Auth</p>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad
          </CardTitle>
          <CardDescription>Cambia tu password</CardDescription>
        </CardHeader>
        <CardContent>
          {passwordOpen ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nueva password</Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                  placeholder="Minimo 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmar password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  placeholder="Repeti la password"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePasswordChange} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Actualizar password
                </Button>
                <Button variant="secondary" onClick={() => setPasswordOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setPasswordOpen(true)}>
              Cambiar password
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
