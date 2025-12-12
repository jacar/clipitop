import { supabase } from './supabase'
import { BiolinkProfile, BiolinkLink, SocialLink } from './types'

export interface BiolinkProfileDB {
    id: string
    user_id: string
    username: string
    display_name: string
    bio: string
    avatar: string
    theme: string
    background_color: string
    button_style: "rounded" | "pill" | "square"
    button_color: string
    text_color: string
    selected_predefined_background_id?: string
    background_image_url?: string
    created_at: string
    updated_at: string
}

export const BiolinkService = {
    async getBiolinks(userId: string): Promise<BiolinkProfile[]> {
        const { data: profiles, error } = await supabase
            .from('biolink_profiles')
            .select(`
        *,
        links:biolink_links(*),
        socialLinks:biolink_social_links(*)
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching biolinks:', error)
            return []
        }

        return profiles.map(mapProfileFromDB)
    },

    async getBiolinkByUsername(username: string): Promise<BiolinkProfile | null> {
        const { data: profile, error } = await supabase
            .from('biolink_profiles')
            .select(`
        *,
        links:biolink_links(*),
        socialLinks:biolink_social_links(*)
      `)
            .eq('username', username)
            .single()

        if (error) {
            console.error('Error fetching biolink by username:', error)
            return null
        }

        return mapProfileFromDB(profile)
    },

    async getBiolinkById(id: string): Promise<BiolinkProfile | null> {
        const { data: profile, error } = await supabase
            .from('biolink_profiles')
            .select(`
        *,
        links:biolink_links(*),
        socialLinks:biolink_social_links(*)
      `)
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching biolink by id:', error)
            return null
        }

        return mapProfileFromDB(profile)
    },

    async createBiolink(userId: string, username: string): Promise<BiolinkProfile | null> {
        const newProfile = {
            user_id: userId,
            username,
            display_name: "Tu Nombre",
            bio: "Agrega una descripción sobre ti",
            avatar: "",
            theme: "default",
            background_color: "#ffffff",
            button_style: "rounded",
            button_color: "#0d9488",
            text_color: "#1f2937",
        }

        const { data, error } = await supabase
            .from('biolink_profiles')
            .insert(newProfile)
            .select()
            .single()

        if (error) {
            console.error('Error creating biolink:', error)
            return null
        }

        return mapProfileFromDB({ ...data, links: [], socialLinks: [] })
    },

    async updateBiolink(id: string, updates: Partial<BiolinkProfile>): Promise<BiolinkProfile | null> {
        // Separate profile updates from relation updates (links, socialLinks)
        // For now, we only handle profile fields here. Links are handled separately or need more complex logic.
        const { links, socialLinks, ...profileUpdates } = updates

        // Map camelCase to snake_case for DB
        const dbUpdates: any = {}
        if (profileUpdates.displayName !== undefined) dbUpdates.display_name = profileUpdates.displayName
        if (profileUpdates.backgroundColor !== undefined) dbUpdates.background_color = profileUpdates.backgroundColor
        if (profileUpdates.buttonStyle !== undefined) dbUpdates.button_style = profileUpdates.buttonStyle
        if (profileUpdates.buttonColor !== undefined) dbUpdates.button_color = profileUpdates.buttonColor
        if (profileUpdates.textColor !== undefined) dbUpdates.text_color = profileUpdates.textColor
        if (profileUpdates.selectedPredefinedBackgroundId !== undefined) dbUpdates.selected_predefined_background_id = profileUpdates.selectedPredefinedBackgroundId
        if (profileUpdates.backgroundImageUrl !== undefined) dbUpdates.background_image_url = profileUpdates.backgroundImageUrl
        if (profileUpdates.bio !== undefined) dbUpdates.bio = profileUpdates.bio
        if (profileUpdates.avatar !== undefined) dbUpdates.avatar = profileUpdates.avatar
        if (profileUpdates.theme !== undefined) dbUpdates.theme = profileUpdates.theme

        dbUpdates.updated_at = new Date().toISOString()

        const { data, error } = await supabase
            .from('biolink_profiles')
            .update(dbUpdates)
            .eq('id', id)
            .select(`
        *,
        links:biolink_links(*),
        socialLinks:biolink_social_links(*)
      `)
            .single()

        if (error) {
            console.error('Error updating biolink:', error)
            return null
        }

        return mapProfileFromDB(data)
    },

    async deleteBiolink(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('biolink_profiles')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting biolink:', error)
            return false
        }
        return true
    },

    async addLink(biolinkId: string, link: Omit<BiolinkLink, "id">): Promise<BiolinkProfile | null> {
        const newLink = {
            profile_id: biolinkId,
            title: link.title,
            url: link.url,
            icon: link.icon,
            icon_key: link.icon_key,
            icon_color: link.icon_color,
            button_color: link.button_color,
            text_color: link.text_color,
            enabled: link.enabled,
            order: 0
        }

        const { error } = await supabase
            .from('biolink_links')
            .insert(newLink)

        if (error) {
            console.error('Error adding link:', error)
            return null
        }

        return this.getBiolinkById(biolinkId)
    },

    async updateLink(biolinkId: string, linkId: string, updates: Partial<BiolinkLink>): Promise<BiolinkProfile | null> {
        const dbUpdates: any = {}
        if (updates.title !== undefined) dbUpdates.title = updates.title
        if (updates.url !== undefined) dbUpdates.url = updates.url
        if (updates.icon !== undefined) dbUpdates.icon = updates.icon
        if (updates.icon_key !== undefined) dbUpdates.icon_key = updates.icon_key
        if (updates.icon_color !== undefined) dbUpdates.icon_color = updates.icon_color
        if (updates.button_color !== undefined) dbUpdates.button_color = updates.button_color
        if (updates.text_color !== undefined) dbUpdates.text_color = updates.text_color
        if (updates.enabled !== undefined) dbUpdates.enabled = updates.enabled

        const { error } = await supabase
            .from('biolink_links')
            .update(dbUpdates)
            .eq('id', linkId)
            .eq('profile_id', biolinkId)

        if (error) {
            console.error('Error updating link:', error)
            return null
        }

        return this.getBiolinkById(biolinkId)
    },

    async deleteLink(biolinkId: string, linkId: string): Promise<BiolinkProfile | null> {
        const { error } = await supabase
            .from('biolink_links')
            .delete()
            .eq('id', linkId)
            .eq('profile_id', biolinkId)

        if (error) {
            console.error('Error deleting link:', error)
            return null
        }

        return this.getBiolinkById(biolinkId)
    }
}

function mapProfileFromDB(dbProfile: any): BiolinkProfile {
    return {
        id: dbProfile.id,
        username: dbProfile.username,
        displayName: dbProfile.display_name,
        bio: dbProfile.bio,
        avatar: dbProfile.avatar,
        theme: dbProfile.theme,
        backgroundColor: dbProfile.background_color,
        buttonStyle: dbProfile.button_style,
        buttonColor: dbProfile.button_color,
        textColor: dbProfile.text_color,
        selectedPredefinedBackgroundId: dbProfile.selected_predefined_background_id,
        backgroundImageUrl: dbProfile.background_image_url,
        createdAt: dbProfile.created_at,
        updatedAt: dbProfile.updated_at,
        links: dbProfile.links?.map((l: any) => ({
            id: l.id,
            title: l.title,
            url: l.url,
            icon: l.icon,
            icon_key: l.icon_key,
            icon_color: l.icon_color,
            button_color: l.button_color,
            text_color: l.text_color,
            enabled: l.enabled
        })) || [],
        socialLinks: dbProfile.socialLinks?.map((l: any) => ({
            platform: l.platform,
            url: l.url,
            enabled: l.enabled
        })) || []
    }
}
