import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react'

const channels = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contacto@gesclub.com.ar',
    href: 'mailto:contacto@gesclub.com.ar',
    note: 'Respondemos dentro de las 24 hs hábiles.',
  },
  {
    icon: Phone,
    label: 'Teléfono',
    value: '+54 381 555-0123',
    href: 'tel:+543815550123',
    note: 'Atención de lunes a viernes.',
  },
  {
    icon: MapPin,
    label: 'Dirección',
    value: 'Av. 9 de Julio 789, San Miguel de Tucumán',
    note: 'Tucumán, Argentina.',
  },
  {
    icon: Clock,
    label: 'Horarios',
    value: 'Lun a Vie de 8:00 a 20:00',
    note: 'Sábados de 9:00 a 13:00.',
  },
]

const asuntos = ['Consulta general', 'Inscripciones', 'Pagos', 'Soporte técnico', 'Otro']

const faqs = [
  {
    q: '¿Cómo me asocio al club?',
    a: (
      <>
        Completá el formulario de{' '}
        <Link to="/registro" className="font-medium text-primary hover:underline">
          registro
        </Link>{' '}
        con tus datos y quedás habilitado para inscribirte a las disciplinas.
      </>
    ),
  },
  {
    q: '¿Dónde consulto mis cuotas y pagos?',
    a: (
      <>
        Ingresá a tu{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          cuenta
        </Link>{' '}
        y entrá a la sección Pagos del portal del socio.
      </>
    ),
  },
  {
    q: '¿Olvidé mi contraseña, qué hago?',
    a: (
      <>
        Podés restablecerla desde{' '}
        <Link to="/forgot-password" className="font-medium text-primary hover:underline">
          recuperar contraseña
        </Link>
        . Te enviaremos un enlace por email.
      </>
    ),
  },
]

const fieldBase =
  'w-full rounded-xl border bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: asuntos[0], mensaje: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
    if (sent) setSent(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.nombre.trim()) next.nombre = 'Ingresá tu nombre'
    if (!form.email.trim()) next.email = 'Ingresá tu email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Email inválido'
    if (!form.mensaje.trim()) next.mensaje = 'Contanos tu consulta'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    const subject = encodeURIComponent(`[GesClub] ${form.asunto}`)
    const body = encodeURIComponent(
      `Nombre: ${form.nombre}\nEmail: ${form.email}\nAsunto: ${form.asunto}\n\n${form.mensaje}`,
    )
    window.location.href = `mailto:contacto@gesclub.com.ar?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="GesClub" className="h-8 w-auto" />
            <span className="hidden text-lg font-bold sm:block">GesClub</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-sidebar to-sidebar-accent text-sidebar-foreground">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/club.webp')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-sidebar/90 via-sidebar-accent/80 to-sidebar/95"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 container mx-auto px-6 py-14 sm:py-16"
        >
          <nav aria-label="Ruta de navegación" className="mb-4 text-xs text-sidebar-foreground/70">
            <Link to="/" className="hover:text-sidebar-foreground">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-sidebar-foreground">Contacto</span>
          </nav>

          <div className="flex items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
              <MessageSquare className="h-6 w-6" />
            </span>
            <div className="max-w-2xl space-y-2">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Contactanos
              </h1>
              <p className="text-base text-sidebar-foreground/80">
                ¿Tenés una consulta? Escribinos y te respondemos a la brevedad.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <main className="flex-1">
        <div className="container mx-auto grid gap-10 px-6 py-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Canales de contacto</h2>
              <p className="text-[15px] leading-7 text-muted-foreground">
                Elegí el medio que prefieras. Estamos para ayudarte con tu cuenta, inscripciones y
                pagos.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {channels.map((channel) => {
                const content = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <channel.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {channel.label}
                      </span>
                      <span className="block break-words text-sm font-semibold text-foreground">
                        {channel.value}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{channel.note}</span>
                    </span>
                  </>
                )
                const className =
                  'flex items-start gap-3 rounded-2xl border bg-card p-4 transition-colors'
                return channel.href ? (
                  <a
                    key={channel.label}
                    href={channel.href}
                    className={cn(className, 'hover:border-primary/40 hover:bg-primary/5')}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={channel.label} className={className}>
                    {content}
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl border bg-muted/40 p-5">
              <h3 className="text-sm font-semibold text-foreground">Seguinos</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Enterate de novedades, torneos y horarios en nuestras redes.
              </p>
              <Link
                to="/"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Ver el sitio principal
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-border/60 shadow-lg shadow-black/5">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-6 space-y-1.5">
                  <h2 className="text-2xl font-bold tracking-tight">Envianos un mensaje</h2>
                  <p className="text-sm text-muted-foreground">
                    Se abrirá tu cliente de correo con el mensaje listo para enviar.
                  </p>
                </div>

                {sent ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                      <CheckCircle2 className="h-7 w-7" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">¡Listo!</p>
                      <p className="text-sm text-muted-foreground">
                        Abrimos tu cliente de correo. Si no se abrió, escribinos a{' '}
                        <a
                          href="mailto:contacto@gesclub.com.ar"
                          className="font-medium text-primary hover:underline"
                        >
                          contacto@gesclub.com.ar
                        </a>
                        .
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-foreground">
                          Nombre
                        </label>
                        <input
                          id="nombre"
                          type="text"
                          autoComplete="name"
                          value={form.nombre}
                          onChange={update('nombre')}
                          placeholder="Tu nombre"
                          aria-invalid={Boolean(errors.nombre)}
                          aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                          className={cn(
                            fieldBase,
                            'h-12',
                            errors.nombre
                              ? 'border-destructive focus-visible:ring-destructive'
                              : 'border-input focus-visible:border-primary',
                          )}
                        />
                        {errors.nombre && (
                          <p id="nombre-error" className="mt-1 text-xs font-medium text-destructive">
                            {errors.nombre}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={update('email')}
                          placeholder="tu@email.com"
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                          className={cn(
                            fieldBase,
                            'h-12',
                            errors.email
                              ? 'border-destructive focus-visible:ring-destructive'
                              : 'border-input focus-visible:border-primary',
                          )}
                        />
                        {errors.email && (
                          <p id="email-error" className="mt-1 text-xs font-medium text-destructive">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="asunto" className="mb-1.5 block text-sm font-medium text-foreground">
                        Asunto
                      </label>
                      <select
                        id="asunto"
                        value={form.asunto}
                        onChange={update('asunto')}
                        className={cn(fieldBase, 'h-12 border-input focus-visible:border-primary')}
                      >
                        {asuntos.map((asunto) => (
                          <option key={asunto} value={asunto}>
                            {asunto}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="mensaje" className="mb-1.5 block text-sm font-medium text-foreground">
                        Mensaje
                      </label>
                      <textarea
                        id="mensaje"
                        rows={5}
                        value={form.mensaje}
                        onChange={update('mensaje')}
                        placeholder="Contanos en qué podemos ayudarte..."
                        aria-invalid={Boolean(errors.mensaje)}
                        aria-describedby={errors.mensaje ? 'mensaje-error' : undefined}
                        className={cn(
                          fieldBase,
                          'resize-none py-3 leading-6',
                          errors.mensaje
                            ? 'border-destructive focus-visible:ring-destructive'
                            : 'border-input focus-visible:border-primary',
                        )}
                      />
                      {errors.mensaje && (
                        <p id="mensaje-error" className="mt-1 text-xs font-medium text-destructive">
                          {errors.mensaje}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Send className="h-4 w-4" />
                      Enviar mensaje
                    </button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="container mx-auto px-6 pb-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
              Preguntas frecuentes
            </h2>
            <div className="divide-y rounded-2xl border bg-card">
              {faqs.map((faq) => (
                <details key={faq.q} className="group p-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
