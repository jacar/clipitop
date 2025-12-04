import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Clipi.top - Crea tu Enlace Profesional",
    template: "%s | Clipi.top",
  },
  description:
    "La plataforma todo-en-uno para crear enlaces personalizados y landing pages impresionantes. Conecta a tu audiencia con todo lo que ofreces desde un solo enlace.",
  keywords: ["clipi.top", "link in bio", "landing page", "linktree alternativa", "redes sociales", "creadores"],
  authors: [{ name: "Clipi.top" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Clipi.top",
    title: "Clipi.top - Crea tu Enlace Profesional",
    description: "La plataforma todo-en-uno para crear enlaces personalizados y landing pages impresionantes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clipi.top - Crea tu Enlace Profesional",
    description: "La plataforma todo-en-uno para crear enlaces personalizados y landing pages impresionantes.",
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a14" },
  ],
  width: "device-width",
  initialScale: 1,
}

import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
