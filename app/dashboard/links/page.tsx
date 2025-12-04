"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, ExternalLink } from "lucide-react"
import { getBiolinks, type BiolinkProfile } from "@/lib/biolink-store"

export default function LinksPage() {
  const [mounted, setMounted] = useState(false)
  const [biolinks, setBiolinks] = useState<BiolinkProfile[]>([])

  useEffect(() => {
    setMounted(true)
    setBiolinks(getBiolinks())
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Enlaces</h1>
          <p className="mt-1 text-muted-foreground">Administra los enlaces de todos tus biolinks</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-6 w-40 rounded bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-lg bg-muted" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Enlaces</h1>
        <p className="mt-1 text-muted-foreground">Administra los enlaces de todos tus biolinks</p>
      </div>

      {biolinks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Primero crea un biolink para gestionar enlaces</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Ir al Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {biolinks.map((biolink) => (
            <Card key={biolink.id}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{biolink.displayName}</h3>
                    <p className="text-sm text-muted-foreground">/{biolink.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/editor/${biolink.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/${biolink.username}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {biolink.links.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">Sin enlaces aún</p>
                ) : (
                  <div className="space-y-2">
                    {biolink.links.map((link) => (
                      <div
                        key={link.id}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          link.enabled ? "border-border" : "border-border/50 opacity-50"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="truncate font-medium">{link.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            link.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {link.enabled ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
