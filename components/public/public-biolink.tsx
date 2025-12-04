"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Linkedin,
  Music,
  Globe,
  ExternalLink,
  Share2,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  QrCode,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BiolinkQRCode } from "@/components/biolink-qr-code"
import { getBiolinkByUsername, type BiolinkProfile } from "@/lib/biolink-store"
import { TEMPLATES } from "@/lib/templates"

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: Music,
  website: Globe,
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  location: MapPin,
}

export function PublicBiolink({ username }: { username: string }) {
  const [mounted, setMounted] = useState(false)
  const [biolink, setBiolink] = useState<BiolinkProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    setMounted(true)
    const data = getBiolinkByUsername(username)
    if (data) {
      setBiolink(data)
    } else {
      // Check if it's a demo template
      const template = TEMPLATES.find((t) => t.id === username)
      if (template) {
        setShowDemo(true)
        setBiolink({
          id: template.id,
          username: template.id,
          ...template.profile,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as BiolinkProfile)
      }
    }
    setLoading(false)
  }, [username])

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (!biolink) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <span className="text-4xl font-bold text-muted-foreground">?</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground">Perfil no encontrado</h1>
          <p className="mt-2 text-muted-foreground">El usuario @{username} no existe o no tiene un enlace activo.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Crear mi propio enlace
          </Link>
        </div>
      </div>
    )
  }

  const buttonRadius = biolink.buttonStyle === "pill" ? "9999px" : biolink.buttonStyle === "square" ? "0px" : "12px"

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: biolink.displayName,
        text: biolink.bio,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles")
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: biolink.backgroundColor }}>
      {/* Demo Banner */}
      {showDemo && (
        <div className="bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
          Esta es una vista de demostración.{" "}
          <Link href={`/register?template=${username}`} className="underline hover:no-underline">
            Crear mi enlace con esta plantilla
          </Link>
        </div>
      )}

      <div className="mx-auto max-w-md px-4 py-12">
        {/* Share Button */}
        <div className="mb-6 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: `${biolink.buttonColor}20` }}
              >
                <QrCode className="h-5 w-5" style={{ color: biolink.buttonColor }} />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Compartir perfil</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center gap-4 py-4">
                <BiolinkQRCode url={typeof window !== 'undefined' ? window.location.href : ''} />
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Share2 className="h-4 w-4" />
                  Compartir enlace
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center">
          <div
            className="h-24 w-24 overflow-hidden rounded-full border-4 bg-muted"
            style={{ borderColor: biolink.buttonColor }}
          >
            {biolink.avatar ? (
              <Image
                src={biolink.avatar || "/placeholder.svg"}
                alt={biolink.displayName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-3xl font-bold"
                style={{
                  backgroundColor: biolink.buttonColor,
                  color: "#fff",
                }}
              >
                {biolink.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h1 className="mt-4 text-xl font-bold" style={{ color: biolink.textColor }}>
            {biolink.displayName}
          </h1>

          <p className="mt-2 max-w-xs text-center text-sm" style={{ color: biolink.textColor, opacity: 0.8 }}>
            {biolink.bio}
          </p>

          {/* Social Links */}
          {biolink.socialLinks.filter((s) => s.enabled).length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {biolink.socialLinks
                .filter((s) => s.enabled)
                .map((social) => {
                  const Icon = SOCIAL_ICONS[social.platform] || Globe
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110"
                      style={{ backgroundColor: `${biolink.buttonColor}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: biolink.buttonColor }} />
                    </a>
                  )
                })}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="mt-8 flex flex-col gap-3">
          {biolink.links
            .filter((link) => link.enabled)
            .map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center gap-2 px-6 py-3.5 text-center font-medium text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{
                  backgroundColor: biolink.buttonColor,
                  borderRadius: buttonRadius,
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span>{link.title}</span>
                <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium opacity-50 transition-opacity hover:opacity-100"
            style={{ color: biolink.textColor }}
          >
            <div
              className="flex h-4 w-4 items-center justify-center rounded"
              style={{ backgroundColor: biolink.buttonColor }}
            >
              <Image src="/logoclic.svg" alt="clipi.top logo" width={16} height={16} />
            </div>
            Creado con clipi.top
          </Link>
        </div>
      </div>
    </div>
  )
}
