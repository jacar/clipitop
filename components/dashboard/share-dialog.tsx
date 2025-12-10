"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Share2, Download } from "lucide-react"
import { BiolinkQRCode } from "@/components/biolink-qr-code"
import { toast } from "sonner"

interface ShareDialogProps {
    username: string
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function ShareDialog({ username, trigger, open, onOpenChange }: ShareDialogProps) {
    const [copied, setCopied] = useState(false)
    const url = typeof window !== 'undefined' ? `${window.location.origin}/${username}` : `https://clipi.top/${username}`

    const handleCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        toast.success("Enlace copiado al portapapeles")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownloadQR = () => {
        // Logic to download QR would go here, but for now we'll just show a toast
        // Since the QR is an SVG, downloading it requires a bit more logic (canvas conversion)
        // For MVP, we'll skip complex download logic or just let users screenshot
        toast.info("Para descargar, haz clic derecho en el QR y selecciona 'Guardar imagen'")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Compartir Biolink</DialogTitle>
                    <DialogDescription>
                        Comparte tu perfil con el mundo mediante enlace o código QR.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    {/* Link Section */}
                    <div className="space-y-2">
                        <Label>Enlace del perfil</Label>
                        <div className="flex items-center gap-2">
                            <Input value={url} readOnly className="font-mono text-sm" />
                            <Button size="icon" variant="outline" onClick={handleCopy}>
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* QR Section */}
                    <div className="flex flex-col items-center gap-4 rounded-lg border p-4 bg-muted/30">
                        <Label className="text-center">Código QR</Label>
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <BiolinkQRCode url={url} size={180} />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Escanea este código para visitar tu perfil instantáneamente.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange?.(false)}>Cerrar</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
