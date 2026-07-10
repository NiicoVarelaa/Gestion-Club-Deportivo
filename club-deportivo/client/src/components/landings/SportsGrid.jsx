import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { deportesService } from '@/services'
import { formatCurrency } from '@/lib/utils'
import { Trophy, Waves, Dumbbell, ArrowRight, Users, Clock, Star } from 'lucide-react'

const featuredSports = [
  {
    key: 'futbol',
    icon: Trophy,
    gradient: 'from-emerald-500 to-green-600',
    gradientLight: 'from-emerald-500/10 to-green-600/10',
    accent: 'text-emerald-500',
    accentBg: 'bg-emerald-500/10',
    badge: 'Más popular',
    features: ['Cancha sintética', 'Torneos internos', '3 turnos semanales'],
    players: '+120 socios',
    schedule: 'Lun, Mié, Vie',
  },
  {
    key: 'natacion',
    icon: Waves,
    gradient: 'from-blue-500 to-cyan-500',
    gradientLight: 'from-blue-500/10 to-cyan-500/10',
    accent: 'text-blue-500',
    accentBg: 'bg-blue-500/10',
    badge: 'Nuevo',
    features: ['Pileta climatizada', 'Clases grupales', 'Nivel libre'],
    players: '+80 socios',
    schedule: 'Mar, Jue, Sáb',
  },
  {
    key: 'basquet',
    icon: Dumbbell,
    gradient: 'from-orange-500 to-amber-500',
    gradientLight: 'from-orange-500/10 to-amber-500/10',
    accent: 'text-orange-500',
    accentBg: 'bg-orange-500/10',
    badge: 'Competitivo',
    features: ['Gimnasio techado', 'Liga interclubes', 'Todas las edades'],
    players: '+60 socios',
    schedule: 'Mar, Jue, Vie',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
}

function FeaturedCard({ sport, deporte, index }) {
  const Icon = sport.icon
  const cuota = deporte?.cuotaMensual ? parseFloat(deporte.cuotaMensual) : 0

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -12 }}
      className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30"
    >
      {/* Header con gradiente */}
      <div className={`relative bg-gradient-to-br ${sport.gradient} p-8 pb-16 rounded-t-[2rem]`}>
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10 rounded-t-[2rem] overflow-hidden">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`pattern-${index}`} width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#pattern-${index})`} />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
              {sport.badge}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-1">{deporte?.nombre || sport.key}</h3>
          <p className="text-white/80 text-sm line-clamp-2">
            {deporte?.descripcion || 'Entrená, competí y disfrutá con nosotros.'}
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-8 pt-6 pb-8 space-y-6">
        {/* Precio */}
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-extrabold tracking-tight ${sport.accent}`}>
            {formatCurrency(cuota)}
          </span>
          <span className="text-muted-foreground text-xs">/mes</span>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {sport.features.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full ${sport.accentBg} flex items-center justify-center shrink-0`}>
                <Star className={`w-3 h-3 ${sport.accent}`} />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
            </div>
          ))}
        </div>

        {/* Info extra */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{sport.players}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{sport.schedule}</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href="/registro"
          className={`group/btn inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r ${sport.gradient} text-white font-semibold text-sm transition-all hover:shadow-lg hover:opacity-90`}
        >
          Quiero inscribirme
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </a>
      </div>
    </motion.div>
  )
}

export default function SportsGrid() {
  const { data: deportes, isLoading } = useQuery({
    queryKey: ['deportes', 'public'],
    queryFn: () => deportesService.getAll({ activo: true }).then((res) => res.data.data || []),
  })

  const getDeporte = (key) => {
    if (!deportes || deportes.length === 0) return null
    return deportes.find((d) => d.nombre.toLowerCase().includes(key))
  }

  if (isLoading) {
    return (
      <section id="deportes" className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Nuestras <span className="text-primary">Disciplinas</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="deportes" className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Disciplinas destacadas
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Elegí tu <span className="text-primary">deporte</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Nuestras disciplinas más elegidas por los socios. Todas incluyen acceso a instalaciones y equipamiento.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {featuredSports.map((sport, index) => (
            <FeaturedCard
              key={sport.key}
              sport={sport}
              deporte={getDeporte(sport.key)}
              index={index}
            />
          ))}
        </motion.div>

        {/* CTA inferior */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            ¿Querés ver todas las disciplinas disponibles?
          </p>
          <a
            href="/registro"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-foreground font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            Ver todas las actividades
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}