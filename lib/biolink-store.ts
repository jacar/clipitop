export interface BiolinkLink {
  id: string
  title: string
  url: string
  icon?: string
  enabled: boolean
}

export interface SocialLink {
  platform: string
  url: string
  enabled: boolean
}

export interface BiolinkProfile {
  id: string
  username: string
  displayName: string
  bio: string
  avatar: string
  theme: string
  backgroundColor: string
  buttonStyle: "rounded" | "pill" | "square"
  buttonColor: string
  textColor: string
  links: BiolinkLink[]
  socialLinks: SocialLink[]
  createdAt: string
  updatedAt: string
  selectedPredefinedBackgroundId?: string
  backgroundImageUrl?: string
}

const DEFAULT_PROFILE: Omit<BiolinkProfile, "id" | "username" | "createdAt" | "updatedAt"> = {
  displayName: "Tu Nombre",
  bio: "Agrega una descripción sobre ti",
  avatar: "",
  theme: "default",
  backgroundColor: "#ffffff",
  buttonStyle: "rounded",
  buttonColor: "#0d9488",
  textColor: "#1f2937",
  links: [],
  socialLinks: [],
  selectedPredefinedBackgroundId: undefined,
  backgroundImageUrl: undefined,
}

export function getBiolinks(): BiolinkProfile[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("biolinks")
  return data ? JSON.parse(data) : []
}

export function getBiolink(id: string): BiolinkProfile | null {
  const biolinks = getBiolinks()
  return biolinks.find((b) => b.id === id) || null
}

export function getBiolinkByUsername(username: string): BiolinkProfile | null {
  const biolinks = getBiolinks()
  return biolinks.find((b) => b.username === username) || null
}

export function createBiolink(username: string): BiolinkProfile {
  const biolinks = getBiolinks()
  const newBiolink: BiolinkProfile = {
    ...DEFAULT_PROFILE,
    id: Date.now().toString(),
    username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  biolinks.push(newBiolink)
  localStorage.setItem("biolinks", JSON.stringify(biolinks))
  return newBiolink
}

export function updateBiolink(id: string, updates: Partial<BiolinkProfile>): BiolinkProfile | null {
  const biolinks = getBiolinks()
  const index = biolinks.findIndex((b) => b.id === id)
  if (index === -1) return null

  biolinks[index] = {
    ...biolinks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem("biolinks", JSON.stringify(biolinks))
  return biolinks[index]
}

export function deleteBiolink(id: string): boolean {
  const biolinks = getBiolinks()
  const filtered = biolinks.filter((b) => b.id !== id)
  if (filtered.length === biolinks.length) return false
  localStorage.setItem("biolinks", JSON.stringify(filtered))
  return true
}

export function addLink(biolinkId: string, link: Omit<BiolinkLink, "id">): BiolinkProfile | null {
  const biolink = getBiolink(biolinkId)
  if (!biolink) return null

  const newLink: BiolinkLink = {
    ...link,
    id: Date.now().toString(),
  }

  return updateBiolink(biolinkId, {
    links: [...biolink.links, newLink],
  })
}

export function updateLink(biolinkId: string, linkId: string, updates: Partial<BiolinkLink>): BiolinkProfile | null {
  const biolink = getBiolink(biolinkId)
  if (!biolink) return null

  const links = biolink.links.map((l) => (l.id === linkId ? { ...l, ...updates } : l))

  return updateBiolink(biolinkId, { links })
}

export function deleteLink(biolinkId: string, linkId: string): BiolinkProfile | null {
  const biolink = getBiolink(biolinkId)
  if (!biolink) return null

  const links = biolink.links.filter((l) => l.id !== linkId)
  return updateBiolink(biolinkId, { links })
}

export function reorderLinks(biolinkId: string, links: BiolinkLink[]): BiolinkProfile | null {
  return updateBiolink(biolinkId, { links })
}
