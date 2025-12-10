import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Gratis",
    price: "$0",
    description: "Perfecto para empezar",
    features: ["1 biolink", "Enlaces ilimitados", "Plantillas básicas", "Subdominio gratuito", "Analíticas básicas"],
    cta: "Comenzar gratis",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/mes",
    description: "Para creadores serios",
    features: [
      "Biolinks ilimitados",
      "Todas las plantillas",
      "Dominio personalizado",
      "Analíticas avanzadas",
      "Sin marca de agua",
      "Soporte prioritario",
      "Integraciones premium",
    ],
    cta: "Empezar prueba gratis",
    popular: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "/mes",
    description: "Para equipos y empresas",
    features: [
      "Todo en Pro",
      "5 miembros del equipo",
      "API access",
      "White-label",
      "SSO empresarial",
      "Soporte dedicado",
      "SLA garantizado",
    ],
    cta: "Contactar ventas",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border bg-muted/30 px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Planes simples y transparentes
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Elige el plan que mejor se adapte a tus necesidades. Cambia o cancela cuando quieras.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-card p-8 ${
                plan.popular ? "border-primary shadow-xl ring-1 ring-primary" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  Más popular
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-card-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-card-foreground">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-card-foreground">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="mt-8 w-full" variant={plan.popular ? "default" : "outline"} asChild>
                <Link href="/register">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
