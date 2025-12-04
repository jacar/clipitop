"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/clipi.svg" alt="clipi.top logo" width="190" height="40" />
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Funciones
          </Link>
          <Link
            href="/templates"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Plantillas
          </Link>
          <Link
            href="/examples"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Ejemplos
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Precios
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Comenzar Gratis</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Funciones
            </Link>
            <Link
              href="/templates"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plantillas
            </Link>
            <Link
              href="/examples"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ejemplos
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Precios
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/register">Comenzar Gratis</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
