"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates"

export default function ExamplesPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const featuredTemplates = TEMPLATES.filter((_, i) => i % 3 === 0).slice(0, 12)

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % featuredTemplates.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + featuredTemplates.length) % featuredTemplates.length)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">L</span>
              </div>
              <span className="text-lg font-bold">LinkFlow</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/templates">Ver plantillas</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Comenzar gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Ejemplos en vivo
              </Badge>
              <h1 className="text-4xl font-bold text-foreground sm:text-5xl">Mira lo que puedes crear</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Explora ejemplos reales de biolinks creados con LinkFlow. Cada uno es completamente personalizable.
              </p>
            </div>

            {/* Featured Carousel */}
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={prevSlide} className="shrink-0 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border-2 border-border shadow-2xl">
                <div
                  className="p-8 transition-all duration-300"
                  style={{ backgroundColor: featuredTemplates[activeIndex].profile.backgroundColor }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="h-20 w-20 rounded-full border-4 bg-muted"
                      style={{
                        borderColor: featuredTemplates[activeIndex].profile.buttonColor,
                        backgroundImage: `url(/placeholder.svg?height=80&width=80&query=${featuredTemplates[activeIndex].thumbnail})`,
                        backgroundSize: "cover",
                      }}
                    />
                    <h3
                      className="mt-4 text-lg font-bold"
                      style={{ color: featuredTemplates[activeIndex].profile.textColor }}
                    >
                      {featuredTemplates[activeIndex].profile.displayName}
                    </h3>
                    <p
                      className="mt-1 text-center text-sm opacity-80"
                      style={{ color: featuredTemplates[activeIndex].profile.textColor }}
                    >
                      {featuredTemplates[activeIndex].profile.bio}
                    </p>

                    <div className="mt-6 flex w-full flex-col gap-2">
                      {featuredTemplates[activeIndex].profile.links.slice(0, 4).map((link) => (
                        <div
                          key={link.id}
                          className="w-full py-2.5 text-center text-sm font-medium text-white"
                          style={{
                            backgroundColor: featuredTemplates[activeIndex].profile.buttonColor,
                            borderRadius:
                              featuredTemplates[activeIndex].profile.buttonStyle === "pill"
                                ? "9999px"
                                : featuredTemplates[activeIndex].profile.buttonStyle === "square"
                                  ? "0"
                                  : "12px",
                          }}
                        >
                          {link.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="icon" onClick={nextSlide} className="shrink-0 bg-transparent">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {featuredTemplates[activeIndex].name} - {featuredTemplates[activeIndex].description}
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Button variant="outline" asChild>
                  <Link href={`/${featuredTemplates[activeIndex].id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver demo
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/register?template=${featuredTemplates[activeIndex].id}`}>Usar esta plantilla</Link>
                </Button>
              </div>
            </div>

            {/* Dots */}
            <div className="mt-8 flex justify-center gap-2">
              {featuredTemplates.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-foreground">Explora por categoría</h2>
            <p className="mt-2 text-center text-muted-foreground">
              Plantillas especializadas para cada tipo de negocio
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATE_CATEGORIES.filter((c) => c.id !== "all").map((category) => {
                const categoryTemplates = TEMPLATES.filter((t) => t.category === category.id)
                const previewTemplate = categoryTemplates[0]

                return (
                  <Link
                    key={category.id}
                    href={`/templates?category=${category.id}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
                  >
                    <div
                      className="h-32 p-4"
                      style={{ backgroundColor: previewTemplate?.profile.backgroundColor || "#f5f5f5" }}
                    >
                      <div className="flex h-full items-center justify-center gap-2">
                        {categoryTemplates.slice(0, 3).map((t, i) => (
                          <div
                            key={t.id}
                            className="h-12 w-12 rounded-full border-2 bg-muted"
                            style={{
                              borderColor: t.profile.buttonColor,
                              backgroundImage: `url(/placeholder.svg?height=48&width=48&query=${t.thumbnail})`,
                              backgroundSize: "cover",
                              transform: `translateY(${i === 1 ? -8 : 0}px)`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-card-foreground">{category.name}</h3>
                        <Badge variant="secondary">{categoryTemplates.length}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {categoryTemplates.length} plantillas profesionales
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-muted/50 py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-8 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{TEMPLATES.length}+</div>
                <div className="mt-1 text-sm text-muted-foreground">Plantillas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{TEMPLATE_CATEGORIES.length - 1}</div>
                <div className="mt-1 text-sm text-muted-foreground">Categorías</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">100%</div>
                <div className="mt-1 text-sm text-muted-foreground">Personalizables</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">Gratis</div>
                <div className="mt-1 text-sm text-muted-foreground">Para empezar</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground">Crea tu biolink en minutos</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Únete a miles de creadores que ya usan LinkFlow para conectar con su audiencia
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">Comenzar gratis</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/templates">Ver todas las plantillas</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
