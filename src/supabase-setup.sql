-- ==========================================
-- 🚀 CLIPLI.TOP - CONFIGURACIÓN COMPLETA (V2)
-- ==========================================
-- Este script configura:
-- 1. Tablas de Base de Datos
-- 2. Funciones RPC y Triggers
-- 3. STORAGE BUCKET y Políticas (¡NUEVO!)
-- ==========================================

-- ==========================================
-- 1️⃣ EXTENSIONES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2️⃣ TABLA: biolink_profiles
-- ==========================================
CREATE TABLE IF NOT EXISTS public.biolink_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  profile_image TEXT,
  theme TEXT DEFAULT 'default',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.biolink_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.biolink_profiles(username);

ALTER TABLE public.biolink_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los perfiles son visibles públicamente" ON public.biolink_profiles;
DROP POLICY IF EXISTS "Los usuarios pueden crear su propio perfil" ON public.biolink_profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.biolink_profiles;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar su propio perfil" ON public.biolink_profiles;

CREATE POLICY "Los perfiles son visibles públicamente" ON public.biolink_profiles FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden crear su propio perfil" ON public.biolink_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.biolink_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden eliminar su propio perfil" ON public.biolink_profiles FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 3️⃣ TABLA: biolink_links
-- ==========================================
CREATE TABLE IF NOT EXISTS public.biolink_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.biolink_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT url_not_empty CHECK (char_length(url) > 0)
);

CREATE INDEX IF NOT EXISTS idx_links_profile_id ON public.biolink_links(profile_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON public.biolink_links(profile_id, position);

ALTER TABLE public.biolink_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los links son visibles públicamente" ON public.biolink_links;
DROP POLICY IF EXISTS "Los usuarios pueden crear links en su perfil" ON public.biolink_links;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propios links" ON public.biolink_links;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propios links" ON public.biolink_links;

CREATE POLICY "Los links son visibles públicamente" ON public.biolink_links FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden crear links en su perfil" ON public.biolink_links FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "Los usuarios pueden actualizar sus propios links" ON public.biolink_links FOR UPDATE USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "Los usuarios pueden eliminar sus propios links" ON public.biolink_links FOR DELETE USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));

-- ==========================================
-- 4️⃣ TABLA: biolink_social_links
-- ==========================================
CREATE TABLE IF NOT EXISTS public.biolink_social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.biolink_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT platform_not_empty CHECK (char_length(platform) > 0),
  CONSTRAINT username_not_empty CHECK (char_length(username) > 0)
);

CREATE INDEX IF NOT EXISTS idx_social_links_profile_id ON public.biolink_social_links(profile_id);

ALTER TABLE public.biolink_social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los social links son visibles públicamente" ON public.biolink_social_links;
DROP POLICY IF EXISTS "Los usuarios pueden crear social links en su perfil" ON public.biolink_social_links;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propios social links" ON public.biolink_social_links;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propios social links" ON public.biolink_social_links;

CREATE POLICY "Los social links son visibles públicamente" ON public.biolink_social_links FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden crear social links en su perfil" ON public.biolink_social_links FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "Los usuarios pueden actualizar sus propios social links" ON public.biolink_social_links FOR UPDATE USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "Los usuarios pueden eliminar sus propios social links" ON public.biolink_social_links FOR DELETE USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));

-- ==========================================
-- 5️⃣ TABLA: biolink_gallery_images
-- ==========================================
CREATE TABLE IF NOT EXISTS public.biolink_gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.biolink_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_profile_id ON public.biolink_gallery_images(profile_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_position ON public.biolink_gallery_images(profile_id, position);

ALTER TABLE public.biolink_gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Las imágenes de la galería son visibles públicamente" ON public.biolink_gallery_images;
DROP POLICY IF EXISTS "Los usuarios pueden crear imágenes en su galería" ON public.biolink_gallery_images;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propias imágenes de galería" ON public.biolink_gallery_images;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propias imágenes de galería" ON public.biolink_gallery_images;

CREATE POLICY "Las imágenes de la galería son visibles públicamente" ON public.biolink_gallery_images FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden crear imágenes en su galería" ON public.biolink_gallery_images FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "Los usuarios pueden actualizar sus propias imágenes de galería" ON public.biolink_gallery_images FOR UPDATE USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "Los usuarios pueden eliminar sus propias imágenes de galería" ON public.biolink_gallery_images FOR DELETE USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));

-- ==========================================
-- 6️⃣ TABLAS DE ANALYTICS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.biolink_profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.biolink_profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON public.biolink_profile_views(profile_id);
ALTER TABLE public.biolink_profile_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cualquiera puede registrar vistas" ON public.biolink_profile_views;
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias analytics" ON public.biolink_profile_views;
CREATE POLICY "Cualquiera puede registrar vistas" ON public.biolink_profile_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Los usuarios pueden ver sus propias analytics" ON public.biolink_profile_views FOR SELECT USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.biolink_link_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID NOT NULL REFERENCES public.biolink_links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON public.biolink_link_clicks(link_id);
ALTER TABLE public.biolink_link_clicks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cualquiera puede registrar clicks" ON public.biolink_link_clicks;
DROP POLICY IF EXISTS "Los usuarios pueden ver clicks de sus links" ON public.biolink_link_clicks;
CREATE POLICY "Cualquiera puede registrar clicks" ON public.biolink_link_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Los usuarios pueden ver clicks de sus links" ON public.biolink_link_clicks FOR SELECT USING (EXISTS (SELECT 1 FROM public.biolink_links l JOIN public.biolink_profiles p ON l.profile_id = p.id WHERE l.id = link_id AND p.user_id = auth.uid()));

-- ==========================================
-- 6️⃣ FUNCIONES RPC & TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION increment_profile_views(profile_uuid UUID) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN UPDATE public.biolink_profiles SET views_count = COALESCE(views_count, 0) + 1 WHERE id = profile_uuid; END; $$;

CREATE OR REPLACE FUNCTION increment_link_clicks(link_uuid UUID) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN UPDATE public.biolink_links SET clicks_count = COALESCE(clicks_count, 0) + 1 WHERE id = link_uuid; END; $$;

CREATE OR REPLACE FUNCTION increment_social_clicks(social_uuid UUID) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN UPDATE public.biolink_social_links SET clicks_count = COALESCE(clicks_count, 0) + 1 WHERE id = social_uuid; END; $$;

CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.biolink_profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.biolink_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 7️⃣ STORAGE BUCKET (¡AUTO-CREACIÓN!)
-- ==========================================
-- Intentamos crear el bucket directamente en la tabla de sistema storage.buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('background-images', 'background-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de seguridad para el Storage
-- Políticas para 'profile-images'
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-images' );

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );

-- Políticas para 'background-images'
DROP POLICY IF EXISTS "Public Access Background" ON storage.objects;
CREATE POLICY "Public Access Background"
ON storage.objects FOR SELECT
USING ( bucket_id = 'background-images' );

DROP POLICY IF EXISTS "Authenticated users can upload Background" ON storage.objects;
CREATE POLICY "Authenticated users can upload Background"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'background-images' 
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Users can update own background images" ON storage.objects;
CREATE POLICY "Users can update own background images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'background-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can delete own background images" ON storage.objects;
CREATE POLICY "Users can delete own background images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'background-images' AND auth.role() = 'authenticated' );

-- Políticas para 'gallery-images'
DROP POLICY IF EXISTS "Public Access Gallery" ON storage.objects;
CREATE POLICY "Public Access Gallery"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery-images' );

DROP POLICY IF EXISTS "Authenticated users can upload Gallery" ON storage.objects;
CREATE POLICY "Authenticated users can upload Gallery"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Users can update own gallery images" ON storage.objects;
CREATE POLICY "Users can update own gallery images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'gallery-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can delete own gallery images" ON storage.objects;
CREATE POLICY "Users can delete own gallery images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'gallery-images' AND auth.role() = 'authenticated' );


-- ==========================================
-- ✅ FIN DEL SCRIPT
-- ==========================================
