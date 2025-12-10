-- Script para agregar columnas faltantes a la tabla biolink_profiles
-- Ejecuta esto en el SQL Editor de Supabase

ALTER TABLE biolink_profiles
ADD COLUMN IF NOT EXISTS email_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS link_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS background_image_url TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_message TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_position TEXT DEFAULT 'right',
ADD COLUMN IF NOT EXISTS whatsapp_color TEXT DEFAULT '#25D366';

-- Asegurar que 'theme' pueda guardar texto o JSON (si es necesario cambiar tipo)
-- ALTER TABLE biolink_profiles ALTER COLUMN theme TYPE JSONB USING theme::JSONB; 
-- (Dejamos theme como está por seguridad, asumiendo que es TEXT o JSONB compatible)
