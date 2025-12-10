-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  profile_image TEXT,
  theme TEXT DEFAULT 'purple',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de enlaces
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de redes sociales
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, platform)
);

-- Tabla de analytics (visitas al perfil)
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT
);

-- Tabla de clicks en enlaces
CREATE TABLE IF NOT EXISTS link_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS links_profile_id_idx ON links(profile_id);
CREATE INDEX IF NOT EXISTS social_links_profile_id_idx ON social_links(profile_id);
CREATE INDEX IF NOT EXISTS profile_views_profile_id_idx ON profile_views(profile_id);
CREATE INDEX IF NOT EXISTS profile_views_viewed_at_idx ON profile_views(viewed_at);
CREATE INDEX IF NOT EXISTS link_clicks_link_id_idx ON link_clicks(link_id);
CREATE INDEX IF NOT EXISTS link_clicks_clicked_at_idx ON link_clicks(clicked_at);

-- Políticas de seguridad (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
DROP POLICY IF EXISTS "Los perfiles son visibles públicamente" ON profiles;
CREATE POLICY "Los perfiles son visibles públicamente" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Los usuarios pueden crear su propio perfil" ON profiles;
CREATE POLICY "Los usuarios pueden crear su propio perfil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON profiles;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para links
DROP POLICY IF EXISTS "Los enlaces son visibles públicamente" ON links;
CREATE POLICY "Los enlaces son visibles públicamente" ON links
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Los usuarios pueden gestionar enlaces en su perfil" ON links;
CREATE POLICY "Los usuarios pueden gestionar enlaces en su perfil" ON links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = links.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Políticas para social_links
DROP POLICY IF EXISTS "Las redes sociales son visibles públicamente" ON social_links;
CREATE POLICY "Las redes sociales son visibles públicamente" ON social_links
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Los usuarios pueden gestionar redes sociales en su perfil" ON social_links;
CREATE POLICY "Los usuarios pueden gestionar redes sociales en su perfil" ON social_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = social_links.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Políticas para profile_views
DROP POLICY IF EXISTS "Cualquiera puede registrar vistas" ON profile_views;
CREATE POLICY "Cualquiera puede registrar vistas" ON profile_views
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Los dueños pueden ver sus analytics" ON profile_views;
CREATE POLICY "Los dueños pueden ver sus analytics" ON profile_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = profile_views.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Políticas para link_clicks
DROP POLICY IF EXISTS "Cualquiera puede registrar clicks" ON link_clicks;
CREATE POLICY "Cualquiera puede registrar clicks" ON link_clicks
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Los dueños pueden ver clicks de sus enlaces" ON link_clicks;
CREATE POLICY "Los dueños pueden ver clicks de sus enlaces" ON link_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM links 
      JOIN profiles ON profiles.id = links.profile_id
      WHERE links.id = link_clicks.link_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para incrementar vistas de perfil
CREATE OR REPLACE FUNCTION increment_profile_views(profile_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET views_count = views_count + 1 
  WHERE id = profile_uuid;
END;
$$ LANGUAGE plpgsql;

-- Función para incrementar clicks en enlaces
CREATE OR REPLACE FUNCTION increment_link_clicks(link_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE links 
  SET clicks_count = clicks_count + 1 
  WHERE id = link_uuid;
END;
$$ LANGUAGE plpgsql;

-- Función para incrementar clicks en redes sociales
CREATE OR REPLACE FUNCTION increment_social_clicks(social_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE social_links 
  SET clicks_count = clicks_count + 1 
  WHERE id = social_uuid;
END;
$$ LANGUAGE plpgsql;

-- Crear bucket de storage para imágenes de perfil
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para storage
DROP POLICY IF EXISTS "Todos pueden ver imágenes de perfil" ON storage.objects;
CREATE POLICY "Todos pueden ver imágenes de perfil"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Usuarios pueden actualizar sus imágenes" ON storage.objects;
CREATE POLICY "Usuarios pueden actualizar sus imágenes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Usuarios pueden eliminar sus imágenes" ON storage.objects;
CREATE POLICY "Usuarios pueden eliminar sus imágenes"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-images' AND auth.uid() IS NOT NULL);
