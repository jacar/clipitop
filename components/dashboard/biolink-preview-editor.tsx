import type React from "react"
import { Instagram, Twitter, Youtube, Facebook, Linkedin, Music, Globe } from "lucide-react"
import type { BiolinkProfile } from "@/lib/types"

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: Music,
  website: Globe,
}

export function BiolinkPreviewEditor({ biolink }: { biolink: BiolinkProfile }) {
  const buttonRadius = biolink.buttonStyle === "pill" ? "9999px" : biolink.buttonStyle === "square" ? "0px" : "12px"

  return (
    <div className="mx-auto w-full max-w-[375px]">
      <div className="overflow-hidden rounded-[40px] border-8 border-foreground/10 bg-foreground/5 shadow-xl">
        <div
          className="min-h-[600px] p-6"
          style={{
            backgroundColor: biolink.backgroundColor,
            backgroundImage: biolink.backgroundImageUrl ? `url(${biolink.backgroundImageUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div
              className="h-24 w-24 rounded-full border-4 bg-muted"
              style={{
                borderColor: biolink.buttonColor,
                backgroundImage: biolink.avatar
                  ? `url(${biolink.avatar})`
                  : `url(/placeholder.svg?height=96&width=96&query=profile avatar)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Name & Bio */}
            <h3 className="mt-4 text-xl font-bold" style={{ color: biolink.textColor }}>
              {biolink.displayName || "Tu Nombre"}
            </h3>
            <p className="mt-1 text-center text-sm" style={{ color: biolink.textColor, opacity: 0.8 }}>
              {biolink.bio || "Tu biografía aquí"}
            </p>

            {/* Social Icons */}
            {biolink.socialLinks.length > 0 && (
              <div className="mt-4 flex gap-3">
                {biolink.socialLinks
                  .filter((s) => s.enabled && s.url)
                  .map((social) => {
                    const Icon = SOCIAL_ICONS[social.platform] || Globe
                    return (
                      <div
                        key={social.platform}
                        className="flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110"
                        style={{ backgroundColor: `${biolink.buttonColor}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: biolink.buttonColor }} />
                      </div>
                    )
                  })}
              </div>
            )}

            {/* Links */}
            <div className="mt-6 flex w-full flex-col gap-3">
              {biolink.links
                .filter((link) => link.enabled)
                .map((link) => (
                  <button
                    key={link.id}
                    className="w-full py-3 text-center text-sm font-medium transition-transform hover:scale-[1.02]"
                    style={{
                      backgroundColor: biolink.buttonColor,
                      color: "#ffffff",
                      borderRadius: buttonRadius,
                    }}
                  >
                    {link.title}
                  </button>
                ))}

              {biolink.links.length === 0 && (
                <div className="py-8 text-center text-sm" style={{ color: biolink.textColor, opacity: 0.5 }}>
                  Agrega tus primeros enlaces
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
