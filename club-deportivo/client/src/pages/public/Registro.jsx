import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { registroSchema } from '@/schemas'
import { publicService } from '@/services'
import { getApiError } from '@/lib/api'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronRight,
  Check,
  Trophy,
  Wallet,
  Sparkles,
} from 'lucide-react'

const features = [
  { icon: Trophy, title: 'Más de 10 disciplinas', desc: 'Fútbol, básquet, natación, tenis y muchas más.' },
  { icon: Wallet, title: 'Cuotas online', desc: 'Consultá y gestioná tus pagos desde el portal.' },
  { icon: Sparkles, title: 'Inscripción en minutos', desc: 'Completá tus datos y empezá a entrenar hoy.' },
]

const fieldBase =
  'w-full h-12 rounded-xl border bg-transparent pl-11 pr-4 text-base text-foreground placeholder:text-muted-foreground outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

function PasswordStrength({ password }) {
  const { level, label, color, text } = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '', text: '' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 1) return { level: 1, label: 'Débil', color: 'bg-red-500', text: 'text-red-500' }
    if (score === 2) return { level: 2, label: 'Regular', color: 'bg-orange-500', text: 'text-orange-500' }
    if (score === 3) return { level: 3, label: 'Buena', color: 'bg-yellow-500', text: 'text-yellow-600' }
    return { level: 4, label: 'Segura', color: 'bg-emerald-500', text: 'text-emerald-600' }
  }, [password])

  const rules = [
    { label: '8 caracteres', ok: password.length >= 8 },
    { label: 'Una mayúscula', ok: /[A-Z]/.test(password) },
    { label: 'Un número', ok: /[0-9]/.test(password) },
  ]

  if (!password) return null

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i <= level ? color : 'bg-border',
            )}
          />
        ))}
        <span className={cn('ml-2 w-14 text-right text-xs font-medium', text)}>{label}</span>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {rules.map((rule) => (
          <li
            key={rule.label}
            className={cn(
              'flex items-center gap-1 text-xs',
              rule.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'flex h-3.5 w-3.5 items-center justify-center rounded-full border',
                rule.ok
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-muted-foreground/40',
              )}
            >
              {rule.ok && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
            </span>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

const inputIcons = {
  nombre: User,
  apellido: User,
  dni: CreditCard,
  email: Mail,
  telefono: Phone,
  password: Lock,
}

const fields = [
  { name: 'nombre', label: 'Nombre', placeholder: 'Nicolás', type: 'text', autoComplete: 'given-name' },
  { name: 'apellido', label: 'Apellido', placeholder: 'Varela', type: 'text', autoComplete: 'family-name' },
  { name: 'dni', label: 'DNI', placeholder: '12345678', type: 'text', inputMode: 'numeric', autoComplete: 'off' },
  { name: 'telefono', label: 'Teléfono', placeholder: '1123456789', type: 'tel', inputMode: 'tel', autoComplete: 'tel' },
  { name: 'email', label: 'Email', placeholder: 'juan@email.com', type: 'email', autoComplete: 'email', full: true },
]

export default function Registro() {
  const navigate = useNavigate()
  const applySession = useAuthStore((state) => state.applySession)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [shakeKey, setShakeKey] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      telefono: '',
      password: '',
    },
  })

  const password = watch('password', '')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await publicService.register(data)
      if (res.data.session) applySession(res.data.session)
      navigate('/portal')
    } catch (err) {
      setSubmitError(getApiError(err, 'Error al registrarse. Intentá de nuevo.'))
      setShakeKey((k) => k + 1)
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <h2 className="text-3xl font-extrabold leading-tight xl:text-4xl">
              Sumate al club
            </h2>
            <p className="text-base text-sidebar-foreground/80">
              Creá tu cuenta de socio y accedé a todo lo que el club tiene para vos.
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

      <main className="flex items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center justify-center gap-3 lg:hidden"
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
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
            </div>

            <Card className="border-border/60 shadow-lg shadow-black/5">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-6 space-y-1.5">
                  <h1 className="text-2xl font-bold tracking-tight">Asociate ahora</h1>
                  <p className="text-sm text-muted-foreground">
                    Completá tus datos y empezá a entrenar.
                  </p>
                </div>

                <motion.form
                  key={shakeKey}
                  animate={shakeKey ? { x: [0, -8, 8, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="space-y-4"
                >
                  {submitError && (
                    <div
                      role="alert"
                      className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {fields.map(({ name, label, placeholder, type, autoComplete, inputMode, full }, index) => {
                      const Icon = inputIcons[name]
                      const hasError = Boolean(errors[name])
                      return (
                        <motion.div
                          key={name}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className={cn(full && 'sm:col-span-2')}
                        >
                          <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-foreground">
                            {label}
                          </label>
                          <div className="relative">
                            <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              id={name}
                              type={type}
                              placeholder={placeholder}
                              autoComplete={autoComplete}
                              inputMode={inputMode}
                              aria-invalid={hasError}
                              aria-describedby={hasError ? `${name}-error` : undefined}
                              {...register(name)}
                              className={cn(
                                fieldBase,
                                hasError
                                  ? 'border-destructive focus-visible:ring-destructive'
                                  : 'border-input focus-visible:border-primary',
                              )}
                            />
                          </div>
                          {hasError && (
                            <p id={`${name}-error`} className="mt-1 text-xs font-medium text-destructive">
                              {errors[name].message}
                            </p>
                          )}
                        </motion.div>
                      )
                    })}

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * fields.length }}
                      className="sm:col-span-2"
                    >
                      <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                        Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mínimo 8 caracteres"
                          autoComplete="new-password"
                          aria-invalid={Boolean(errors.password)}
                          aria-describedby={errors.password ? 'password-error' : undefined}
                          {...register('password')}
                          className={cn(
                            fieldBase,
                            'pr-11',
                            errors.password
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
                      {errors.password && (
                        <p id="password-error" className="mt-1 text-xs font-medium text-destructive">
                          {errors.password.message}
                        </p>
                      )}
                      <PasswordStrength password={password} />
                    </motion.div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Asociando...
                      </>
                    ) : (
                      <>
                        Asociarme
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  ¿Ya sos socio?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Iniciá sesión
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
