import type React from "react"
import { Instagram, Twitter, Youtube, Facebook, Linkedin, Music, Globe } from "lucide-react"
import type { Template } from "@/lib/templates"

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: Music,
  website: Globe,
}

export function TemplatePreview({ template }: { template: Template }) {
  const { profile } = template
  const buttonRadius = profile.buttonStyle === "pill" ? "9999px" : profile.buttonStyle === "square" ? "0px" : "12px"

  return (
    <div className="mx-auto w-full max-w-[320px]">
      <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
        <div className="p-6" style={{ backgroundColor: profile.backgroundColor }}>
          <div className="flex flex-col items-center">
            <div
              className="h-20 w-20 rounded-full border-4 bg-muted"
              style={{
                borderColor: profile.buttonColor,
                backgroundImage: `url(/placeholder.svg?height=80&width=80&query=${template.thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <h3 className="mt-3 text-lg font-bold" style={{ color: profile.textColor }}>
              {profile.displayName}
            </h3>
            <p className="mt-1 text-center text-sm" style={{ color: profile.textColor, opacity: 0.8 }}>
              {profile.bio}
            </p>

            {profile.socialLinks.length > 0 && (
              <div className="mt-3 flex gap-2">
                {profile.socialLinks
                  .filter((s) => s.enabled)
                  .map((social) => {
                    const Icon = SOCIAL_ICONS[social.platform] || Globe
                    return (
                      <div
                        key={social.platform}
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${profile.buttonColor}20` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: profile.buttonColor }} />
                      </div>
                    )
                  })}
              </div>
            )}

            <div className="mt-4 flex w-full flex-col gap-2">
              {profile.links
                .filter((link) => link.enabled)
                .map((link) => (
                  <div
                    key={link.id}
                    className="w-full py-2.5 text-center text-sm font-medium text-white"
                    style={{
                      backgroundColor: profile.buttonColor,
                      borderRadius: buttonRadius,
                    }}
                  >
                    {link.title}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
