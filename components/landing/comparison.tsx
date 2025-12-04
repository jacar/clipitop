import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  { name: "Biolinks ilimitados", linkflow: true, others: false },
  { name: "Personalización completa", linkflow: true, others: "Limitado" },
  { name: "Analíticas avanzadas", linkflow: true, others: "Solo Pro" },
  { name: "Dominio personalizado", linkflow: true, others: "Solo Pro" },
  { name: "Plantillas por industria", linkflow: "50+", others: "10-15" },
  { name: "Sin marca de agua (gratis)", linkflow: true, others: false },
  { name: "Soporte en español", linkflow: true, others: false },
  { name: "Integraciones", linkflow: "20+", others: "5-10" },
]

export function Comparison() {
  return (
    <section className="border-t border-border px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Por qué elegir clipi.top?
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Comparado con otras alternativas, clipi.top ofrece más por menos
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Característica</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-primary">clipi.top</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">Otros</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {features.map((feature) => (
                <tr key={feature.name} className="bg-card">
                  <td className="px-6 py-4 text-sm text-foreground">{feature.name}</td>
                  <td className="px-6 py-4 text-center">
                    {feature.linkflow === true ? (
                      <Check className="mx-auto h-5 w-5 text-primary" />
                    ) : (
                      <span className="text-sm font-medium text-primary">{feature.linkflow}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {feature.others === false ? (
                      <X className="mx-auto h-5 w-5 text-muted-foreground/50" />
                    ) : (
                      <span className="text-sm text-muted-foreground">{feature.others}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" asChild>
            <Link href="/register">Comenzar gratis con LinkFlow</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
