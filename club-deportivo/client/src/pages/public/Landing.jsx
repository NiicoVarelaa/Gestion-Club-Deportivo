import HeroSection from '@/components/landings/HeroSection'
import SportsGrid from '@/components/landings/SportsGrid'
import BenefitsSection from '@/components/landings/BenefitsSection'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">CD</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">Club Deportivo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/portal"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Mi Cuenta
            </Link>
            <Link
              to="/registro"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Asociarme
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <HeroSection />
        <SportsGrid />
        <BenefitsSection />
      </div>

      <footer className="py-12 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Club Deportivo. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}