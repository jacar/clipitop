import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"
import Link from "next/link"
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates"

const featuredTemplates = TEMPLATES.slice(0, 9)

export function Templates() {
  return (
    <section id="templates" className="px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            +50 plantillas
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Plantillas para cada industria
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Comienza con una plantilla diseñada profesionalmente para tu tipo de negocio y personalízala completamente.
          </p>
        </div>

        {/* Category Pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {TEMPLATE_CATEGORIES.filter((c) => c.id !== "all")
            .slice(0, 6)
            .map((category) => (
              <Link
                key={category.id}
                href={`/templates?category=${category.id}`}
                className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {category.name}
              </Link>
            ))}
        </div>

        {/* Templates Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-xl"
            >
              {/* Template Preview */}
              <div className="relative h-48 p-4" style={{ backgroundColor: template.profile.backgroundColor }}>
                {template.isPro && (
                  <div className="absolute left-3 top-3 z-10">
                    <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Crown className="h-3 w-3" />
                      PRO
                    </Badge>
                  </div>
                )}
                <span
                  className="absolute right-3 top-3 inline-block rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm"
                  style={{
                    backgroundColor: `${template.profile.buttonColor}30`,
                    color: template.profile.textColor,
                  }}
                >
                  {TEMPLATE_CATEGORIES.find((c) => c.id === template.category)?.name}
                </span>

                <div className="mx-auto w-36">
                  <div className="flex flex-col items-center">
                    <div
                      className="h-12 w-12 rounded-full border-2 bg-muted"
                      style={{
                        borderColor: template.profile.buttonColor,
                        backgroundImage: `url(/placeholder.svg?height=48&width=48&query=${template.thumbnail})`,
                        backgroundSize: "cover",
                      }}
                    />
                    <div className="mt-2 text-xs font-bold" style={{ color: template.profile.textColor }}>
                      {template.profile.displayName}
                    </div>
                    <div
                      className="mt-1 line-clamp-1 text-center text-[10px] opacity-70"
                      style={{ color: template.profile.textColor }}
                    >
                      {template.profile.bio}
                    </div>
                    <div className="mt-3 flex w-full flex-col gap-1.5">
                      {template.profile.links.slice(0, 2).map((link) => (
                        <div
                          key={link.id}
                          className="py-1.5 text-center text-[10px] text-white"
                          style={{
                            backgroundColor: template.profile.buttonColor,
                            borderRadius:
                              template.profile.buttonStyle === "pill"
                                ? "9999px"
                                : template.profile.buttonStyle === "square"
                                  ? "0px"
                                  : "6px",
                          }}
                        >
                          {link.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-card-foreground">{template.name}</h3>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{template.description}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1" asChild>
                    <Link href={`/${template.id}`}>Vista previa</Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/register?template=${template.id}`}>Usar</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/templates">Ver las {TEMPLATES.length}+ plantillas</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
