import { useEffect } from 'react'
import { useSocioStore } from '@/stores/socioStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Dumbbell, Calendar } from 'lucide-react'

export default function PortalDeportes() {
  const { deportes, loading, fetchPortalData } = useSocioStore()

  useEffect(() => {
    fetchPortalData()
  }, [fetchPortalData])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!deportes?.length) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mis Deportes</h1>
        <Card className="p-12 text-center">
          <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No estás inscripto en ningún deporte</h3>
          <p className="text-muted-foreground">
            Contactá a la administración del club para inscribirte en una disciplina.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Mis Deportes</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deportes.map((d) => (
          <Card key={d.id} className="overflow-hidden hover:shadow-lg transition-all">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary">{formatCurrency(parseFloat(d.cuotaMensual))}/mes</Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold">{d.nombre}</h3>
                {d.descripcion && (
                  <p className="text-sm text-muted-foreground mt-1">{d.descripcion}</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Inscripto desde {d.fechaInscripcion ? formatDate(d.fechaInscripcion) : '—'}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}