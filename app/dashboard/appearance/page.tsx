"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BiolinkService } from "@/lib/biolink-service"
import { type BiolinkProfile } from "@/lib/types"
import { useAuth } from "@/components/auth-provider"

const THEMES = [
  { id: "minimal", name: "Minimal", bg: "#ffffff", btn: "#000000" },
  { id: "dark", name: "Dark Mode", bg: "#1a1a2e", btn: "#eaeaea" },
  { id: "ocean", name: "Ocean", bg: "#e0f7fa", btn: "#00796b" },
  { id: "sunset", name: "Sunset", bg: "#fff3e0", btn: "#e65100" },
  { id: "forest", name: "Forest", bg: "#e8f5e9", btn: "#2e7d32" },
  { id: "royal", name: "Royal", bg: "#ede7f6", btn: "#5e35b1" },
]

export default function AppearancePage() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [biolinks, setBiolinks] = useState<BiolinkProfile[]>([])

  useEffect(() => {
    setMounted(true)
    if (user) {
      const fetchBiolinks = async () => {
        const data = await BiolinkService.getBiolinks(user.id)
        setBiolinks(data)
      }
      fetchBiolinks()
    }
  }, [user])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Apariencia</h1>
          <p className="mt-1 text-muted-foreground">Personaliza el estilo visual de tus biolinks</p>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-40 rounded bg-muted" />
            <div className="h-4 w-64 rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 rounded-xl bg-muted" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Apariencia</h1>
        <p className="mt-1 text-muted-foreground">Personaliza el estilo visual de tus biolinks</p>
      </div>

      {biolinks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Primero crea un biolink para personalizar su apariencia</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Ir al Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Temas predefinidos</CardTitle>
              <CardDescription>Selecciona un tema para aplicar rápidamente a tus biolinks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    className="cursor-pointer overflow-hidden rounded-xl border-2 border-border transition-all hover:border-primary"
                  >
                    <div className="p-4" style={{ backgroundColor: theme.bg }}>
                      <div className="mx-auto h-8 w-8 rounded-full bg-muted" />
                      <div className="mx-auto mt-2 h-3 w-20 rounded bg-muted" />
                      <div className="mx-auto mt-4 h-8 w-full rounded-lg" style={{ backgroundColor: theme.btn }} />
                      <div
                        className="mx-auto mt-2 h-8 w-full rounded-lg opacity-70"
                        style={{ backgroundColor: theme.btn }}
                      />
                    </div>
                    <div className="border-t bg-card p-3 text-center">
                      <span className="text-sm font-medium">{theme.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tus biolinks</CardTitle>
              <CardDescription>Selecciona un biolink para personalizar su apariencia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {biolinks.map((biolink) => (
                  <Link
                    key={biolink.id}
                    href={`/dashboard/editor/${biolink.id}`}
                    className="block rounded-xl border border-border p-4 transition-all hover:border-primary hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full" style={{ backgroundColor: biolink.buttonColor }} />
                      <div>
                        <p className="font-medium">{biolink.displayName}</p>
                        <p className="text-sm text-muted-foreground">/{biolink.username}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
