import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({
  asideTitle,
  asideDescription,
  features = [],
  backTo = '/login',
  backLabel = 'Volver al login',
  children,
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-sidebar to-sidebar-accent p-10 text-sidebar-foreground lg:flex xl:p-14">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/club.webp')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-sidebar/85 via-sidebar-accent/70 to-sidebar/95"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
            <img src="/logo.png" alt="GesClub" className="h-8 w-auto" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">GesClub</p>
            <p className="text-xs opacity-70">Sistema de gestión deportiva</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10 max-w-md space-y-8"
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold leading-tight xl:text-4xl">{asideTitle}</h2>
            <p className="text-base text-sidebar-foreground/80">{asideDescription}</p>
          </div>

          <ul className="space-y-5">
            {features.map((feature) => (
              <li key={feature.title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <feature.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{feature.title}</span>
                  <span className="block text-sm text-sidebar-foreground/70">{feature.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 text-xs text-sidebar-foreground/60"
        >
          &copy; {new Date().getFullYear()} GesClub. Todos los derechos reservados.
        </motion.p>
      </aside>

      <main className="flex items-center justify-center bg-background px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center justify-center gap-3 lg:hidden"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sidebar to-sidebar-accent shadow-sm">
              <img src="/logo.png" alt="GesClub" className="h-8 w-auto" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">GesClub</p>
              <p className="text-xs text-muted-foreground">Sistema de gestión</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="mb-4">
              <Link
                to={backTo}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            </div>

            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
