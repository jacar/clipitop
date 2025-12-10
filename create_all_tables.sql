-- Script para crear TODAS las tablas faltantes
-- Ejecuta esto en Supabase SQL Editor para arreglar los errores 400 (Bad Request)

-- 1. Tabla de Enlaces (Links)
CREATE TABLE IF NOT EXISTS biolink_links (
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

ALTER TABLE biolink_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Links viewable by everyone" ON biolink_links FOR SELECT USING (true);
CREATE POLICY "Users can manage own links" ON biolink_links FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM biolink_profiles WHERE id = profile_id)
);

-- 2. Tabla de Redes Sociales
CREATE TABLE IF NOT EXISTS biolink_social_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES biolink_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE biolink_social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Social links viewable by everyone" ON biolink_social_links FOR SELECT USING (true);
CREATE POLICY "Users can manage own social links" ON biolink_social_links FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM biolink_profiles WHERE id = profile_id)
);

-- 3. Tabla de Galería
CREATE TABLE IF NOT EXISTS biolink_gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES biolink_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  description TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE biolink_gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery viewable by everyone" ON biolink_gallery_images FOR SELECT USING (true);
CREATE POLICY "Users can manage own gallery" ON biolink_gallery_images FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM biolink_profiles WHERE id = profile_id)
);

-- 4. Tablas de Analytics
CREATE TABLE IF NOT EXISTS biolink_profile_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES biolink_profiles(id) ON DELETE CASCADE,
  referrer TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE biolink_profile_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert views" ON biolink_profile_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own analytics" ON biolink_profile_views FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM biolink_profiles WHERE id = profile_id)
);

CREATE TABLE IF NOT EXISTS biolink_link_clicks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  link_id UUID REFERENCES biolink_links(id) ON DELETE CASCADE,
  referrer TEXT,
  user_agent TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE biolink_link_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert clicks" ON biolink_link_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own clicks" ON biolink_link_clicks FOR SELECT USING (
  link_id IN (SELECT id FROM biolink_links WHERE profile_id IN (SELECT id FROM biolink_profiles WHERE user_id = auth.uid()))
);

-- 5. Funciones RPC para contadores atómicos (opcional pero recomendado)
CREATE OR REPLACE FUNCTION increment_profile_views(profile_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE biolink_profiles
  SET views_count = views_count + 1
  WHERE id = profile_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_link_clicks(link_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE biolink_links
  SET clicks_count = clicks_count + 1
  WHERE id = link_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_social_clicks(social_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE biolink_social_links
  SET clicks_count = clicks_count + 1
  WHERE id = social_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

NOTIFY pgrst, 'reload config';
