-- Add icon support to biolink_links table
ALTER TABLE biolink_links 
ADD COLUMN IF NOT EXISTS icon_key TEXT,
ADD COLUMN IF NOT EXISTS icon_color TEXT;

-- Notify pgrst to reload schema cache
NOTIFY pgrst, 'reload config';
