import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Tipos de base de datos
export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string;
  profile_image: string;
  theme: string;
  views_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  position: number;
  clicks_count?: number;
  is_active?: boolean;
  created_at: string;
}

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: string;
  username: string;
  clicks_count?: number;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  profile_id: string;
  image_url: string;
  position: number;
  description?: string;
  created_at: string;
}

// Nombres de tablas
export const TABLES = {
  PROFILES: 'biolink_profiles',
  LINKS: 'biolink_links',
  SOCIAL_LINKS: 'biolink_social_links',
  GALLERY_IMAGES: 'biolink_gallery_images',
  PROFILE_VIEWS: 'biolink_profile_views',
  LINK_CLICKS: 'biolink_link_clicks',
};