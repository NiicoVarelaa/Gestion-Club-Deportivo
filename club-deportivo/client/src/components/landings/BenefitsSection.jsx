import { Heart, ShieldCheck, Medal } from 'lucide-react'

const benefits = [
  {
    icon: Heart,
    title: 'Salud y bienestar',
    description: 'Accedé a todas las disciplinas con una cuota fija mensual. Tu salud es nuestra prioridad.',
    color: 'blue',
  },
  {
    icon: ShieldCheck,
    title: 'Comunidad segura',
    description: 'Entrená en un ambiente seguro con profesionales certificados y equipamiento de primer nivel.',
    color: 'emerald',
  },
  {
    icon: Medal,
    title: 'Competencias y torneos',
    description: 'Participá de torneos internos y externos. Representá al club y llevá tu pasión al siguiente nivel.',
    color: 'amber',
  },
]

const colorMap = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-600 dark:text-blue-400' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600 dark:text-emerald-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', icon: 'text-amber-600 dark:text-amber-400' },
}

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
          ¿Por qué ser <span className="text-primary">socio?</span>
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          Descubrí todo lo que te ofrecemos como miembro del club
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map(({ icon: Icon, title, description, color }, index) => (
            <div
              key={title}
              className="p-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/10 dark:to-transparent text-center space-y-4 animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s`, animationFillMode: "both" }}
            >
              <div className={`w-16 h-16 mx-auto rounded-full ${colorMap[color].bg} flex items-center justify-center`}>
                <Icon className={`w-8 h-8 ${colorMap[color].icon}`} />
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}