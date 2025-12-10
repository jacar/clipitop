import { useState } from 'react';
import { Database, Copy, Check, X, ExternalLink, Key, Shield } from 'lucide-react';
import { copyToClipboard } from '../lib/clipboard';

export function SetupInstructions() {
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState<'database' | 'google'>('database');

  const sqlCode = `-- ============================================
-- CLIPLI.TOP - CONFIGURACIÓN DE BASE DE DATOS
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

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

-- ============================================
-- ÍNDICES PARA RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS links_profile_id_idx ON links(profile_id);
CREATE INDEX IF NOT EXISTS social_links_profile_id_idx ON social_links(profile_id);
CREATE INDEX IF NOT EXISTS profile_views_profile_id_idx ON profile_views(profile_id);
CREATE INDEX IF NOT EXISTS profile_views_viewed_at_idx ON profile_views(viewed_at);
CREATE INDEX IF NOT EXISTS link_clicks_link_id_idx ON link_clicks(link_id);
CREATE INDEX IF NOT EXISTS link_clicks_clicked_at_idx ON link_clicks(clicked_at);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE SEGURIDAD - PROFILES
-- ============================================

DROP POLICY IF EXISTS "Los perfiles son visibles públicamente" ON profiles;
CREATE POLICY "Los perfiles son visibles públicamente" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Los usuarios pueden crear su propio perfil" ON profiles;
CREATE POLICY "Los usuarios pueden crear su propio perfil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON profiles;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden eliminar su propio perfil" ON profiles;
CREATE POLICY "Los usuarios pueden eliminar su propio perfil" ON profiles
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS DE SEGURIDAD - LINKS
-- ============================================

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

-- ============================================
-- POLÍTICAS DE SEGURIDAD - SOCIAL LINKS
-- ============================================

DROP POLICY IF EXISTS "Las redes sociales son visibles públicamente" ON social_links;
CREATE POLICY "Las redes sociales son visibles públicamente" ON social_links
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Los usuarios pueden gestionar redes sociales" ON social_links;
CREATE POLICY "Los usuarios pueden gestionar redes sociales" ON social_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = social_links.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- ============================================
-- POLÍTICAS DE SEGURIDAD - ANALYTICS
-- ============================================

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

DROP POLICY IF EXISTS "Cualquiera puede registrar clicks" ON link_clicks;
CREATE POLICY "Cualquiera puede registrar clicks" ON link_clicks
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Los dueños pueden ver clicks" ON link_clicks;
CREATE POLICY "Los dueños pueden ver clicks" ON link_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM links 
      JOIN profiles ON profiles.id = links.profile_id
      WHERE links.id = link_clicks.link_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

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

-- ============================================
-- CONFIGURACIÓN DE STORAGE
-- ============================================

-- Crear bucket de storage para imágenes de perfil
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
DROP POLICY IF EXISTS "Todos pueden ver imágenes" ON storage.objects;
CREATE POLICY "Todos pueden ver imágenes" 
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

DROP POLICY IF EXISTS "Usuarios autenticados pueden subir" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden subir"
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

-- ============================================
-- ¡CONFIGURACIÓN COMPLETADA!
-- ============================================`;

  const handleCopy = async () => {
    const success = await copyToClipboard(sqlCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('No se pudo copiar automáticamente. Por favor selecciona y copia el texto manualmente.');
    }
  };

  const handleCopyURL = async (url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      alert('¡URL copiada al portapapeles!');
    } else {
      alert('No se pudo copiar. URL: ' + url);
    }
  };

  const openSQLEditor = () => {
    window.open('https://ufdmpskuirirdcvodsnq.supabase.co/project/ufdmpskuirirdcvodsnq/sql/new', '_blank');
  };

  const openAuthSettings = () => {
    window.open('https://ufdmpskuirirdcvodsnq.supabase.co/project/ufdmpskuirirdcvodsnq/auth/providers', '_blank');
  };

  const openGoogleConsole = () => {
    window.open('https://console.cloud.google.com/apis/credentials', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logoclic.svg"
              alt="Clipli.top"
              className="h-10 w-auto"
            />
            <div>
              <h2 className="text-3xl">Configuración</h2>
              <p className="text-gray-600 text-sm">Sigue estos pasos para configurar tu aplicación</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setCurrentStep('database')}
            className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition ${currentStep === 'database'
                ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Database size={20} />
            <span className="font-semibold">1. Crear Tablas</span>
          </button>
          <button
            onClick={() => setCurrentStep('google')}
            className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition ${currentStep === 'google'
                ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Shield size={20} />
            <span className="font-semibold">2. Auth con Google</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {currentStep === 'database' ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Database size={24} />
                  Paso 1: Crear las tablas en Supabase
                </h3>
                <ol className="space-y-3 text-blue-800">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span>Haz clic en el botón <strong>"Abrir SQL Editor"</strong> abajo</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span>Copia el código SQL haciendo clic en <strong>"Copiar SQL"</strong></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span>Pega el código en el SQL Editor de Supabase</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <span>Haz clic en <strong>"Run"</strong> (o presiona Ctrl+Enter)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    <span>Espera a que aparezca <strong>"Success. No rows returned"</strong></span>
                  </li>
                </ol>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center gap-2 transition font-semibold shadow-lg"
                >
                  {copied ? (
                    <>
                      <Check size={20} />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
                <button
                  onClick={openSQLEditor}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white rounded-xl flex items-center justify-center gap-2 transition font-semibold shadow-lg"
                >
                  <ExternalLink size={20} />
                  <span>Abrir SQL Editor</span>
                </button>
              </div>

              {/* Código SQL */}
              <div className="bg-gray-900 rounded-xl p-6 relative">
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
                    LISTO PARA COPIAR
                  </span>
                </div>
                <pre className="text-sm text-gray-100 overflow-x-auto pr-32">
                  <code>{sqlCode}</code>
                </pre>
              </div>

              {/* Lo que se creará */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-900 mb-3">✅ Lo que se creará:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
                  <div>
                    <h4 className="font-semibold mb-2">📊 Tablas:</h4>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>profiles (perfiles de usuario)</li>
                      <li>links (enlaces personalizados)</li>
                      <li>social_links (redes sociales)</li>
                      <li>profile_views (vistas del perfil)</li>
                      <li>link_clicks (clicks en enlaces)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">⚡ Funcionalidades:</h4>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Índices para velocidad</li>
                      <li>Row Level Security (RLS)</li>
                      <li>Funciones automáticas</li>
                      <li>Storage para imágenes</li>
                      <li>Analytics en tiempo real</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Shield size={24} />
                  Paso 2: Configurar autenticación con Google
                </h3>
                <p className="text-purple-800 mb-4">
                  Permite que los usuarios inicien sesión con su cuenta de Google
                </p>
              </div>

              {/* Parte A: Google Cloud Console */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-900 mb-4">📝 Parte A: Crear credenciales en Google</h4>
                <ol className="space-y-4 text-blue-800">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-semibold mb-1">Abre Google Cloud Console</p>
                      <button
                        onClick={openGoogleConsole}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        Abrir Google Console
                      </button>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-semibold mb-1">Crea un nuevo proyecto (si no tienes uno)</p>
                      <p className="text-sm">Haz clic en "CREATE PROJECT" y ponle un nombre como "Clipli"</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <p className="font-semibold mb-1">Configura OAuth consent screen</p>
                      <ul className="text-sm space-y-1 mt-2 list-disc list-inside ml-4">
                        <li>Ve a "OAuth consent screen"</li>
                        <li>Selecciona "External"</li>
                        <li>App name: <code className="bg-blue-100 px-2 py-1 rounded">Clipli.top</code></li>
                        <li>User support email: tu email</li>
                        <li>Developer contact: tu email</li>
                        <li>Guarda y continúa</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <p className="font-semibold mb-1">Crea las credenciales OAuth</p>
                      <ul className="text-sm space-y-1 mt-2 list-disc list-inside ml-4">
                        <li>Ve a "Credentials" → "CREATE CREDENTIALS"</li>
                        <li>Selecciona "OAuth client ID"</li>
                        <li>Application type: <code className="bg-blue-100 px-2 py-1 rounded">Web application</code></li>
                        <li>Name: <code className="bg-blue-100 px-2 py-1 rounded">Clipli Web</code></li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    <div>
                      <p className="font-semibold mb-1">Agrega la URL de redirección de Supabase</p>
                      <div className="mt-2 bg-white p-3 rounded border-2 border-blue-300">
                        <p className="text-xs text-gray-600 mb-1">Authorized redirect URIs:</p>
                        <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
                          https://ufdmpskuirirdcvodsnq.supabase.co/auth/v1/callback
                        </code>
                        <button
                          onClick={() => handleCopyURL('https://ufdmpskuirirdcvodsnq.supabase.co/auth/v1/callback')}
                          className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Copy size={12} />
                          Copiar URL
                        </button>
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                    <div>
                      <p className="font-semibold mb-1">Copia las credenciales</p>
                      <p className="text-sm">Guarda el <strong>Client ID</strong> y <strong>Client Secret</strong></p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Parte B: Supabase */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-green-900 mb-4">🔑 Parte B: Configurar en Supabase</h4>
                <ol className="space-y-4 text-green-800">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-semibold mb-1">Abre la configuración de Auth en Supabase</p>
                      <button
                        onClick={openAuthSettings}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        Abrir Auth Settings
                      </button>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-semibold mb-1">Busca "Google" en la lista de providers</p>
                      <p className="text-sm">Haz clic en "Google" para expandir las opciones</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <p className="font-semibold mb-1">Activa Google Auth</p>
                      <p className="text-sm">Cambia el toggle de "Enable Sign in with Google" a ON</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <p className="font-semibold mb-1">Pega las credenciales de Google</p>
                      <ul className="text-sm space-y-1 mt-2 ml-4">
                        <li>• <strong>Client ID</strong>: pega el Client ID de Google</li>
                        <li>• <strong>Client Secret</strong>: pega el Client Secret de Google</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    <div>
                      <p className="font-semibold mb-1">Guarda los cambios</p>
                      <p className="text-sm">Haz clic en <strong>"Save"</strong> al final de la página</p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Success message */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                <h4 className="text-lg font-bold text-yellow-900 mb-2">✨ ¡Listo!</h4>
                <p className="text-yellow-800">
                  Una vez completados estos pasos, los usuarios podrán iniciar sesión con Google en tu aplicación.
                  El botón "Continuar con Google" funcionará automáticamente.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {currentStep === 'database' ? (
                <p>💡 <strong>Tip:</strong> Ejecuta el SQL solo una vez. Si ya lo ejecutaste, puedes cerrar esta ventana.</p>
              ) : (
                <p>💡 <strong>Tip:</strong> Puedes hacer estos pasos en cualquier orden, pero te recomendamos hacer primero las tablas.</p>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition font-semibold shadow-lg"
            >
              Cerrar y probar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}