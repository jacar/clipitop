"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Crown, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TEMPLATE_CATEGORIES, getTemplatesByCategory, type Template } from "@/lib/templates"
import { TemplatePreview } from "@/components/templates/template-preview"

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTemplates = getTemplatesByCategory(selectedCategory).filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <Button asChild>
            <Link href="/register">Comenzar gratis</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">+50 Plantillas para cada industria</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Elige una plantilla diseñada profesionalmente para tu tipo de negocio y personalízala completamente a tu
            gusto.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mt-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar plantillas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category.name}
              {category.id !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">({getTemplatesByCategory(category.id).length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Templates Count */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Mostrando {filteredTemplates.length} plantillas
        </p>

        {/* Templates Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all ${
                selectedTemplate?.id === template.id
                  ? "border-primary shadow-lg"
                  : "border-border hover:border-primary/50 hover:shadow-md"
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              {/* Template Preview */}
              <div className="relative h-56 p-3" style={{ backgroundColor: template.profile.backgroundColor }}>
                {template.isPro && (
                  <div className="absolute left-3 top-3 z-10">
                    <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Crown className="h-3 w-3" />
                      PRO
                    </Badge>
                  </div>
                )}
                {selectedTemplate?.id === template.id && (
                  <div className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                )}

                <div className="mx-auto w-36">
                  <div className="flex flex-col items-center">
                    <div
                      className="h-10 w-10 rounded-full bg-muted"
                      style={{
                        backgroundImage: `url(/placeholder.svg?height=40&width=40&query=${template.thumbnail})`,
                        backgroundSize: "cover",
                      }}
                    />
                    <div className="mt-1.5 text-[10px] font-bold" style={{ color: template.profile.textColor }}>
                      {template.profile.displayName}
                    </div>
                    <div
                      className="mt-0.5 line-clamp-2 text-center text-[8px] opacity-70"
                      style={{ color: template.profile.textColor }}
                    >
                      {template.profile.bio}
                    </div>
                    <div className="mt-2 flex w-full flex-col gap-1">
                      {template.profile.links.slice(0, 3).map((link) => (
                        <div
                          key={link.id}
                          className="py-1 text-center text-[8px] text-white"
                          style={{
                            backgroundColor: template.profile.buttonColor,
                            borderRadius:
                              template.profile.buttonStyle === "pill"
                                ? "9999px"
                                : template.profile.buttonStyle === "square"
                                  ? "0px"
                                  : "4px",
                          }}
                        >
                          {link.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="border-t border-border bg-card p-3">
                <div>
                  <h3 className="font-semibold text-card-foreground">{template.name}</h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{template.description}</p>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent" asChild>
                    <Link href={`/${template.id}`}>Vista previa</Link>
                  </Button>
                  <Button size="sm" className="flex-1 text-xs" asChild>
                    <Link href={`/register?template=${template.id}`}>Usar</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-foreground">No se encontraron plantillas</p>
            <p className="mt-2 text-muted-foreground">Intenta con otra búsqueda o categoría</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Ver todas las plantillas
            </Button>
          </div>
        )}

        {/* Selected Template Preview Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
                {selectedTemplate.isPro && (
                  <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Crown className="h-3 w-3" />
                    PRO
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{selectedTemplate.description}</p>

              <div className="mt-6">
                <TemplatePreview template={selectedTemplate} />
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href={`/${selectedTemplate.id}`}>Ver demo completa</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href={`/register?template=${selectedTemplate.id}`}>Usar esta plantilla</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer CTA */}
      <section className="border-t border-border bg-muted/50 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground">¿No encuentras lo que buscas?</h2>
          <p className="mt-2 text-muted-foreground">
            Crea tu biolink desde cero y personalízalo completamente a tu gusto
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/register">Crear biolink personalizado</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
