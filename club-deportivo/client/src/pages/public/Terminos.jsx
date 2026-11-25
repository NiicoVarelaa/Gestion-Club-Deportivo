import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  Landmark,
  List,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const sections = [
  { id: 'aceptacion', title: 'Aceptación de los Términos' },
  { id: 'servicio', title: 'Descripción del Servicio' },
  { id: 'registro', title: 'Registro y Cuenta de Usuario' },
  { id: 'obligaciones', title: 'Obligaciones del Usuario' },
  { id: 'propiedad', title: 'Propiedad Intelectual' },
  { id: 'privacidad', title: 'Privacidad de Datos' },
  { id: 'responsabilidad', title: 'Limitación de Responsabilidad' },
  { id: 'modificaciones', title: 'Modificaciones' },
  { id: 'jurisdiccion', title: 'Ley Aplicable y Jurisdicción' },
  { id: 'contacto', title: 'Contacto' },
]

const sectionIds = sections.map((section) => section.id)

const highlights = [
  {
    icon: FileText,
    title: 'Reglas claras',
    description: 'Qué podés hacer y qué esperamos de tu cuenta.',
  },
  {
    icon: ShieldCheck,
    title: 'Datos protegidos',
    description: 'El tratamiento se rige por nuestra política de privacidad.',
  },
  {
    icon: Landmark,
    title: 'Marco legal',
    description: 'Legislación de la República Argentina.',
  },
]

const obligaciones = [
  'Utilizar la Plataforma de acuerdo con la ley y estos términos.',
  'No realizar actividades fraudulentas o ilícitas.',
  'No intentar acceder a datos de otros usuarios sin autorización.',
  'No interferir con el funcionamiento de la Plataforma.',
  'Mantener actualizados sus datos de contacto y facturación.',
]

function useReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const root = document.documentElement
      const max = root.scrollHeight - root.clientHeight
      setProgress(max > 0 ? Math.min(100, (root.scrollTop / max) * 100) : 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return progress
}

function useActiveSection() {
  const [active, setActive] = useState(sectionIds[0])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -55% 0px', threshold: 0 },
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return active
}

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="scroll-mt-28 border-b border-border/60 pb-9 last:border-0 last:pb-0">
      <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold tabular-nums text-primary ring-1 ring-inset ring-primary/15">
          {String(number).padStart(2, '0')}
        </span>
        {title}
      </h2>
      <div className="mt-4 space-y-3 pl-0 text-[15px] leading-7 text-muted-foreground sm:pl-11">
        {children}
      </div>
    </section>
  )
}

function TableOfContents({ activeId, compact = false }) {
  return (
    <ol className={cn('space-y-0.5', compact && 'mt-3')}>
      {sections.map((section, index) => {
        const isActive = section.id === activeId
        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={isActive ? 'location' : undefined}
              onClick={compact ? (event) => event.currentTarget.closest('details')?.removeAttribute('open') : undefined}
              className={cn(
                'flex items-baseline gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )}
            >
              <span className={cn('text-[10px] tabular-nums', isActive ? 'text-primary/70' : 'text-muted-foreground/60')}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex-1">{section.title}</span>
            </a>
          </li>
        )
      })}
    </ol>
  )
}

export default function Terminos() {
  const progress = useReadingProgress()
  const activeId = useActiveSection()
  const activeIndex = Math.max(0, sections.findIndex((section) => section.id === activeId))

  return (
    <div id="top" className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="GesClub" className="h-8 w-auto" />
            <span className="hidden text-lg font-bold sm:block">GesClub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/privacidad"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Privacidad
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/15"
          role="progressbar"
          aria-label="Progreso de lectura"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <section className="relative overflow-hidden border-b bg-gradient-to-br from-sidebar to-sidebar-accent text-sidebar-foreground">
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
          className="relative z-10 container mx-auto px-6 py-12 sm:py-16"
        >
          <nav aria-label="Ruta de navegación" className="mb-5 text-xs text-sidebar-foreground/70">
            <Link to="/" className="hover:text-sidebar-foreground">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span>Legal</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-sidebar-foreground">Términos y Condiciones</span>
          </nav>

          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-inset ring-white/20">
                <Scale className="h-3.5 w-3.5" />
                Documento legal
              </span>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Términos y Condiciones de Uso
              </h1>
              <p className="text-sm leading-6 text-sidebar-foreground/80 sm:text-base">
                Las reglas que ordenan el uso de GesClub, la plataforma de gestión deportiva para
                clubes y asociaciones.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
              <div className="px-3 py-3 sm:px-4">
                <p className="text-[10px] uppercase tracking-wide text-sidebar-foreground/60">Vigencia</p>
                <p className="mt-0.5 text-sm font-semibold">Julio 2026</p>
              </div>
              <div className="border-l border-white/10 px-3 py-3 sm:px-4">
                <p className="text-[10px] uppercase tracking-wide text-sidebar-foreground/60">Secciones</p>
                <p className="mt-0.5 text-sm font-semibold">{sections.length}</p>
              </div>
              <div className="border-l border-white/10 px-3 py-3 sm:px-4">
                <p className="text-[10px] uppercase tracking-wide text-sidebar-foreground/60">Alcance</p>
                <p className="mt-0.5 text-sm font-semibold">Argentina</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <main className="flex-1">
        <div className="container mx-auto px-6 py-10 lg:py-16">
          <details className="group mb-8 rounded-xl border bg-card p-4 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <List className="h-4 w-4 text-primary" />
                Índice de contenidos
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <TableOfContents activeId={activeId} compact />
          </details>

          <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
            <nav
              aria-label="Índice de contenidos"
              className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1"
            >
              <div className="rounded-2xl border bg-card p-3 shadow-sm">
                <div className="flex items-center justify-between px-2 pb-2 pt-1">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <List className="h-3.5 w-3.5" />
                    Contenido
                  </p>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {activeIndex + 1}/{sections.length}
                  </span>
                </div>
                <TableOfContents activeId={activeId} />
                <div className="mx-2 mt-3 h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border bg-muted/40 p-4">
                <p className="text-sm font-semibold">¿Tenés dudas sobre los términos?</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Escribinos y te respondemos a la brevedad.
                </p>
                <a
                  href="mailto:contacto@gesclub.com.ar"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  contacto@gesclub.com.ar
                </a>
                <Link
                  to="/privacidad"
                  className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Ver Política de Privacidad
                </Link>
              </div>
            </nav>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-3xl"
            >
              <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-card p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
                    Resumen rápido
                  </h2>
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  <li className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    GesClub es un servicio de software (SaaS) para administrar socios, deportes,
                    inscripciones y pagos.
                  </li>
                  <li className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Sos responsable de la información de tu cuenta y del uso que le des.
                  </li>
                  <li className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    El uso continuado luego de una modificación implica aceptar los nuevos términos.
                  </li>
                </ul>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {highlights.map((highlight) => (
                  <div key={highlight.title} className="rounded-xl border bg-card p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <highlight.icon className="h-4 w-4" />
                    </span>
                    <p className="mt-3 text-sm font-semibold">{highlight.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 space-y-9">
                <Section id="aceptacion" number={1} title="Aceptación de los Términos">
                  <p>
                    Al acceder y utilizar la plataforma GesClub (en adelante, &ldquo;la
                    Plataforma&rdquo;), usted acepta estar sujeto a los presentes Términos y
                    Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá
                    acceder ni utilizar nuestros servicios.
                  </p>
                </Section>

                <Section id="servicio" number={2} title="Descripción del Servicio">
                  <p>
                    GesClub es un sistema de gestión deportiva que permite a clubes y asociaciones
                    administrar socios, deportes, inscripciones y pagos de manera centralizada. La
                    Plataforma se ofrece como un servicio de software (SaaS) accesible a través de la
                    web.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Socios', 'Disciplinas', 'Inscripciones', 'Pagos'].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </Section>

                <Section id="registro" number={3} title="Registro y Cuenta de Usuario">
                  <p>
                    Para utilizar la Plataforma, el usuario deberá registrarse proporcionando
                    información veraz y actualizada. El usuario es responsable de mantener la
                    confidencialidad de sus credenciales de acceso y de todas las actividades que
                    ocurran bajo su cuenta.
                  </p>
                  <p>
                    GesClub se reserva el derecho de suspender o cancelar cuentas que proporcionen
                    información falsa o que violen estos términos.
                  </p>
                </Section>

                <Section id="obligaciones" number={4} title="Obligaciones del Usuario">
                  <p>El usuario se compromete a:</p>
                  <ul className="grid gap-2 pt-1 sm:grid-cols-2">
                    {obligaciones.map((obligacion) => (
                      <li
                        key={obligacion}
                        className="flex items-start gap-2.5 rounded-lg border bg-muted/30 p-3 text-sm leading-6"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{obligacion}</span>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section id="propiedad" number={5} title="Propiedad Intelectual">
                  <p>
                    Todo el contenido disponible en la Plataforma, incluyendo diseño, logotipos,
                    texto, gráficos y código fuente, es propiedad de GesClub S.A. y está protegido por
                    las leyes de propiedad intelectual vigentes en la República Argentina.
                  </p>
                </Section>

                <Section id="privacidad" number={6} title="Privacidad de Datos">
                  <p>
                    GesClub cumple con lo dispuesto en la Ley 25.326 de Protección de Datos
                    Personales de la República Argentina. Los datos personales proporcionados por los
                    usuarios serán tratados de acuerdo con nuestra Política de Privacidad.
                  </p>
                  <Link
                    to="/privacidad"
                    className="group mt-2 flex items-center gap-3 rounded-xl border bg-muted/30 p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">
                        Política de Privacidad
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Cómo recopilamos, usamos y protegemos tus datos personales.
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                </Section>

                <Section id="responsabilidad" number={7} title="Limitación de Responsabilidad">
                  <p>
                    GesClub no será responsable por daños directos, indirectos, incidentales o
                    consecuentes derivados del uso o la imposibilidad de uso de la Plataforma. La
                    Plataforma se proporciona &ldquo;tal cual&rdquo;, sin garantías de ningún tipo.
                  </p>
                </Section>

                <Section id="modificaciones" number={8} title="Modificaciones">
                  <p>
                    GesClub se reserva el derecho de modificar estos términos en cualquier momento.
                    Los cambios entrarán en vigor inmediatamente después de su publicación en la
                    Plataforma. El uso continuado de la Plataforma después de las modificaciones
                    constituye la aceptación de los nuevos términos.
                  </p>
                </Section>

                <Section id="jurisdiccion" number={9} title="Ley Aplicable y Jurisdicción">
                  <p>
                    Estos términos se rigen por las leyes de la República Argentina. Cualquier
                    disputa será resuelta ante los tribunales ordinarios de la provincia de Tucumán.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
                      <Landmark className="h-3.5 w-3.5 text-primary" />
                      Legislación argentina
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
                      <Scale className="h-3.5 w-3.5 text-primary" />
                      Tribunales de Tucumán
                    </span>
                  </div>
                </Section>

                <Section id="contacto" number={10} title="Contacto">
                  <p>
                    Para consultas sobre estos términos, puede comunicarse con nosotros a través de
                    los siguientes canales:
                  </p>
                  <div className="mt-2 grid gap-3 rounded-2xl border bg-muted/40 p-5 sm:grid-cols-2">
                    <a
                      href="mailto:contacto@gesclub.com.ar"
                      className="flex items-start gap-3 rounded-lg transition-colors hover:text-foreground"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-xs text-muted-foreground">Email</span>
                        <span className="block text-sm font-medium text-foreground">
                          contacto@gesclub.com.ar
                        </span>
                      </span>
                    </a>
                    <a
                      href="tel:+543815550123"
                      className="flex items-start gap-3 rounded-lg transition-colors hover:text-foreground"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Phone className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-xs text-muted-foreground">Teléfono</span>
                        <span className="block text-sm font-medium text-foreground">
                          +54 381 555-0123
                        </span>
                      </span>
                    </a>
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-xs text-muted-foreground">Dirección</span>
                        <span className="block text-sm font-medium text-foreground">
                          Av. 9 de Julio 789, San Miguel de Tucumán, Tucumán, Argentina
                        </span>
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/contacto"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Ir a la página de contacto
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Section>
              </div>

              <div className="mt-10 flex flex-col gap-3 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Última actualización: julio de 2026
                </p>
                <a
                  href="#top"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  Volver arriba
                  <ArrowUpRight className="h-3.5 w-3.5 -rotate-45" />
                </a>
              </div>
            </motion.article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
