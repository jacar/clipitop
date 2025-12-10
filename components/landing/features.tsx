import { Palette, BarChart3, Zap, Globe, Shield, Smartphone } from "lucide-react"

const features = [
  {
    icon: Palette,
    title: "Diseños personalizables",
    description: "Elige entre docenas de plantillas y personaliza colores, fuentes y estilos para reflejar tu marca.",
  },
  {
    icon: BarChart3,
    title: "Analíticas detalladas",
    description: "Conoce a tu audiencia con estadísticas de clics, visitas y rendimiento de cada enlace.",
  },
  {
    icon: Zap,
    title: "Configuración en segundos",
    description: "Crea tu biolink en menos de 2 minutos. Sin conocimientos técnicos necesarios.",
  },
  {
    icon: Globe,
    title: "Dominio personalizado",
    description: "Usa tu propio dominio o nuestro subdominio gratuito linkflow.me/tunombre.",
  },
  {
    icon: Shield,
    title: "Seguro y confiable",
    description: "Certificado SSL incluido y uptime del 99.9% garantizado para tu tranquilidad.",
  },
  {
    icon: Smartphone,
    title: "Optimizado para móvil",
    description: "Tu biolink se ve perfecto en cualquier dispositivo, desde móviles hasta escritorio.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border bg-muted/30 px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Todo lo que necesitas para destacar
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Herramientas potentes y fáciles de usar para crear la mejor experiencia para tu audiencia.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
