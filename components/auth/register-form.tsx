"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Check } from "lucide-react"
import { createBiolink, updateBiolink } from "@/lib/biolink-store"
import { getTemplateById } from "@/lib/templates"
import { supabase } from "@/lib/supabase"

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")
  const template = templateId ? getTemplateById(templateId) : null

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  })
  const [error, setError] = useState("")

  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            username: formData.username,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user && !data.session) {
        // Email confirmation required
        setIsSuccess(true)
        // Create initial biolink structure in local storage for now (optional, as they can't login yet)
        const newBiolink = createBiolink(formData.username)
        if (template) {
          updateBiolink(newBiolink.id, {
            displayName: formData.name || template.profile.displayName,
            bio: template.profile.bio,
            theme: template.profile.theme,
            backgroundColor: template.profile.backgroundColor,
            buttonStyle: template.profile.buttonStyle,
            buttonColor: template.profile.buttonColor,
            textColor: template.profile.textColor,
            links: template.profile.links,
            socialLinks: template.profile.socialLinks,
          })
        } else {
          updateBiolink(newBiolink.id, {
            displayName: formData.name,
          })
        }
      } else if (data.user && data.session) {
        // Auto-login (email confirmation disabled)
        router.push("/onboarding")
      }
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-foreground">¡Cuenta creada!</h1>
        <p className="mb-8 text-muted-foreground">
          Hemos enviado un enlace de confirmación a <strong>{formData.email}</strong>.
          <br />
          Por favor, verifica tu correo electrónico para activar tu cuenta e iniciar sesión.
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Ir a Iniciar Sesión</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          <span className="text-xl font-bold">Clipi.top</span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Crea tu cuenta gratis</h1>
        <p className="mt-2 text-muted-foreground">Comienza a crear biolinks profesionales en minutos</p>

        {template && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div
              className="h-10 w-10 shrink-0 rounded-lg"
              style={{ backgroundColor: template.profile.backgroundColor }}
            >
              <div
                className="mx-auto mt-1.5 h-4 w-4 rounded-full border"
                style={{
                  borderColor: template.profile.buttonColor,
                  backgroundImage: `url(/placeholder.svg?height=16&width=16&query=${template.thumbnail})`,
                  backgroundSize: "cover",
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Plantilla: {template.name}</p>
              <p className="text-xs text-muted-foreground truncate">{template.description}</p>
            </div>
            <Check className="h-5 w-5 shrink-0 text-primary" />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Nombre de usuario</Label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              clipi.top/
            </span>
            <Input
              id="username"
              type="text"
              placeholder="tunombre"
              className="rounded-l-none"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "") })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta gratis"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Al crear una cuenta, aceptas nuestros{" "}
        <Link href="#" className="underline hover:text-foreground">
          Términos de servicio
        </Link>{" "}
        y{" "}
        <Link href="#" className="underline hover:text-foreground">
          Política de privacidad
        </Link>
      </p>
    </div>
  )
}
