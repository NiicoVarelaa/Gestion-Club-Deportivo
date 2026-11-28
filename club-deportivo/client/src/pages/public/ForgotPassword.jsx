import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthLayout from '@/components/auth/AuthLayout'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  ChevronRight,
  Clock,
  Loader2,
  Mail,
  MailCheck,
  Send,
  ShieldCheck,
} from 'lucide-react'

const features = [
  {
    icon: MailCheck,
    title: 'Enlace directo',
    desc: 'Enviamos las instrucciones al email con el que te registraste.',
  },
  {
    icon: ShieldCheck,
    title: 'Proceso seguro',
    desc: 'Solo vos podés abrir el enlace de recuperación.',
  },
  {
    icon: Clock,
    title: 'Vigencia limitada',
    desc: 'Por seguridad, el enlace caduca después de un tiempo.',
  },
]

const fieldBase =
  'w-full h-12 rounded-xl border bg-transparent pl-11 pr-4 text-base text-foreground placeholder:text-muted-foreground outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const resetPassword = useAuthStore((s) => s.resetPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldError('')

    const trimmed = email.trim()
    if (!trimmed) {
      setFieldError('Ingresá tu email')
      setShakeKey((k) => k + 1)
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFieldError('Email inválido')
      setShakeKey((k) => k + 1)
      return
    }

    setIsSubmitting(true)
    try {
      await resetPassword(trimmed)
      setEmail(trimmed)
      setSent(true)
    } catch (err) {
      setError(err.message || 'No pudimos enviar el email. Intentá de nuevo.')
      setShakeKey((k) => k + 1)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      asideTitle="Recuperá el acceso a tu cuenta"
      asideDescription="Te enviamos un enlace seguro para que puedas volver a entrar en minutos."
      features={features}
    >
      <Card className="border-border/60 shadow-lg shadow-black/5">
        <CardContent className="p-6 sm:p-8">
          {sent ? (
            <div role="status" aria-live="polite" className="flex flex-col items-center gap-5 py-2 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                <MailCheck className="h-7 w-7" />
              </span>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">Revisá tu correo</h1>
                <p className="text-sm leading-6 text-muted-foreground">
                  Si existe una cuenta con <span className="font-medium text-foreground">{email}</span>,
                  te enviamos un enlace para restablecer tu contraseña.
                </p>
                <p className="text-xs text-muted-foreground">
                  ¿No lo ves? Revisá la carpeta de spam o correo no deseado.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2">
                <Link
                  to="/login"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Volver al inicio de sesión
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false)
                    setEmail('')
                  }}
                  className="h-11 w-full rounded-xl border text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Usar otro email
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">Recuperar contraseña</h1>
                <p className="text-sm text-muted-foreground">
                  Ingresá tu email y te enviaremos las instrucciones para restablecerla.
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
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (fieldError) setFieldError('')
                        if (error) setError('')
                      }}
                      placeholder="tu@email.com"
                      aria-required="true"
                      aria-invalid={Boolean(fieldError)}
                      aria-describedby={fieldError ? 'email-error' : undefined}
                      className={cn(
                        fieldBase,
                        fieldError
                          ? 'border-destructive focus-visible:ring-destructive'
                          : 'border-input focus-visible:border-primary',
                      )}
                    />
                  </div>
                  {fieldError && (
                    <p id="email-error" role="alert" className="text-xs font-medium text-destructive">
                      {fieldError}
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
                      Enviando enlace...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar instrucciones
                    </>
                  )}
                </button>
              </motion.form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                ¿Ya la recordaste?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Iniciá sesión
                </Link>
              </p>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                ¿No tenés cuenta?{' '}
                <Link to="/registro" className="font-semibold text-primary hover:underline">
                  Registrate
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
