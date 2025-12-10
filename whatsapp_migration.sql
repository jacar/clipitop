-- Add WhatsApp Support columns to biolink_profiles
ALTER TABLE public.biolink_profiles 
ADD COLUMN IF NOT EXISTS whatsapp_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_message TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_icon_style TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS whatsapp_color TEXT DEFAULT '#25D366';
