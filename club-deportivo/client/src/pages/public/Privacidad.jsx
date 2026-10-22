import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import { ArrowLeft, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react'

const sections = [
  { id: 'responsable', title: 'Responsable del Tratamiento' },
  { id: 'datos', title: 'Datos que Recopilamos' },
  { id: 'finalidad', title: 'Finalidad del Tratamiento' },
  { id: 'base', title: 'Base Legal' },
  { id: 'conservacion', title: 'Conservación de Datos' },
  { id: 'derechos', title: 'Derechos del Titular' },
  { id: 'terceros', title: 'Divulgación a Terceros' },
  { id: 'seguridad', title: 'Seguridad de los Datos' },
  { id: 'transferencia', title: 'Transferencia Internacional de Datos' },
  { id: 'cambios', title: 'Cambios en la Política de Privacidad' },
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

export default function Privacidad() {
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
            <span className="font-medium text-sidebar-foreground">Política de Privacidad</span>
          </nav>

          <div className="flex items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Política de Privacidad
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
              <p className="text-xs text-muted-foreground">¿Querés ejercer tus derechos?</p>
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
            <Section id="responsable" number={1} title="Responsable del Tratamiento">
              <p>
                GesClub S.A., con CUIT 30-71829364-5, con domicilio en Av. 9 de Julio 789, San Miguel
                de Tucumán, Tucumán, Argentina, es el responsable del tratamiento de los datos
                personales proporcionados por los usuarios.
              </p>
            </Section>

            <Section id="datos" number={2} title="Datos que Recopilamos">
              <p>Podemos recopilar los siguientes datos personales:</p>
              <ul className={listClass}>
                <li>
                  <strong className="font-medium text-foreground">Datos de identificación:</strong>{' '}
                  nombre, apellido, tipo y número de documento.
                </li>
                <li>
                  <strong className="font-medium text-foreground">Datos de contacto:</strong> dirección
                  de correo electrónico, número de teléfono, domicilio.
                </li>
                <li>
                  <strong className="font-medium text-foreground">Datos de facturación:</strong>{' '}
                  información necesaria para procesar pagos.
                </li>
                <li>
                  <strong className="font-medium text-foreground">Datos de uso:</strong> información
                  sobre cómo interactúa con la Plataforma.
                </li>
              </ul>
            </Section>

            <Section id="finalidad" number={3} title="Finalidad del Tratamiento">
              <p>Los datos personales serán utilizados para:</p>
              <ul className={listClass}>
                <li>Gestionar la cuenta de usuario y proporcionar acceso a la Plataforma.</li>
                <li>Procesar inscripciones y pagos de servicios deportivos.</li>
                <li>Enviar comunicaciones relacionadas con el servicio.</li>
                <li>Mejorar la funcionalidad y experiencia de usuario.</li>
                <li>Cumplir con obligaciones legales y regulatorias.</li>
              </ul>
            </Section>

            <Section id="base" number={4} title="Base Legal">
              <p>
                El tratamiento de datos se realiza con el consentimiento del usuario, proporcionado al
                momento del registro y aceptación de esta política, conforme al artículo 5 de la Ley
                25.326 de Protección de Datos Personales.
              </p>
            </Section>

            <Section id="conservacion" number={5} title="Conservación de Datos">
              <p>
                Conservaremos sus datos personales mientras su cuenta esté activa o mientras sean
                necesarios para cumplir con las finalidades descritas. Una vez finalizada la relación,
                los datos serán eliminados de forma segura, salvo que exista una obligación legal de
                conservarlos.
              </p>
            </Section>

            <Section id="derechos" number={6} title="Derechos del Titular">
              <p>La Ley 25.326 le otorga los siguientes derechos:</p>
              <ul className={listClass}>
                <li>
                  <strong className="font-medium text-foreground">Acceso:</strong> solicitar
                  información sobre sus datos personales.
                </li>
                <li>
                  <strong className="font-medium text-foreground">Rectificación:</strong> solicitar la
                  corrección de datos inexactos.
                </li>
                <li>
                  <strong className="font-medium text-foreground">Supresión:</strong> solicitar la
                  eliminación de sus datos.
                </li>
                <li>
                  <strong className="font-medium text-foreground">Oposición:</strong> oponerse al
                  tratamiento de sus datos.
                </li>
              </ul>
              <p>
                Para ejercer estos derechos, envíe un correo a{' '}
                <a
                  href="mailto:contacto@gesclub.com.ar"
                  className="font-medium text-primary hover:underline"
                >
                  contacto@gesclub.com.ar
                </a>{' '}
                indicando el derecho que desea ejercer.
              </p>
            </Section>

            <Section id="terceros" number={7} title="Divulgación a Terceros">
              <p>
                No compartiremos sus datos personales con terceros, excepto cuando sea necesario para:
              </p>
              <ul className={listClass}>
                <li>Cumplir con obligaciones legales o requerimientos judiciales.</li>
                <li>Procesar pagos a través de plataformas de pago autorizadas.</li>
                <li>Proteger los derechos, propiedad o seguridad de GesClub o de terceros.</li>
              </ul>
            </Section>

            <Section id="seguridad" number={8} title="Seguridad de los Datos">
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos
                personales contra accesos no autorizados, pérdida, alteración o divulgación. Estas
                medidas incluyen encriptación SSL, autenticación segura y firewalls.
              </p>
            </Section>

            <Section id="transferencia" number={9} title="Transferencia Internacional de Datos">
              <p>
                Sus datos pueden ser almacenados y procesados en servidores ubicados fuera de la
                República Argentina. En tales casos, garantizamos que se implementan medidas de
                seguridad adecuadas para proteger sus datos.
              </p>
            </Section>

            <Section id="cambios" number={10} title="Cambios en la Política de Privacidad">
              <p>
                Nos reservamos el derecho de modificar esta política en cualquier momento. Los cambios
                serán notificados a través de la Plataforma o por correo electrónico.
              </p>
            </Section>

            <Section id="contacto" number={11} title="Contacto">
              <p>
                Para consultas sobre esta política de privacidad, comuníquese con nosotros a través de
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
                    <span className="block text-sm font-medium text-foreground">+54 381 555-0123</span>
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
            </Section>
          </motion.article>
        </div>
      </main>

      <Footer />
    </div>
  )
}
