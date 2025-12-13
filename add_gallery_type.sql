-- Add type column to gallery images
ALTER TABLE biolink_gallery_images 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video'));
