import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { deportesService } from '@/services'
import { formatCurrency } from '@/lib/utils'
import { Trophy, Dumbbell, Waves, Bike, Users, HeartPulse, Footprints, Target } from 'lucide-react'

const iconMap = {
  futbol: Trophy,
  basquet: Dumbbell,
  natacion: Waves,
  ciclismo: Bike,
  tenis: Target,
  voley: Users,
  padel: Footprints,
  gym: HeartPulse,
}

function getIcon(nombre) {
  const key = nombre.toLowerCase()
  for (const [k, Icon] of Object.entries(iconMap)) {
    if (key.includes(k)) return Icon
  }
  return Trophy
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export default function SportsGrid() {
  const { data: deportes, isLoading } = useQuery({
    queryKey: ['deportes', 'public'],
    queryFn: () => deportesService.getAll({ activo: true }),
  })

  if (isLoading) {
    return (
      <section id="deportes" className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Nuestras <span className="text-primary">Disciplinas</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="deportes" className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16"
        >
          Nuestras <span className="text-primary">Disciplinas</span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {deportes?.map((deporte) => {
            const Icon = getIcon(deporte.nombre)
            return (
              <motion.div
                key={deporte.id}
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.15)' }}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:border-primary/20"
              >
                <div className="p-8 pb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{deporte.nombre}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {deporte.descripcion || 'Consultá horarios y disponibilidad en el club.'}
                  </p>
                </div>
                <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${formatCurrency(parseFloat(deporte.cuotaMensual))}
                  </span>
                  <span className="text-xs text-muted-foreground">/mes</span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}