import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { registroSchema } from '@/schemas'
import { publicService } from '@/services'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { User, Mail, Phone, CreditCard, Lock, CheckCircle2, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react'

function PasswordStrength({ password }) {
  const strength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 1) return { level: 1, label: 'Débil', color: 'bg-red-500' }
    if (score === 2) return { level: 2, label: 'Regular', color: 'bg-orange-500' }
    if (score === 3) return { level: 3, label: 'Buena', color: 'bg-yellow-500' }
    return { level: 4, label: 'Segura', color: 'bg-emerald-500' }
  }, [password])

  if (!password) return null

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= strength.level ? strength.color : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Seguridad: <span className="font-medium" style={{ color: strength.level >= 3 ? '#10b981' : strength.level === 2 ? '#f59e0b' : '#ef4444' }}>{strength.label}</span>
      </p>
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

export default function Registro() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
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
      const { session } = res.data
      if (session) {
        localStorage.setItem('supabase_token', session.access_token)
        useAuthStore.setState({ session, user: session.user })
      }
      setShowModal(true)
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Error al registrarse. Intentá de nuevo.')
      setShakeKey((k) => k + 1)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    navigate('/portal')
  }

  const fields = [
    { name: 'nombre', label: 'Nombre', placeholder: 'Nicolás', type: 'text' },
    { name: 'apellido', label: 'Apellido', placeholder: 'Varela', type: 'text' },
    { name: 'dni', label: 'DNI', placeholder: '12345678', type: 'text' },
    { name: 'email', label: 'Email', placeholder: 'juan@email.com', type: 'email' },
    { name: 'telefono', label: 'Teléfono', placeholder: '1123456789', type: 'text' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-blue-950 py-12 px-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Card className="overflow-hidden shadow-2xl border-0">
            <div className="bg-gradient-to-r from-primary to-blue-700 px-8 py-10 text-white">
              <CardTitle className="text-2xl">Asociate ahora</CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                Completá tus datos y empezá a entrenar
              </CardDescription>
            </div>

            <CardContent className="p-8">
              <motion.form
                key={shakeKey}
                animate={submitError ? { x: [0, -8, 8, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center"
                  >
                    {submitError}
                  </motion.div>
                )}

                {fields.map(({ name, label, placeholder, type }, index) => {
                  const Icon = inputIcons[name]
                  return (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                        {label}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={type}
                          placeholder={placeholder}
                          {...register(name)}
                          className={`w-full h-11 pl-10 pr-4 rounded-xl border text-base bg-transparent outline-none transition-all
                            ${errors[name]
                              ? 'border-red-300 dark:border-red-700'
                              : 'border-gray-200 dark:border-gray-700 focus:border-gray-300 dark:focus:border-gray-600'
                            }
                            text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
                          `}
                        />
                      </div>
                      {errors[name] && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors[name].message}
                        </motion.p>
                      )}
                    </motion.div>
                  )
                })}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + fields.length * 0.05 }}
                >
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      {...register('password')}
                      className={`w-full h-11 pl-10 pr-10 rounded-xl border text-base bg-transparent outline-none transition-all
                        ${errors.password
                          ? 'border-red-300 dark:border-red-700'
                          : 'border-gray-200 dark:border-gray-700 focus:border-gray-300 dark:focus:border-gray-600'
                        }
                        text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                  <PasswordStrength password={password} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Asociando...
                      </>
                    ) : (
                      'Asociarme'
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  ¿Ya sos socio?{' '}
                  <Link to="/portal" className="font-semibold text-primary hover:underline transition-colors">
                    Ingresá acá
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="mx-auto mb-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
            </motion.div>
            <DialogTitle className="text-2xl">¡Bienvenido a GesClub!</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Tu registro fue exitoso. Ya podés acceder a tu portal para ver tus deportes, pagos y más.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={handleModalClose} className="px-8 rounded-xl">
              Ir a mi portal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
