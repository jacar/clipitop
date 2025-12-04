import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Store, Music, Briefcase, Camera, GraduationCap, Heart, Calendar } from "lucide-react"

const useCases = [
  {
    icon: Users,
    title: "Influencers",
    description: "Centraliza todos tus enlaces de redes sociales, colaboraciones y contenido patrocinado.",
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: Store,
    title: "Negocios Locales",
    description: "Comparte menú, ubicación, reservaciones y contacto de tu restaurante o tienda.",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: Music,
    title: "Músicos y Artistas",
    description: "Conecta fans con tu música en Spotify, Apple Music, YouTube y más.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Briefcase,
    title: "Freelancers",
    description: "Muestra tu portfolio, servicios y facilita que clientes te contacten.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Camera,
    title: "Fotógrafos",
    description: "Presenta tu trabajo, paquetes de precios y sistema de reservas.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: GraduationCap,
    title: "Educadores",
    description: "Comparte cursos, recursos educativos y agenda clases particulares.",
    color: "bg-yellow-500/10 text-yellow-600",
  },
  {
    icon: Heart,
    title: "Salud y Bienestar",
    description: "Agenda citas, comparte servicios y conecta con pacientes.",
    color: "bg-red-500/10 text-red-500",
  },
  {
    icon: Calendar,
    title: "Eventos",
    description: "Invitaciones digitales, confirmaciones y toda la info del evento.",
    color: "bg-indigo-500/10 text-indigo-500",
  },
]

export function UseCases() {
  return (
    <section className="border-t border-border px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Perfecto para cualquier industria
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Sin importar tu profesión, LinkFlow se adapta a tus necesidades.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${useCase.color}`}>
                <useCase.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold text-card-foreground">{useCase.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{useCase.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/examples">Ver ejemplos por industria</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
