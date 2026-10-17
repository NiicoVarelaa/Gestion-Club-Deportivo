import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Users,
  Trophy,
  CreditCard,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  { icon: Users, title: 'Socios y cuotas', desc: 'Altas, ediciones y seguimiento de cada socio.' },
  { icon: Trophy, title: 'Deportes e inscripciones', desc: 'Disciplinas, cupos y categorías en un solo lugar.' },
  { icon: CreditCard, title: 'Pagos al día', desc: 'Cuotas, vencimientos y deudas bajo control.' },
]

const fieldBase =
  'w-full h-12 rounded-xl border bg-transparent pl-11 pr-4 text-base text-foreground placeholder:text-muted-foreground outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

function validate({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'Ingresá tu email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email inválido'
  if (!password) errors.password = 'Ingresá tu contraseña'
  return errors
}

export default function Login() {
  const navigate = useNavigate()
  const { user, loading, login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  useEffect(() => {
    if (!loading && user) {
      const isAdmin = user.user_metadata?.role === 'admin'
      navigate(isAdmin ? '/admin/dashboard' : '/portal')
    }
  }, [user, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const errors = validate({ email, password })
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setShakeKey((k) => k + 1)
      return
    }
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
      setShakeKey((k) => k + 1)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sidebar to-sidebar-accent">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
            <img src="/logo.png" alt="GesClub" className="h-10 w-auto" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-sidebar-foreground/70" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
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
            <h2 className="text-3xl font-extrabold leading-tight xl:text-4xl">
              Gestioná tu club sin planillas
            </h2>
            <p className="text-base text-sidebar-foreground/80">
              Todo lo que necesitás para administrar socios, deportes y pagos, en un solo panel.
            </p>
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
            <Card className="border-border/60 shadow-lg shadow-black/5">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-6 space-y-1.5">
                  <h1 className="text-2xl font-bold tracking-tight">Iniciá sesión</h1>
                  <p className="text-sm text-muted-foreground">
                    Ingresá con tu cuenta para acceder al panel.
                  </p>
                </div>

                <motion.form
                  key={shakeKey}
                  animate={shakeKey ? { x: [0, -8, 8, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-5"
                >
                  {error && (
                    <div
                      role="alert"
                      className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }))
                        }}
                        placeholder="tu@email.com"
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                        className={cn(
                          fieldBase,
                          fieldErrors.email
                            ? 'border-destructive focus-visible:ring-destructive'
                            : 'border-input focus-visible:border-primary',
                        )}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p id="email-error" className="text-xs font-medium text-destructive">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-foreground"
                      >
                        Contraseña
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (fieldErrors.password)
                            setFieldErrors((f) => ({ ...f, password: undefined }))
                        }}
                        placeholder="Tu contraseña"
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                        className={cn(
                          fieldBase,
                          'pr-11',
                          fieldErrors.password
                            ? 'border-destructive focus-visible:ring-destructive'
                            : 'border-input focus-visible:border-primary',
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        aria-pressed={showPassword}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p id="password-error" className="text-xs font-medium text-destructive">
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Ingresando...
                      </>
                    ) : (
                      <>
                        Ingresar
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  ¿No tenés cuenta?{' '}
                  <Link to="/registro" className="font-semibold text-primary hover:underline">
                    Registrate
                  </Link>
                </p>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
