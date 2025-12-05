"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user: authUser } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState({ name: "", email: "", username: "" })
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    analytics: true,
  })

  useEffect(() => {
    setMounted(true)
    if (authUser) {
      setUser({
        name: authUser.user_metadata?.full_name || "",
        email: authUser.email || "",
        username: authUser.user_metadata?.username || "",
      })
    }
  }, [authUser])

  const handleSave = async () => {
    if (!authUser) return

    try {
      const { error } = await supabase.auth.updateUser({
        email: user.email,
        data: {
          full_name: user.name,
          username: user.username,
        }
      })

      if (error) throw error

      toast.success("Perfil actualizado", {
        description: "Tus cambios han sido guardados correctamente."
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Error al actualizar", {
        description: "No se pudieron guardar los cambios."
      })
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="mt-1 text-muted-foreground">Administra tu cuenta y preferencias</p>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="h-4 w-36 rounded bg-muted" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-10 w-full rounded bg-muted" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="mt-1 text-muted-foreground">Administra tu cuenta y preferencias</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la cuenta</CardTitle>
          <CardDescription>Actualiza tus datos personales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                linkflow.me/
              </span>
              <Input
                id="username"
                className="rounded-l-none"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar cambios
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificaciones por email</p>
              <p className="text-sm text-muted-foreground">Recibe actualizaciones importantes sobre tu cuenta</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reportes de analíticas</p>
              <p className="text-sm text-muted-foreground">Resumen semanal de rendimiento de tus biolinks</p>
            </div>
            <Switch
              checked={notifications.analytics}
              onCheckedChange={(checked) => setNotifications({ ...notifications, analytics: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Emails de marketing</p>
              <p className="text-sm text-muted-foreground">Novedades, tips y ofertas especiales</p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de peligro</CardTitle>
          <CardDescription>Acciones irreversibles para tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Eliminar mi cuenta</Button>
        </CardContent>
      </Card>
    </div>
  )
}
