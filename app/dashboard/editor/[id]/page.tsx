"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  Save,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Linkedin,
  Music,
  Globe,
  Check,
} from "lucide-react"
import Link from "next/link"
import { getBiolink, updateBiolink, addLink, updateLink, deleteLink, type BiolinkProfile } from "@/lib/biolink-store"
import { BiolinkPreviewEditor } from "@/components/dashboard/biolink-preview-editor"
import { PREDEFINED_BACKGROUNDS } from "@/lib/templates"
import { toast } from "sonner"
import { ShareDialog } from "@/components/dashboard/share-dialog"

const SOCIAL_PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "twitter", name: "Twitter/X", icon: Twitter },
  { id: "youtube", name: "YouTube", icon: Youtube },
  { id: "facebook", name: "Facebook", icon: Facebook },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin },
  { id: "tiktok", name: "TikTok", icon: Music },
  { id: "website", name: "Website", icon: Globe },
]

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [biolink, setBiolink] = useState<BiolinkProfile | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newLinkTitle, setNewLinkTitle] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true)
    const data = getBiolink(resolvedParams.id)
    if (data) {
      setBiolink(data)
    } else {
      router.push("/dashboard")
    }
  }, [resolvedParams.id, router])

  const handleSave = async () => {
    if (!biolink) return
    setIsSaving(true)
    const result = updateBiolink(biolink.id, biolink)
    await new Promise((r) => setTimeout(r, 500))
    setIsSaving(false)
    if (result) {
      toast.success("Biolink guardado exitosamente", {
        description: "Todos tus cambios han sido guardados correctamente."
      })
      // Abrir diálogo de compartir con link y QR
      setShareDialogOpen(true)
    } else {
      toast.error("Error al guardar", {
        description: "No se pudo guardar el biolink. Por favor, intenta de nuevo."
      })
    }
  }

  const handleAddLink = () => {
    if (!biolink || !newLinkTitle || !newLinkUrl) return
    const result = addLink(biolink.id, {
      title: newLinkTitle,
      url: newLinkUrl.startsWith("http") ? newLinkUrl : `https://${newLinkUrl}`,
      enabled: true,
    })
    if (result) {
      setBiolink(result)
      setNewLinkTitle("")
      setNewLinkUrl("")
    }
  }

  const handleDeleteLink = (linkId: string) => {
    if (!biolink) return
    const result = deleteLink(biolink.id, linkId)
    if (result) setBiolink(result)
  }

  const handleToggleLink = (linkId: string, enabled: boolean) => {
    if (!biolink) return
    const result = updateLink(biolink.id, linkId, { enabled })
    if (result) setBiolink(result)
  }

  const handleUpdateProfile = (updates: Partial<BiolinkProfile>) => {
    if (!biolink) return
    setBiolink({ ...biolink, ...updates })
  }

  const handleCustomBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedMimeTypes.includes(file.type)) {
        alert("Tipo de archivo no permitido. Por favor, sube una imagen JPEG, PNG, GIF o WebP.");
        return;
      }
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        alert("El archivo es demasiado grande. El tamaño máximo permitido es de 5MB.");
        return;
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        handleUpdateProfile({ backgroundImageUrl: reader.result as string, backgroundColor: biolink?.backgroundColor || "#ffffff", selectedPredefinedBackgroundId: undefined })
      }
      reader.onerror = () => {
        alert("Error al leer el archivo. Por favor, inténtalo de nuevo.");
      };
      reader.onabort = () => {
        alert("La lectura del archivo fue cancelada.");
      };
      reader.readAsDataURL(file)
    }
  }

  if (!mounted || !biolink) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded bg-muted" />
            <div>
              <div className="h-7 w-40 rounded bg-muted" />
              <div className="mt-1 h-4 w-24 rounded bg-muted" />
            </div>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 rounded-lg bg-muted" />
          <div className="hidden h-96 rounded-lg bg-muted lg:block" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Editar Biolink</h1>
            <p className="text-sm text-muted-foreground">/{biolink.username}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${biolink.username}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              Vista previa
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Panel */}
        <div className="space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="links">Enlaces</TabsTrigger>
              <TabsTrigger value="style">Estilo</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información del perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nombre a mostrar</Label>
                    <Input
                      id="displayName"
                      value={biolink.displayName || ""}
                      onChange={(e) => handleUpdateProfile({ displayName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={biolink.bio || ""}
                      onChange={(e) => handleUpdateProfile({ bio: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">URL del avatar</Label>
                    <Input
                      id="avatar"
                      value={biolink.avatar || ""}
                      onChange={(e) => handleUpdateProfile({ avatar: e.target.value })}
                      placeholder="https://ejemplo.com/tu-foto.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fondo Personalizado</CardTitle>
                  <CardDescription>Sube tu propia imagen de fondo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="customBackground">Imagen de fondo</Label>
                    <Input
                      id="customBackground"
                      type="file"
                      accept="image/*"
                      onChange={handleCustomBackgroundUpload}
                    />
                    {biolink.backgroundImageUrl && !PREDEFINED_BACKGROUNDS.some(bg => bg.backgroundImageUrl === biolink.backgroundImageUrl || bg.backgroundColor === biolink.backgroundColor) && (
                      <div className="relative w-full h-32 rounded-md overflow-hidden">
                        <img src={biolink.backgroundImageUrl} alt="Fondo personalizado" className="w-full h-full object-cover" />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleUpdateProfile({ backgroundImageUrl: undefined, backgroundColor: biolink.backgroundColor || "#ffffff", selectedPredefinedBackgroundId: undefined })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Redes sociales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const social = biolink.socialLinks.find((s) => s.platform === platform.id)
                    return (
                      <div key={platform.id} className="flex items-center gap-3">
                        <platform.icon className="h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder={`URL de ${platform.name}`}
                          value={social?.url || ""}
                          onChange={(e) => {
                            const newSocials = biolink.socialLinks.filter((s) => s.platform !== platform.id)
                            if (e.target.value) {
                              newSocials.push({
                                platform: platform.id,
                                url: e.target.value,
                                enabled: true,
                              })
                            }
                            handleUpdateProfile({ socialLinks: newSocials })
                          }}
                        />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="links" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agregar nuevo enlace</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkTitle">Título</Label>
                    <Input
                      id="linkTitle"
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      placeholder="Mi canal de YouTube"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkUrl">URL</Label>
                    <Input
                      id="linkUrl"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="https://youtube.com/@micanal"
                    />
                  </div>
                  <Button onClick={handleAddLink} className="w-full" disabled={!newLinkTitle || !newLinkUrl}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar enlace
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tus enlaces ({biolink.links.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {biolink.links.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No tienes enlaces aún. Agrega tu primer enlace arriba.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {biolink.links.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                        >
                          <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate font-medium">{link.title}</p>
                            <p className="truncate text-xs text-muted-foreground">{link.url}</p>
                          </div>
                          <Switch
                            checked={link.enabled}
                            onCheckedChange={(checked) => handleToggleLink(link.id, checked)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteLink(link.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="style" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personalizar apariencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Color de fondo</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={biolink.backgroundColor || "#ffffff"}
                        onChange={(e) => handleUpdateProfile({ backgroundColor: e.target.value })}
                        className="h-10 w-14 cursor-pointer rounded border border-input"
                      />
                      <Input
                        value={biolink.backgroundColor || ""}
                        onChange={(e) => handleUpdateProfile({ backgroundColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Color de botones</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={biolink.buttonColor || "#000000"}
                        onChange={(e) => handleUpdateProfile({ buttonColor: e.target.value })}
                        className="h-10 w-14 cursor-pointer rounded border border-input"
                      />
                      <Input
                        value={biolink.buttonColor || ""}
                        onChange={(e) => handleUpdateProfile({ buttonColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Color de texto</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={biolink.textColor || "#000000"}
                        onChange={(e) => handleUpdateProfile({ textColor: e.target.value })}
                        className="h-10 w-14 cursor-pointer rounded border border-input"
                      />
                      <Input
                        value={biolink.textColor || ""}
                        onChange={(e) => handleUpdateProfile({ textColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Estilo de botones</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["rounded", "pill", "square"] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => handleUpdateProfile({ buttonStyle: style })}
                          className={`rounded-lg border-2 p-3 transition-colors ${biolink.buttonStyle === style
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                            }`}
                        >
                          <div
                            className={`h-8 w-full bg-primary ${style === "pill" ? "rounded-full" : style === "square" ? "rounded-none" : "rounded-lg"
                              }`}
                          />
                          <span className="mt-2 block text-xs capitalize">{style}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fondos Predeterminados</CardTitle>
                  <CardDescription>Selecciona un fondo de nuestra colección</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {PREDEFINED_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.id}
                        className={`w-full h-16 rounded-md border-2 ${biolink.selectedPredefinedBackgroundId === bg.id
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                          } transition-all duration-200`}
                        style={{
                          backgroundColor: bg.backgroundColor,
                          backgroundImage: bg.backgroundImageUrl && !bg.backgroundImageUrl.startsWith('linear-gradient') ? `url(${bg.backgroundImageUrl})` : bg.backgroundImageUrl,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        onClick={() => handleUpdateProfile({ backgroundColor: bg.backgroundColor, backgroundImageUrl: bg.backgroundImageUrl, selectedPredefinedBackgroundId: bg.id })}
                      >
                        {biolink.selectedPredefinedBackgroundId === bg.id && (
                          <div className="flex items-center justify-center w-full h-full bg-primary/50 rounded-md">
                            <Check className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="hidden lg:block">
          <div className="sticky top-8">
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">Vista previa en tiempo real</p>
            <BiolinkPreviewEditor biolink={biolink} />
          </div>
        </div>
      </div>

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        username={biolink.username}
      />
    </div>
  )
}
