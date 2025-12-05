"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ExternalLink, Eye, MousePointer, TrendingUp, Share2 } from "lucide-react"
import { BiolinkService } from "@/lib/biolink-service"
import { type BiolinkProfile } from "@/lib/types"
import { ShareDialog } from "@/components/dashboard/share-dialog"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [biolinks, setBiolinks] = useState<BiolinkProfile[]>([])
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedBiolinkUsername, setSelectedBiolinkUsername] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      const fetchBiolinks = async () => {
        const data = await BiolinkService.getBiolinks(user.id)
        setBiolinks(data)
      }
      fetchBiolinks()
    }
  }, [isLoading, user, router])

  const handleCreateBiolink = async () => {
    if (!user) return
    setIsCreating(true)

    try {
      // Generar un username único si ya existe
      // Use user metadata for username if available, otherwise fallback
      const baseUsername = user.user_metadata?.username || `user${Date.now()}`
      let username = baseUsername
      let counter = 1

      // Check if username exists (simple check against current list, ideally should check DB)
      // For now, we'll rely on DB unique constraint or simple client check if list is full
      // Better approach: try to create, if fails with unique constraint, retry with new name
      // But for simplicity in this step, let's just try to create with a timestamp if base fails
      // actually, let's just append timestamp to ensure uniqueness for now
      if (biolinks.some(b => b.username === username)) {
        username = `${baseUsername}-${Date.now()}`
      }

      const newBiolink = await BiolinkService.createBiolink(user.id, username)

      if (newBiolink) {
        setBiolinks([newBiolink, ...biolinks])
        // Abrir diálogo de compartir automáticamente
        setSelectedBiolinkUsername(newBiolink.username)
        setShareDialogOpen(true)
      }
    } catch (error) {
      console.error("Error creating biolink", error)
    } finally {
      setIsCreating(false)
    }
  }

  const openShareDialog = (username: string) => {
    setSelectedBiolinkUsername(username)
    setShareDialogOpen(true)
  }

  if (!mounted || isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Gestiona tus enlaces y analiza su rendimiento</p>
          </div>
          <Button disabled className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Enlace
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 rounded bg-muted" />
                <div className="mt-2 h-3 w-32 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Gestiona tus enlaces y analiza su rendimiento</p>
        </div>
        <Button onClick={handleCreateBiolink} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Enlace
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Visitas totales</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% vs. mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clics en enlaces</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">567</div>
            <p className="text-xs text-muted-foreground">+8% vs. mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de clics</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.9%</div>
            <p className="text-xs text-muted-foreground">+2.1% vs. mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Biolinks activos</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{biolinks.length}</div>
            <p className="text-xs text-muted-foreground">
              {biolinks.length === 0 ? "Crea tu primer enlace" : "Enlaces creados"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Biolinks list */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Tus Enlaces</h2>
        {biolinks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Crea tu primer enlace</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Comienza a compartir todos tus enlaces desde un solo lugar
              </p>
              <Button onClick={handleCreateBiolink} className="mt-4">
                Crear enlace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {biolinks.map((biolink) => (
              <Card key={biolink.id} className="group relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{biolink.displayName}</CardTitle>
                      <CardDescription>clipi.top/{biolink.username}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => openShareDialog(biolink.username)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                      <Link href={`/dashboard/editor/${biolink.id}`}>Editar</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/${biolink.username}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        username={selectedBiolinkUsername || ""}
      />
    </div>
  )
}
