-- Script de "Borrón y Cuenta Nueva" para tablas auxiliares
-- Arregla el error "column profile_id does not exist" forzando la creación correcta.

-- 1. Habilitar extensión para UUIDs (por si acaso)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Borrar tablas antiguas o mal formadas (CUIDADO: Borra datos de estas tablas, pero no el perfil)
DROP TABLE IF EXISTS biolink_links CASCADE;
DROP TABLE IF EXISTS biolink_social_links CASCADE;
DROP TABLE IF EXISTS biolink_gallery_images CASCADE;
DROP TABLE IF EXISTS biolink_profile_views CASCADE;
DROP TABLE IF EXISTS biolink_link_clicks CASCADE;

-- 3. Crear tablas de nuevo (Limpias)

-- LINKS
CREATE TABLE biolink_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES biolink_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  button_color TEXT,
  text_color TEXT,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SOCIALS
CREATE TABLE biolink_social_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES biolink_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GALLERY
CREATE TABLE biolink_gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES biolink_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  description TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ANALYTICS
CREATE TABLE biolink_profile_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES biolink_profiles(id) ON DELETE CASCADE,
  referrer TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE biolink_link_clicks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  link_id UUID REFERENCES biolink_links(id) ON DELETE CASCADE,
  referrer TEXT,
  user_agent TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Activar seguridad (RLS)
ALTER TABLE biolink_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE biolink_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE biolink_gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE biolink_profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE biolink_link_clicks ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas
-- Links
CREATE POLICY "Links public" ON biolink_links FOR SELECT USING (true);
CREATE POLICY "Links manage" ON biolink_links FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM biolink_profiles WHERE id = biolink_links.profile_id)
);

-- Socials
CREATE POLICY "Social public" ON biolink_social_links FOR SELECT USING (true);
CREATE POLICY "Social manage" ON biolink_social_links FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM biolink_profiles WHERE id = biolink_social_links.profile_id)
);

-- Gallery
CREATE POLICY "Gallery public" ON biolink_gallery_images FOR SELECT USING (true);
CREATE POLICY "Gallery manage" ON biolink_gallery_images FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM biolink_profiles WHERE id = biolink_gallery_images.profile_id)
);

-- Analytics
CREATE POLICY "Views insert" ON biolink_profile_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Views select" ON biolink_profile_views FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM biolink_profiles WHERE id = biolink_profile_views.profile_id)
);

CREATE POLICY "Clicks insert" ON biolink_link_clicks FOR INSERT WITH CHECK (true);
-- Nota: selección de clicks es compleja en RLS anidado, simplificamos para dueño
CREATE POLICY "Clicks select" ON biolink_link_clicks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM biolink_links 
    JOIN biolink_profiles ON biolink_links.profile_id = biolink_profiles.id 
    WHERE biolink_links.id = biolink_link_clicks.link_id 
    AND biolink_profiles.user_id = auth.uid()
  )
);

NOTIFY pgrst, 'reload config';
