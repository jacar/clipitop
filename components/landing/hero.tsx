import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { BiolinkCarousel } from "./biolink-carousel"
// Removed import of local users as they are no longer needed

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 lg:px-8 lg:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#6A8EEB]/30 via-[#C7A2E8]/30 to-[#FFB6C1]/30" />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">


            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Un solo enlace para <span className="text-primary">todo tu contenido</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
              Crea tu página de clipi.top personalizada en minutos. Comparte todos tus enlaces, redes sociales y contenido
              desde un solo lugar profesional y atractivo.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/register">
                  Crear mi Clipi.top gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#templates">Ver plantillas</Link>
              </Button>
            </div>

// Placeholder: removed example users display
            {/* Example users section removed */}
          </div>

          <div className="flex justify-center lg:justify-end">
            <BiolinkCarousel />
          </div>
        </div>
      </div>
    </section>
  )
}
