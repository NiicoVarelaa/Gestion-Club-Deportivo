import { Link } from 'react-router-dom'
import Footer from '@/components/Footer'

export default function Terminos() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>

        <article className="prose prose-sm dark:prose-invert max-w-3xl mx-auto">
          <h1>Términos y Condiciones de Uso</h1>
          <p className="text-muted-foreground">Última actualización: julio de 2026</p>

          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar la plataforma GesClub (en adelante, "la Plataforma"), usted acepta 
            estar sujeto a los presentes Términos y Condiciones. Si no está de acuerdo con alguna 
            parte de estos términos, no podrá acceder ni utilizar nuestros servicios.
          </p>

          <h2>2. Descripción del Servicio</h2>
          <p>
            GesClub es un sistema de gestión deportiva que permite a clubes y asociaciones 
            administrar socios, deportes, inscripciones y pagos de manera centralizada. La 
            Plataforma se ofrece como un servicio de software (SaaS) accesible a través de la web.
          </p>

          <h2>3. Registro y Cuenta de Usuario</h2>
          <p>
            Para utilizar la Plataforma, el usuario deberá registrarse proporcionando información 
            veraz y actualizada. El usuario es responsable de mantener la confidencialidad de sus 
            credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.
          </p>
          <p>
            GesClub se reserva el derecho de suspender o cancelar cuentas que proporcionen 
            información falsa o que violen estos términos.
          </p>

          <h2>4. Obligaciones del Usuario</h2>
          <p>El usuario se compromete a:</p>
          <ul>
            <li>Utilizar la Plataforma de acuerdo con la ley y estos términos.</li>
            <li>No realizar actividades fraudulentas o ilícitas.</li>
            <li>No intentar acceder a datos de otros usuarios sin autorización.</li>
            <li>No interferir con el funcionamiento de la Plataforma.</li>
            <li>Mantener actualizados sus datos de contacto y facturación.</li>
          </ul>

          <h2>5. Propiedad Intelectual</h2>
          <p>
            Todo el contenido disponible en la Plataforma, incluyendo diseño, logotipos, texto, 
            gráficos y código fuente, es propiedad de GesClub S.A. y está protegido por las leyes 
            de propiedad intelectual vigentes en la República Argentina.
          </p>

          <h2>6. Privacidad de Datos</h2>
          <p>
            GesClub cumple con lo dispuesto en la Ley 25.326 de Protección de Datos Personales 
            de la República Argentina. Los datos personales proporcionados por los usuarios serán 
            tratados de acuerdo con nuestra Política de Privacidad.
          </p>

          <h2>7. Limitación de Responsabilidad</h2>
          <p>
            GesClub no será responsable por daños directos, indirectos, incidentales o 
            consecuentes derivados del uso o la imposibilidad de uso de la Plataforma. La 
            Plataforma se proporciona "tal cual", sin garantías de ningún tipo.
          </p>

          <h2>8. Modificaciones</h2>
          <p>
            GesClub se reserva el derecho de modificar estos términos en cualquier momento. 
            Los cambios entrarán en vigor inmediatamente después de su publicación en la 
            Plataforma. El uso continuado de la Plataforma después de las modificaciones 
            constituye la aceptación de los nuevos términos.
          </p>

          <h2>9. Ley Aplicable y Jurisdicción</h2>
          <p>
            Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa 
            será resuelta ante los tribunales ordinarios de la provincia de Tucumán.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Para consultas sobre estos términos, puede comunicarse a:
            <br />
            Email: <strong>contacto@gesclub.com.ar</strong>
            <br />
            Dirección: Av. 9 de Julio 789, San Miguel de Tucumán, Tucumán, Argentina
          </p>
        </article>
      </div>

      <Footer />
    </div>
  )
}
