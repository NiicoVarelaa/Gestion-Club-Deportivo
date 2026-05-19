import { useState, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import HeroSection from '@/components/landings/HeroSection'
import SportsGrid from '@/components/landings/SportsGrid'
import BenefitsSection from '@/components/landings/BenefitsSection'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrolled(latest > 50)
    })
    return () => unsubscribe()
  }, [scrollY])

  return (
    <div className="min-h-screen">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-950/95 border-gray-200/50 dark:border-gray-800/50 shadow-sm'
            : 'bg-white/80 dark:bg-gray-950/80 border-gray-200/50 dark:border-gray-800/50'
        }`}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">CD</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">Club Deportivo</span>
          </motion.div>
          <div className="flex items-center gap-4">
            <Link
              to="/portal"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Mi Cuenta
            </Link>
            <Link
              to="/registro"
              className="group inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Asociarme
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.nav>

      <div className="pt-16">
        <HeroSection />
        <SportsGrid />
        <BenefitsSection />
      </div>

      <footer className="py-12 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-6 text-center"
        >
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Club Deportivo. Todos los derechos reservados.
          </p>
        </motion.div>
      </footer>
    </div>
  )
}