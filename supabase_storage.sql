-- 1. CREAR BUCKETS (Si no existen)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('background-images', 'background-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. POLÍTICAS PARA 'profile-images'

-- Borrar políticas viejas si existen para evitar errores
DROP POLICY IF EXISTS "Public Access profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete profile-images" ON storage.objects;

-- Crear nuevas políticas
CREATE POLICY "Public Access profile-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-images' );

CREATE POLICY "Auth Upload profile-images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Auth Update profile-images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Auth Delete profile-images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );


-- 3. POLÍTICAS PARA 'background-images'

DROP POLICY IF EXISTS "Public Access background-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload background-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update background-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete background-images" ON storage.objects;

CREATE POLICY "Public Access background-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'background-images' );

CREATE POLICY "Auth Upload background-images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'background-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Auth Update background-images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'background-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Auth Delete background-images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'background-images' AND auth.role() = 'authenticated' );


-- 4. POLÍTICAS PARA 'gallery-images'

DROP POLICY IF EXISTS "Public Access gallery-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload gallery-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update gallery-images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete gallery-images" ON storage.objects;

CREATE POLICY "Public Access gallery-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery-images' );

CREATE POLICY "Auth Upload gallery-images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'gallery-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Auth Update gallery-images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'gallery-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Auth Delete gallery-images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'gallery-images' AND auth.role() = 'authenticated' );
