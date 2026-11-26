import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Av.+9+de+Julio+789,+San+Miguel+de+Tucum%C3%A1n'

const channels = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contacto@gesclub.com.ar',
    href: 'mailto:contacto@gesclub.com.ar',
    note: 'Respuesta en 24 hs hábiles.',
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
    label: 'Oficina',
    value: 'Av. 9 de Julio 789',
    href: MAPS_URL,
    external: true,
    note: 'San Miguel de Tucumán.',
  },
  {
    icon: Clock,
    label: 'Horarios',
    value: 'Lun a Vie · 8 a 20 h',
    note: 'Sábados de 9 a 13 h.',
  },
]

const quickLinks = [
  {
    to: '/login',
    label: 'Portal del socio',
    description: 'Cuotas, disciplinas y datos.',
    icon: UserRound,
  },
  {
    to: '/registro',
    label: 'Crear una cuenta',
    description: 'Sumate al club en minutos.',
    icon: Sparkles,
  },
  {
    to: '/forgot-password',
    label: 'Recuperar acceso',
    description: 'Restablecé tu contraseña.',
    icon: ShieldCheck,
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
  {
    q: '¿Cómo actualizo mis datos personales?',
    a: (
      <>
        Ingresá a tu cuenta y editá tu información desde Mi perfil. Si necesitás cambiar el email o
        el DNI, escribinos y lo gestionamos con vos.
      </>
    ),
  },
  {
    q: '¿Atienden de forma presencial?',
    a: (
      <>
        Sí. Nuestra oficina está en Av. 9 de Julio 789, San Miguel de Tucumán, de lunes a viernes de
        8:00 a 20:00 y sábados de 9:00 a 13:00.
      </>
    ),
  },
]

const fieldBase =
  'w-full rounded-xl border bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

function RequiredMark() {
  return (
    <span className="ml-0.5 text-destructive" aria-hidden="true">
      *
    </span>
  )
}

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: asuntos[0], mensaje: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
    if (sent) setSent(false)
  }

  const resetForm = () => {
    setForm({ nombre: '', email: '', asunto: asuntos[0], mensaje: '' })
    setErrors({})
    setSent(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.nombre.trim()) next.nombre = 'Ingresá tu nombre'
    if (!form.email.trim()) next.email = 'Ingresá tu email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Email inválido'
    if (!form.mensaje.trim()) next.mensaje = 'Contanos tu consulta'

    setErrors(next)

    const firstInvalid = ['nombre', 'email', 'mensaje'].find((key) => next[key])
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }

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
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="GesClub" className="h-8 w-auto" />
            <span className="hidden text-lg font-bold sm:block">GesClub</span>
          </Link>

          <nav
            aria-label="Navegación de contacto"
            className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"
          >
            <a href="#canales" className="transition-colors hover:text-foreground">
              Canales
            </a>
            <a href="#formulario" className="transition-colors hover:text-foreground">
              Escribinos
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              Preguntas frecuentes
            </a>
          </nav>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-sidebar to-sidebar-accent pt-12 pb-20 text-sidebar-foreground sm:pt-16 sm:pb-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/club.webp')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-sidebar/95 via-sidebar-accent/85 to-sidebar/95"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 container mx-auto grid items-end gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_380px]"
        >
          <div className="max-w-2xl space-y-5">
            <nav aria-label="Ruta de navegación" className="text-xs text-sidebar-foreground/70">
              <Link to="/" className="hover:text-sidebar-foreground">
                Inicio
              </Link>
              <span className="mx-2">/</span>
              <span className="font-medium text-sidebar-foreground">Contacto</span>
            </nav>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-inset ring-white/20">
              <Sparkles className="h-3.5 w-3.5" />
              Atención personalizada
            </span>

            <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              ¿En qué podemos ayudarte?
            </h1>
            <p className="max-w-xl text-base leading-7 text-sidebar-foreground/80">
              Escribinos por tu cuenta, inscripciones o pagos. Un equipo real te responde con
              claridad y sin vueltas.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#formulario"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-sidebar shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Enviar un mensaje
                <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href="#canales"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Ver canales
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-sidebar-foreground/80">
                Atención online
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold leading-tight">
              Respondemos en menos de 24 h
            </p>
            <div className="mt-4 space-y-2.5 text-sm text-sidebar-foreground/85">
              <p className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 opacity-70" />
                Lun a Vie · 8:00 a 20:00
              </p>
              <a
                href="mailto:contacto@gesclub.com.ar"
                className="flex items-center gap-2.5 transition-colors hover:text-sidebar-foreground"
              >
                <Mail className="h-4 w-4 shrink-0 opacity-70" />
                contacto@gesclub.com.ar
              </a>
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 opacity-70" />
                San Miguel de Tucumán
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <main className="flex-1">
        <section id="canales" className="container mx-auto scroll-mt-24 px-6">
          <div className="relative z-10 -mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => {
              const content = (
                <>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <channel.icon className="h-5 w-5" />
                    </span>
                    {channel.href && (
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    )}
                  </div>
                  <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {channel.label}
                  </p>
                  <p className="mt-0.5 break-words text-sm font-semibold leading-5 text-foreground">
                    {channel.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{channel.note}</p>
                </>
              )

              const className =
                'flex flex-col rounded-2xl border bg-card p-4 shadow-sm transition-colors'

              return channel.href ? (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noreferrer' : undefined}
                  className={cn(className, 'group hover:border-primary/40 hover:bg-primary/5')}
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
        </section>

        <div
          id="formulario"
          className="container mx-auto grid scroll-mt-24 gap-8 px-6 py-12 lg:grid-cols-5 lg:gap-10 lg:py-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="overflow-hidden border-border/60 shadow-lg shadow-black/5">
              <div className="border-b bg-muted/30 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Formulario de contacto
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Envianos un mensaje</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Contanos qué necesitás y te respondemos a la brevedad.
                </p>
              </div>

              <CardContent className="p-6 sm:p-8">
                {sent ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex flex-col items-center gap-4 py-8 text-center"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                      <CheckCircle2 className="h-7 w-7" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-foreground">¡Mensaje preparado!</p>
                      <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">
                        Abrimos tu cliente de correo con el mensaje listo para enviar. Si no se abrió,
                        escribinos directo a{' '}
                        <a
                          href="mailto:contacto@gesclub.com.ar"
                          className="font-medium text-primary hover:underline"
                        >
                          contacto@gesclub.com.ar
                        </a>
                        .
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <a
                        href="mailto:contacto@gesclub.com.ar"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <Mail className="h-4 w-4" />
                        Escribir por email
                      </a>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                      >
                        Enviar otro mensaje
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="nombre"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Nombre
                          <RequiredMark />
                        </label>
                        <input
                          id="nombre"
                          type="text"
                          autoComplete="name"
                          value={form.nombre}
                          onChange={update('nombre')}
                          placeholder="Tu nombre"
                          aria-required="true"
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
                          <p
                            id="nombre-error"
                            role="alert"
                            className="mt-1 text-xs font-medium text-destructive"
                          >
                            {errors.nombre}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Email
                          <RequiredMark />
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={update('email')}
                          placeholder="tu@email.com"
                          aria-required="true"
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
                          <p
                            id="email-error"
                            role="alert"
                            className="mt-1 text-xs font-medium text-destructive"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="asunto"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Asunto
                      </label>
                      <div className="relative">
                        <select
                          id="asunto"
                          value={form.asunto}
                          onChange={update('asunto')}
                          className={cn(
                            fieldBase,
                            'h-12 appearance-none border-input pr-10 focus-visible:border-primary',
                          )}
                        >
                          {asuntos.map((asunto) => (
                            <option key={asunto} value={asunto}>
                              {asunto}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <label
                          htmlFor="mensaje"
                          className="block text-sm font-medium text-foreground"
                        >
                          Mensaje
                          <RequiredMark />
                        </label>
                        <span
                          id="mensaje-contador"
                          className="text-xs tabular-nums text-muted-foreground"
                        >
                          {form.mensaje.length}/1000
                        </span>
                      </div>
                      <textarea
                        id="mensaje"
                        rows={5}
                        maxLength={1000}
                        value={form.mensaje}
                        onChange={update('mensaje')}
                        placeholder="Contanos en qué podemos ayudarte..."
                        aria-required="true"
                        aria-invalid={Boolean(errors.mensaje)}
                        aria-describedby={cn(
                          'mensaje-contador',
                          errors.mensaje && 'mensaje-error',
                        )}
                        className={cn(
                          fieldBase,
                          'resize-none py-3 leading-6',
                          errors.mensaje
                            ? 'border-destructive focus-visible:ring-destructive'
                            : 'border-input focus-visible:border-primary',
                        )}
                      />
                      {errors.mensaje && (
                        <p
                          id="mensaje-error"
                          role="alert"
                          className="mt-1 text-xs font-medium text-destructive"
                        >
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

                    <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      Al enviar se abrirá tu cliente de correo. No almacenamos los datos de este
                      formulario en el sitio.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 lg:col-span-2"
          >
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground">Información práctica</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Horario de atención
                    </dt>
                    <dd className="mt-0.5 leading-6 text-foreground">
                      Lun a Vie · 8:00 a 20:00
                      <br />
                      Sábados · 9:00 a 13:00
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Oficina
                    </dt>
                    <dd className="mt-0.5 leading-6 text-foreground">
                      Av. 9 de Julio 789
                      <br />
                      San Miguel de Tucumán
                    </dd>
                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Ver en Google Maps
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <HelpCircle className="h-4 w-4 text-primary" />
                Accesos rápidos
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Resolvé las gestiones más comunes sin esperar respuesta.
              </p>

              <div className="mt-4 space-y-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-3 rounded-xl border bg-background/70 p-3 transition-colors hover:border-primary/40 hover:bg-accent/50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <link.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">{link.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {link.description}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>

        <section id="faq" className="scroll-mt-24 border-t bg-muted/30">
          <div className="container mx-auto grid gap-8 px-6 py-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                Preguntas frecuentes
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Respuestas rápidas
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Las dudas más habituales sobre cuentas, cuotas e inscripciones.
              </p>
              <a
                href="#formulario"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                ¿No encontrás tu respuesta? Escribinos
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="divide-y rounded-2xl border bg-card">
              {faqs.map((faq) => (
                <details key={faq.q} className="group p-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
