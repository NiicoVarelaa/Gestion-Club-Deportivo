import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import { ArrowLeft, Scale, Mail, MapPin } from 'lucide-react'

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

const listClass = 'list-disc space-y-1.5 pl-5 marker:text-primary/60'

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="flex items-baseline gap-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        <span className="text-sm font-semibold tabular-nums text-primary">
          {String(number).padStart(2, '0')}
        </span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-muted-foreground">{children}</div>
    </section>
  )
}

export default function Terminos() {
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
            <span>Legal</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-sidebar-foreground">Términos y Condiciones</span>
          </nav>

          <div className="flex items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
              <Scale className="h-6 w-6" />
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Términos y Condiciones de Uso
              </h1>
              <p className="text-sm text-sidebar-foreground/80">Última actualización: julio de 2026</p>
            </div>
          </div>
        </motion.div>
      </section>

      <main className="flex-1">
        <div className="container mx-auto grid gap-10 px-6 py-12 lg:grid-cols-[220px_1fr] lg:gap-14 lg:py-16">
          <nav aria-label="Índice de contenidos" className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              En esta página
            </p>
            <ol className="border-l border-border">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-xl border bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">¿Tenés dudas sobre los términos?</p>
              <a
                href="mailto:contacto@gesclub.com.ar"
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                Escribinos
              </a>
            </div>
          </nav>

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl space-y-9"
          >
            <Section id="aceptacion" number={1} title="Aceptación de los Términos">
              <p>
                Al acceder y utilizar la plataforma GesClub (en adelante, &ldquo;la Plataforma&rdquo;),
                usted acepta estar sujeto a los presentes Términos y Condiciones. Si no está de
                acuerdo con alguna parte de estos términos, no podrá acceder ni utilizar nuestros
                servicios.
              </p>
            </Section>

            <Section id="servicio" number={2} title="Descripción del Servicio">
              <p>
                GesClub es un sistema de gestión deportiva que permite a clubes y asociaciones
                administrar socios, deportes, inscripciones y pagos de manera centralizada. La
                Plataforma se ofrece como un servicio de software (SaaS) accesible a través de la web.
              </p>
            </Section>

            <Section id="registro" number={3} title="Registro y Cuenta de Usuario">
              <p>
                Para utilizar la Plataforma, el usuario deberá registrarse proporcionando información
                veraz y actualizada. El usuario es responsable de mantener la confidencialidad de sus
                credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.
              </p>
              <p>
                GesClub se reserva el derecho de suspender o cancelar cuentas que proporcionen
                información falsa o que violen estos términos.
              </p>
            </Section>

            <Section id="obligaciones" number={4} title="Obligaciones del Usuario">
              <p>El usuario se compromete a:</p>
              <ul className={listClass}>
                <li>Utilizar la Plataforma de acuerdo con la ley y estos términos.</li>
                <li>No realizar actividades fraudulentas o ilícitas.</li>
                <li>No intentar acceder a datos de otros usuarios sin autorización.</li>
                <li>No interferir con el funcionamiento de la Plataforma.</li>
                <li>Mantener actualizados sus datos de contacto y facturación.</li>
              </ul>
            </Section>

            <Section id="propiedad" number={5} title="Propiedad Intelectual">
              <p>
                Todo el contenido disponible en la Plataforma, incluyendo diseño, logotipos, texto,
                gráficos y código fuente, es propiedad de GesClub S.A. y está protegido por las leyes
                de propiedad intelectual vigentes en la República Argentina.
              </p>
            </Section>

            <Section id="privacidad" number={6} title="Privacidad de Datos">
              <p>
                GesClub cumple con lo dispuesto en la Ley 25.326 de Protección de Datos Personales de
                la República Argentina. Los datos personales proporcionados por los usuarios serán
                tratados de acuerdo con nuestra{' '}
                <Link to="/privacidad" className="font-medium text-primary hover:underline">
                  Política de Privacidad
                </Link>
                .
              </p>
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
                GesClub se reserva el derecho de modificar estos términos en cualquier momento. Los
                cambios entrarán en vigor inmediatamente después de su publicación en la Plataforma.
                El uso continuado de la Plataforma después de las modificaciones constituye la
                aceptación de los nuevos términos.
              </p>
            </Section>

            <Section id="jurisdiccion" number={9} title="Ley Aplicable y Jurisdicción">
              <p>
                Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa
                será resuelta ante los tribunales ordinarios de la provincia de Tucumán.
              </p>
            </Section>

            <Section id="contacto" number={10} title="Contacto">
              <p>
                Para consultas sobre estos términos, puede comunicarse con nosotros a través de los
                siguientes canales:
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
                <div className="flex items-start gap-3">
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
            </Section>
          </motion.article>
        </div>
      </main>

      <Footer />
    </div>
  )
}
