-- Add WhatsApp Color column to biolink_profiles
ALTER TABLE public.biolink_profiles
ADD COLUMN IF NOT EXISTS whatsapp_color TEXT DEFAULT '#25D366';
