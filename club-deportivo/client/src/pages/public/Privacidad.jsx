import { Link } from 'react-router-dom'
import Footer from '@/components/Footer'

export default function Privacidad() {
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
          <h1>Política de Privacidad</h1>
          <p className="text-muted-foreground">Última actualización: julio de 2026</p>

          <h2>1. Responsable del Tratamiento</h2>
          <p>
            GesClub S.A., con CUIT 30-71829364-5, con domicilio en Av. 9 de Julio 789, 
            San Miguel de Tucumán, Tucumán, Argentina, es el responsable del tratamiento de 
            los datos personales proporcionados por los usuarios.
          </p>

          <h2>2. Datos que Recopilamos</h2>
          <p>Podemos recopilar los siguientes datos personales:</p>
          <ul>
            <li><strong>Datos de identificación:</strong> nombre, apellido, tipo y número de documento.</li>
            <li><strong>Datos de contacto:</strong> dirección de correo electrónico, número de teléfono, domicilio.</li>
            <li><strong>Datos de facturación:</strong> información necesaria para procesar pagos.</li>
            <li><strong>Datos de uso:</strong> información sobre cómo interactúa con la Plataforma.</li>
          </ul>

          <h2>3. Finalidad del Tratamiento</h2>
          <p>Los datos personales serán utilizados para:</p>
          <ul>
            <li>Gestionar la cuenta de usuario y proporcionar acceso a la Plataforma.</li>
            <li>Procesar inscripciones y pagos de servicios deportivos.</li>
            <li>Enviar comunicaciones relacionadas con el servicio.</li>
            <li>Mejorar la funcionalidad y experiencia de usuario.</li>
            <li>Cumplir con obligaciones legales y regulatorias.</li>
          </ul>

          <h2>4. Base Legal</h2>
          <p>
            El tratamiento de datos se realiza con el consentimiento del usuario, proporcionado 
            al momento del registro y aceptación de esta política, conforme al artículo 5 de la 
            Ley 25.326 de Protección de Datos Personales.
          </p>

          <h2>5. Conservación de Datos</h2>
          <p>
            Conservaremos sus datos personales mientras su cuenta esté activa o mientras sean 
            necesarios para cumplir con las finalidades descritas. Una vez finalizada la relación, 
            los datos serán eliminados de forma segura, salvo que exista una obligación legal de 
            conservarlos.
          </p>

          <h2>6. Derechos del Titular</h2>
          <p>
            La Ley 25.326 le otorga los siguientes derechos:
          </p>
          <ul>
            <li><strong>Acceso:</strong> solicitar información sobre sus datos personales.</li>
            <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos.</li>
            <li><strong>Supresión:</strong> solicitar la eliminación de sus datos.</li>
            <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos.</li>
          </ul>
          <p>
            Para ejercer estos derechos, envíe un correo a <strong>contacto@gesclub.com.ar</strong> 
            indicando el derecho que desea ejercer.
          </p>

          <h2>7. Divulgación a Terceros</h2>
          <p>
            No compartiremos sus datos personales con terceros, excepto cuando sea necesario 
            para:
          </p>
          <ul>
            <li>Cumplir con obligaciones legales o requerimientos judiciales.</li>
            <li>Procesar pagos a través de plataformas de pago autorizadas.</li>
            <li>Proteger los derechos, propiedad o seguridad de GesClub o de terceros.</li>
          </ul>

          <h2>8. Seguridad de los Datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos 
            personales contra accesos no autorizados, pérdida, alteración o divulgación. Estas 
            medidas incluyen encriptación SSL, autenticación segura y firewalls.
          </p>

          <h2>9. Transferencia Internacional de Datos</h2>
          <p>
            Sus datos pueden ser almacenados y procesados en servidores ubicados fuera de la 
            República Argentina. En tales casos, garantizamos que se implementan medidas de 
            seguridad adecuadas para proteger sus datos.
          </p>

          <h2>10. Cambios en la Política de Privacidad</h2>
          <p>
            Nos reservamos el derecho de modificar esta política en cualquier momento. Los 
            cambios serán notificados a través de la Plataforma o por correo electrónico.
          </p>

          <h2>11. Contacto</h2>
          <p>
            Para consultas sobre esta política de privacidad, comuníquese con nosotros:
            <br />
            Email: <strong>contacto@gesclub.com.ar</strong>
            <br />
            Dirección: Av. 9 de Julio 789, San Miguel de Tucumán, Tucumán, Argentina
            <br />
            Teléfono: +54 381 555-0123
          </p>
        </article>
      </div>

      <Footer />
    </div>
  )
}
