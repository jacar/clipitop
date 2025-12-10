"use client"

import { useState, useEffect } from "react"
import { Instagram, Twitter, Youtube, Music, Check } from "lucide-react"
import { TEMPLATES, PREDEFINED_BACKGROUNDS } from "@/lib/templates"
// Import de usuarios locales eliminado

// Utility function to generate a random hex color
const getRandomHexColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Utility function to get contrast text color (black or white)
const getContrastTextColor = (hexColor: string) => {
  const r = parseInt(hexColor.substring(1, 3), 16)
  const g = parseInt(hexColor.substring(3, 5), 16)
  const b = parseInt(hexColor.substring(5, 7), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "#000000" : "#FFFFFF"
}

const FEATURED_TEMPLATES_INDICES = [0, 3, 6, 9, 12]



export function BiolinkPreview() {
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  // Memoize featuredTemplates to prevent re-renders loop
  const featuredTemplates = TEMPLATES.filter((_, i) => FEATURED_TEMPLATES_INDICES.includes(i))

  const [randomDesign, setRandomDesign] = useState<{
    backgroundColor?: string // Make backgroundColor optional
    backgroundImageUrl?: string // Add backgroundImageUrl
    buttonColor: string
    textColor: string
    avatarUrl: string
    displayName: string // Add displayName
  } | null>(null)

  const [selectedPredefinedBackgroundId, setSelectedPredefinedBackgroundId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    // Only run initial generation once when mounted
    // We don't want to re-run this effect when featuredTemplates changes because it's now stable
    // But we do want to run it when activeIndex changes by user interaction or interval
    generateRandomDesign(featuredTemplates, activeIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredTemplates.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [featuredTemplates.length, mounted])

  const generateRandomDesign = async (templates: typeof TEMPLATES, index: number) => {
    const template = templates[index]

    const newButtonColor = getRandomHexColor()
    const newTextColor = getContrastTextColor(newButtonColor)

    const placeholderUser = { avatarUrl: "/placeholder.svg", displayName: "Ejemplo" };
    let newAvatarUrl = placeholderUser.avatarUrl;
    let newDisplayName = placeholderUser.displayName || template.profile.displayName

    // Use a local SVG background from PREDEFINED_BACKGROUNDS as a reliable fallback
    // This avoids external API dependencies like Picsum which can fail (ERR_ABORTED)
    const localBackgrounds = PREDEFINED_BACKGROUNDS.filter(bg => bg.backgroundImageUrl && bg.backgroundImageUrl.startsWith('/'))
    const randomBg = localBackgrounds[Math.floor(Math.random() * localBackgrounds.length)]
    const newBackgroundImageUrl = randomBg.backgroundImageUrl

    setRandomDesign({
      backgroundImageUrl: newBackgroundImageUrl,
      buttonColor: newButtonColor,
      textColor: newTextColor,
      avatarUrl: newAvatarUrl,
      displayName: newDisplayName,
    })
  }

  if (!mounted) {
    return (
      <div className="relative">
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 blur-2xl" />
        <div className="relative w-[320px] overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full border-4 border-primary bg-muted" />
              <div className="mt-4 h-5 w-32 rounded bg-muted" />
              <div className="mt-2 h-4 w-48 rounded bg-muted" />
              <div className="mt-4 flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 w-9 rounded-full bg-muted" />
                ))}
              </div>
              <div className="mt-6 flex w-full flex-col gap-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-full rounded-xl bg-muted" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-1.5 pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const template = featuredTemplates[activeIndex]
  const currentDesign = randomDesign || {
    backgroundColor: template.profile.backgroundColor,
    buttonColor: template.profile.buttonColor,
    textColor: template.profile.textColor,
    avatarUrl: template.profile.avatar || `/placeholder.svg?height=80&width=80&query=${template.thumbnail}`,
    displayName: template.profile.displayName,
  }

  const selectedBackground = selectedPredefinedBackgroundId
    ? PREDEFINED_BACKGROUNDS.find((bg) => bg.id === selectedPredefinedBackgroundId)
    : null

  const backgroundStyle = selectedBackground
    ? selectedBackground.backgroundImageUrl
      ? { backgroundImage: selectedBackground.backgroundImageUrl.startsWith('linear-gradient') ? selectedBackground.backgroundImageUrl : `url(${selectedBackground.backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { backgroundColor: selectedBackground.backgroundColor }
    : currentDesign.backgroundImageUrl
      ? { backgroundImage: `url(${currentDesign.backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { backgroundColor: currentDesign.backgroundColor }

  const buttonRadius =
    template.profile.buttonStyle === "pill" ? "9999px" : template.profile.buttonStyle === "square" ? "0" : "12px"

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 blur-2xl" />

      <div
        className="relative w-[320px] overflow-hidden rounded-3xl border border-border shadow-2xl transition-colors duration-500"
        style={backgroundStyle}
      >
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div
              className="h-20 w-20 rounded-full border-4 bg-muted transition-all duration-500"
              style={{
                borderColor: currentDesign.buttonColor,
                backgroundImage: `url(${currentDesign.avatarUrl})`,
                backgroundSize: "cover",
              }}
            />

            <h3
              className="mt-4 text-lg font-bold transition-colors duration-500"
              style={{ color: currentDesign.textColor }}
            >
              {currentDesign.displayName}
            </h3>
            <p
              className="text-sm opacity-80 transition-colors duration-500"
              style={{ color: currentDesign.textColor }}
            >
              {template.profile.bio}
            </p>

            <div className="mt-4 flex gap-2">
              {template.profile.socialLinks.slice(0, 4).map((social) => (
                <div
                  key={social.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-500"
                  style={{ backgroundColor: `${currentDesign.buttonColor}20` }}
                >
                  {social.platform === "instagram" && (
                    <Instagram className="h-4 w-4" style={{ color: currentDesign.buttonColor }} />
                  )}
                  {social.platform === "twitter" && (
                    <Twitter className="h-4 w-4" style={{ color: currentDesign.buttonColor }} />
                  )}
                  {social.platform === "youtube" && (
                    <Youtube className="h-4 w-4" style={{ color: currentDesign.buttonColor }} />
                  )}
                  {social.platform === "tiktok" && (
                    <Music className="h-4 w-4" style={{ color: currentDesign.buttonColor }} />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex w-full flex-col gap-2.5">
              {template.profile.links.slice(0, 3).map((link) => (
                <button
                  key={link.id}
                  className="flex w-full items-center justify-center gap-2 py-2.5 text-sm font-medium text-white transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    backgroundColor: currentDesign.buttonColor,
                    borderRadius: buttonRadius,
                    color: getContrastTextColor(currentDesign.buttonColor), // Ensure button text is readable
                  }}
                >
                  {link.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template indicator dots */}
        <div className="flex justify-center gap-1.5 pb-4">
          {featuredTemplates.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i)
                setRandomDesign(null) // Reset random design when switching templates
              }}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 16 : 6,
                backgroundColor: i === activeIndex ? currentDesign.buttonColor : `${currentDesign.textColor}30`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Template name badge */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-medium text-white shadow-lg transition-colors duration-500"
        style={{ backgroundColor: currentDesign.buttonColor, color: getContrastTextColor(currentDesign.buttonColor) }}
      >
        {randomDesign ? "Diseño Aleatorio" : template.name}
      </div>

      {/* Button to generate random design */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
        <button
          onClick={() => generateRandomDesign(featuredTemplates, activeIndex)}
          className="rounded-full px-4 py-2 text-sm font-medium shadow-lg hover:scale-[1.02] transition-all duration-500"
          style={{ backgroundColor: currentDesign.buttonColor, color: getContrastTextColor(currentDesign.buttonColor) }}
        >
          Diseño Aleatorio
        </button>
      </div>

      {/* Predefined Backgrounds Section */}
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-full max-w-[320px] p-4 bg-background rounded-lg shadow-lg">
        <h4 className="text-sm font-semibold mb-2">Fondos Predeterminados</h4>
        <div className="grid grid-cols-3 gap-2">
          {PREDEFINED_BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              className="w-full h-16 rounded-md border-2 border-transparent hover:border-primary focus:outline-none focus:border-primary transition-all duration-200"
              style={{
                backgroundColor: bg.backgroundColor,
                backgroundImage: bg.backgroundImageUrl && !bg.backgroundImageUrl.startsWith('linear-gradient') ? `url(${bg.backgroundImageUrl})` : bg.backgroundImageUrl,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => setSelectedPredefinedBackgroundId(bg.id)}
            >
              {bg.id === selectedPredefinedBackgroundId && (
                <div className="flex items-center justify-center w-full h-full bg-primary/50 rounded-md">
                  <Check className="h-6 w-6 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}