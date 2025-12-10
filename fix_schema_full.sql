-- Script COMPLETO y CORREGIDO para arreglar la tabla biolink_profiles
-- Ejecuta esto en el SQL Editor de Supabase. Este script es seguro de correr múltiples veces.

-- 1. Asegurar que la tabla existe
CREATE TABLE IF NOT EXISTS biolink_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Asegurar que Row Level Security está activo
ALTER TABLE biolink_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Añadir TODAS las columnas necesarias 

-- Campos básicos
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS theme JSONB;

-- Campos de imágenes y estilo
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS background_image_url TEXT;
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#FFFFFF';
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS link_color TEXT DEFAULT '#FFFFFF';

-- Campos de redes sociales y contacto
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS email_url TEXT;
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Campos de WhatsApp
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS whatsapp_active BOOLEAN DEFAULT false;
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS whatsapp_message TEXT;
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS whatsapp_position TEXT DEFAULT 'right';
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS whatsapp_color TEXT DEFAULT '#25D366';

-- Campos de Analytics
ALTER TABLE biolink_profiles ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- 4. ACTUALIZAR Políticas de Seguridad (Borrar viejas y crear nuevas para evitar error "Already exists")

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON biolink_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON biolink_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON biolink_profiles;

-- Permitir lectura pública
CREATE POLICY "Public profiles are viewable by everyone" 
ON biolink_profiles FOR SELECT 
USING ( true );

-- Permitir a usuarios insertar su propio perfil
CREATE POLICY "Users can insert their own profile" 
ON biolink_profiles FOR INSERT 
WITH CHECK ( auth.uid() = user_id );

-- Permitir a usuarios actualizar su propio perfil
CREATE POLICY "Users can update own profile" 
ON biolink_profiles FOR UPDATE 
USING ( auth.uid() = user_id );

-- 5. Recargar configuración
NOTIFY pgrst, 'reload config';
