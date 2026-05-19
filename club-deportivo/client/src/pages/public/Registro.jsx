import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { registroSchema } from '@/schemas'
import { publicService } from '@/services'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'

export default function Registro() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
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

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await publicService.register(data)
      setShowModal(true)
    } catch (err) {
      console.error('Error al registrarse:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    navigate('/portal')
  }

  const fields = [
    { name: 'nombre', label: 'Nombre', placeholder: 'Juan', type: 'text', col: 'half' },
    { name: 'apellido', label: 'Apellido', placeholder: 'Pérez', type: 'text', col: 'half' },
    { name: 'dni', label: 'DNI', placeholder: '12345678', type: 'text', col: 'full' },
    { name: 'email', label: 'Email', placeholder: 'juan@email.com', type: 'email', col: 'full' },
    { name: 'telefono', label: 'Teléfono', placeholder: '1123456789', type: 'text', col: 'full' },
    { name: 'password', label: 'Contraseña', placeholder: 'Mínimo 8 caracteres', type: 'password', col: 'full' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-blue-950 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-lg"
      >
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

        <Card className="shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-blue-700 px-8 py-10 text-white">
            <CardTitle className="text-2xl">Asociate ahora</CardTitle>
            <CardDescription className="text-blue-100 mt-2">
              Completá tus datos y empezá a entrenar
            </CardDescription>
          </div>

          <CardContent className="p-8 pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {fields.map(({ name, label, placeholder, type, col }, index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={col === 'half' ? 'grid grid-cols-2 gap-4' : ''}
                >
                  <div className={col === 'half' ? '' : ''}>
                    <Label htmlFor={name}>{label}</Label>
                    <Input
                      id={name}
                      type={type}
                      placeholder={placeholder}
                      {...register(name)}
                      className={`mt-1 ${errors[name] ? 'border-red-500' : ''}`}
                    />
                    {errors[name] && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors[name].message}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Asociarme'
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya sos socio?{' '}
                <a href="/portal" className="font-semibold text-primary hover:underline">
                  Ingresá acá
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="mx-auto mb-4"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            </motion.div>
            <DialogTitle className="text-2xl">¡Bienvenido al club!</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Tu registro fue exitoso. Ya podés acceder a tu portal para ver tus deportes, pagos y más.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button onClick={handleModalClose} className="px-8">
              Ir a mi portal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}