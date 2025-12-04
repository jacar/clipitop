import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="border-t border-border bg-primary px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          Crea tu Enlace en menos de 2 minutos
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-primary-foreground/80">
          Únete a más de 50,000 creadores que ya usan LinkFlow para conectar con su audiencia.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" variant="secondary" asChild className="gap-2">
            <Link href="/register">
              Comenzar gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent"
          >
            <Link href="#pricing">Ver precios</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
