import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '@/components/auth/AuthLayout'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Contraseña protegida',
    desc: 'Tu nueva clave se cifra y nunca se comparte.',
  },
  {
    icon: KeyRound,
    title: 'Acceso inmediato',
    desc: 'Al guardarla podés iniciar sesión al instante.',
  },
  {
    icon: Clock,
    title: 'Enlace con vigencia',
    desc: 'Los enlaces de recuperación caducan por seguridad.',
  },
]

const fieldBase =
  'w-full h-12 rounded-xl border bg-transparent pl-11 pr-12 text-base text-foreground placeholder:text-muted-foreground outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      aria-pressed={visible}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  )
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const { updatePassword } = useAuthStore()
  const authLoading = useAuthStore((s) => s.loading)
  const [checking, setChecking] = useState(true)
  const [linkError, setLinkError] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (authLoading) return undefined

    const timer = setTimeout(() => {
      if (!useAuthStore.getState().user) {
        setLinkError('El enlace es inválido o expiró.')
      }
      setChecking(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [authLoading])

  useEffect(() => {
    if (!done) return undefined
    const timer = setTimeout(() => navigate('/login'), 6000)
    return () => clearTimeout(timer)
  }, [done, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const next = {}
    if (password.length < 8) next.password = 'La contraseña debe tener al menos 8 caracteres'
    if (!confirm) next.confirm = 'Repetí tu contraseña'
    else if (confirm !== password) next.confirm = 'Las contraseñas no coinciden'

    setErrors(next)

    const firstInvalid = ['password', 'confirm'].find((key) => next[key])
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }

    setIsSubmitting(true)
    try {
      await updatePassword(password)
      setDone(true)
    } catch (err) {
      setSubmitError(err.message || 'No pudimos actualizar la contraseña. Intentá de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const layoutProps = {
    asideTitle: 'Creá una contraseña nueva',
    asideDescription: 'Elegí una clave segura y volvé a entrar a tu cuenta sin perder tu progreso.',
    features,
  }

  if (checking) {
    return (
      <AuthLayout {...layoutProps}>
        <Card className="border-border/60 shadow-lg shadow-black/5">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="space-y-1">
              <h1 className="text-xl font-bold">Verificando enlace</h1>
              <p className="text-sm text-muted-foreground">
                Estamos validando tu solicitud de recuperación.
              </p>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  if (linkError) {
    return (
      <AuthLayout {...layoutProps}>
        <Card className="border-border/60 shadow-lg shadow-black/5">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col items-center gap-5 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-7 w-7" />
              </span>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">El enlace no es válido</h1>
                <p className="text-sm leading-6 text-muted-foreground">
                  Puede haber expirado o ya haberse usado. Solicitá uno nuevo para continuar con la
                  recuperación.
                </p>
              </div>
              <Link
                to="/forgot-password"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Solicitar un nuevo enlace
                <ChevronRight className="h-4 w-4" />
              </Link>
              <p className="text-sm text-muted-foreground">
                ¿Necesitás ayuda?{' '}
                <Link to="/contacto" className="font-semibold text-primary hover:underline">
                  Contactanos
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout {...layoutProps}>
      <Card className="border-border/60 shadow-lg shadow-black/5">
        <CardContent className="p-6 sm:p-8">
          {done ? (
            <div role="status" aria-live="polite" className="flex flex-col items-center gap-5 py-2 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">Contraseña actualizada</h1>
                <p className="text-sm leading-6 text-muted-foreground">
                  Ya podés ingresar con tu nueva contraseña. Te llevamos al inicio de sesión en unos
                  segundos.
                </p>
              </div>
              <Link
                to="/login"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Ir al inicio de sesión
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">Nueva contraseña</h1>
                <p className="text-sm text-muted-foreground">
                  Elegí una clave segura para recuperar el acceso a tu cuenta.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {submitError && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                      }}
                      placeholder="Mínimo 8 caracteres"
                      aria-required="true"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? 'password-error' : 'password-hint'}
                      className={cn(
                        fieldBase,
                        errors.password
                          ? 'border-destructive focus-visible:ring-destructive'
                          : 'border-input focus-visible:border-primary',
                      )}
                    />
                    <PasswordToggle
                      visible={showPassword}
                      onToggle={() => setShowPassword((value) => !value)}
                    />
                  </div>
                  {errors.password ? (
                    <p id="password-error" role="alert" className="text-xs font-medium text-destructive">
                      {errors.password}
                    </p>
                  ) : (
                    <p id="password-hint" className="text-xs text-muted-foreground">
                      Usá al menos 8 caracteres.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirm" className="block text-sm font-medium text-foreground">
                    Repetir contraseña
                  </label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => {
                        setConfirm(e.target.value)
                        if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: undefined }))
                      }}
                      placeholder="Repetí tu contraseña"
                      aria-required="true"
                      aria-invalid={Boolean(errors.confirm)}
                      aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                      className={cn(
                        fieldBase,
                        errors.confirm
                          ? 'border-destructive focus-visible:ring-destructive'
                          : 'border-input focus-visible:border-primary',
                      )}
                    />
                    <PasswordToggle
                      visible={showConfirm}
                      onToggle={() => setShowConfirm((value) => !value)}
                    />
                  </div>
                  {errors.confirm && (
                    <p id="confirm-error" role="alert" className="text-xs font-medium text-destructive">
                      {errors.confirm}
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
                      Guardando...
                    </>
                  ) : (
                    <>
                      Guardar contraseña
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                ¿Problemas con el enlace?{' '}
                <Link to="/contacto" className="font-semibold text-primary hover:underline">
                  Contactanos
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
