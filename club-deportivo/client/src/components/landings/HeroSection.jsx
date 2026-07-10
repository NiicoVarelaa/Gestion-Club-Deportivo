import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 60 M 0 0 L 60 60" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero_grid)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 text-center md:text-left md:grid md:grid-cols-2 md:items-center gap-12">
        <div className="space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight"
          >
            Tu club,{' '}
            <br />
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-400"
            >
              tu comunidad
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg md:text-xl text-blue-100/80 max-w-lg mx-auto md:mx-0"
          >
            Entrená, competí y crecé con GesClub. Más de 10 disciplinas y una comunidad que te espera.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex gap-4 justify-center md:justify-start"
          >
            <Link
              to="/registro"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:shadow-emerald-500/40"
            >
              Asociarme Ahora
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
            <a
              href="#deportes"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 hover:border-white/40 text-white font-semibold text-lg transition-all hover:bg-white/10"
            >
              Ver Deportes
            </a>
          </motion.div>

          {/* Mobile stats bar — solo mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex md:hidden gap-6 justify-center mt-10"
          >
            {[
              { value: '10+', label: 'Disciplinas' },
              { value: '+120', label: 'Socios' },
              { value: '3', label: 'Turnos' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs text-blue-200/80 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop stat card — solo desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="hidden md:flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-80 h-80 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl shadow-blue-950/50"
          >
            <div className="text-center text-white space-y-2">
              <p className="text-6xl font-extrabold">10+</p>
              <p className="text-lg text-blue-200">Disciplinas</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  )
}