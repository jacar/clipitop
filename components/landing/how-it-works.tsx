import { UserPlus, Palette, Share2, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Crea tu cuenta",
    description: "Regístrate gratis en menos de 30 segundos. Sin tarjeta de crédito.",
  },
  {
    icon: Palette,
    step: "02",
    title: "Elige una plantilla",
    description: "Selecciona entre +50 plantillas profesionales o crea desde cero.",
  },
  {
    icon: Share2,
    step: "03",
    title: "Personaliza y publica",
    description: "Agrega tus enlaces, colores y estilo. Publica con un clic.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Comparte y crece",
    description: "Comparte tu link único y mide el rendimiento con analíticas.",
  },
]

export function HowItWorks() {
  return (
    <section className="px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Listo en 4 simples pasos
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Crear tu biolink profesional nunca fue tan fácil. Comienza ahora mismo.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-primary/10 lg:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
