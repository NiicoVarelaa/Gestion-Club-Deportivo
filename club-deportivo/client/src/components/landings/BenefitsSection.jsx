import { motion } from 'framer-motion'
import { Heart, ShieldCheck, Medal } from 'lucide-react'

const benefits = [
  {
    icon: Heart,
    title: 'Salud y bienestar',
    description: 'Accedé a todas las disciplinas con una cuota fija mensual. Tu salud es nuestra prioridad.',
    color: 'blue',
  },
  {
    icon: ShieldCheck,
    title: 'Comunidad segura',
    description: 'Entrená en un ambiente seguro con profesionales certificados y equipamiento de primer nivel.',
    color: 'emerald',
  },
  {
    icon: Medal,
    title: 'Competencias y torneos',
    description: 'Participá de torneos internos y externos. Representá al club y llevá tu pasión al siguiente nivel.',
    color: 'amber',
  },
]

const colorMap = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-600 dark:text-blue-400' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', icon: 'text-amber-600 dark:text-amber-400' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
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

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
            ¿Por qué ser <span className="text-primary">socio?</span>
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
            Descubrí todo lo que te ofrecemos como miembro del club
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {benefits.map(({ icon: Icon, title, description, color }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="p-4 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/10 dark:to-transparent"
            >
              <div className="flex md:flex-col items-center gap-4 md:gap-4 text-left md:text-center">
                <motion.div
                  className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full ${colorMap[color].bg} flex items-center justify-center`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Icon className={`w-6 h-6 md:w-8 md:h-8 ${colorMap[color].icon}`} />
                </motion.div>
                <div>
                  <h3 className="text-base md:text-xl font-bold">{title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">{description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}