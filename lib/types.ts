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
