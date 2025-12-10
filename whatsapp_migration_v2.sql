-- Add WhatsApp Position and Icon Style columns to biolink_profiles
ALTER TABLE public.biolink_profiles
ADD COLUMN IF NOT EXISTS whatsapp_position TEXT DEFAULT 'right',
ADD COLUMN IF NOT EXISTS whatsapp_icon_style TEXT DEFAULT 'standard';
