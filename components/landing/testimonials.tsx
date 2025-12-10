import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Carlos Martinez",
    role: "Influencer de Fitness",
    content:
      "LinkFlow transformó la manera en que comparto mi contenido. Mis seguidores ahora encuentran todo fácilmente y mis conversiones aumentaron un 60%.",
    avatar: "fitness influencer man athletic",
    rating: 5,
  },
  {
    name: "Ana Rodriguez",
    role: "Dueña de Restaurante",
    content:
      "Desde que uso LinkFlow, las reservas online aumentaron un 40%. La plantilla de restaurante es perfecta para mostrar nuestro menú.",
    avatar: "restaurant owner woman chef",
    rating: 5,
  },
  {
    name: "Diego Silva",
    role: "Músico Independiente",
    content:
      "Ahora mis fans pueden encontrar mi música en todas las plataformas con un solo clic. Es la mejor herramienta para artistas.",
    avatar: "musician man guitarist indie",
    rating: 5,
  },
  {
    name: "Laura Mendez",
    role: "Coach de Vida",
    content:
      "Mis clientes agendan sesiones directamente desde mi biolink. El diseño profesional genera mucha más confianza.",
    avatar: "life coach woman professional",
    rating: 5,
  },
  {
    name: "Roberto Flores",
    role: "Fotógrafo Profesional",
    content:
      "Puedo mostrar mi portfolio, precios y sistema de reservas en un solo lugar. Mis clientes potenciales lo aman.",
    avatar: "photographer man camera professional",
    rating: 5,
  },
  {
    name: "Maria Torres",
    role: "Tienda de Moda Online",
    content:
      "Nuestras ventas por redes sociales aumentaron un 80% desde que usamos LinkFlow. La integración con WhatsApp es genial.",
    avatar: "fashion boutique owner woman stylish",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="border-t border-border bg-muted/30 px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Miles de creadores confían en nosotros
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Descubre lo que dicen nuestros usuarios sobre su experiencia con LinkFlow.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />

              <div className="flex gap-0.5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="mt-4 text-card-foreground leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>

              <div className="mt-6 flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-full bg-muted ring-2 ring-border"
                  style={{
                    backgroundImage: `url(/placeholder.svg?height=48&width=48&query=${testimonial.avatar})`,
                    backgroundSize: "cover",
                  }}
                />
                <div>
                  <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
