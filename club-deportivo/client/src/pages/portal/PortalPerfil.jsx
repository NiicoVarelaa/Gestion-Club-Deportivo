import { useEffect } from 'react'
import { useSocioStore } from '@/stores/socioStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { User, Mail, Phone, Hash, Calendar } from 'lucide-react'

export default function PortalPerfil() {
  const { socio, loading, fetchPortalData } = useSocioStore()

  useEffect(() => {
    fetchPortalData()
  }, [fetchPortalData])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    )
  }

  const infoItems = [
    { icon: User, label: 'Nombre', value: `${socio?.nombre} ${socio?.apellido}` },
    { icon: Hash, label: 'DNI', value: socio?.dni },
    { icon: Mail, label: 'Email', value: socio?.email },
    { icon: Phone, label: 'Teléfono', value: socio?.telefono || 'No registrado' },
    { icon: Calendar, label: 'Fecha de alta', value: socio?.fechaAlta ? formatDate(socio.fechaAlta) : '—' },
  ]

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Mi Perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {infoItems.map(({ icon: Icon, label, value }, index) => (
            <div key={label}>
              {index > 0 && <Separator className="mb-4" />}
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
        </CardContent>
      </Card>
    </div>
  )
}