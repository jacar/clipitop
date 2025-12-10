import { useState } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import { CheckCircle, XCircle, AlertCircle, Copy, Check } from 'lucide-react';
import { copyToClipboard as copyText } from '../lib/clipboard';

interface DatabaseSetupProps {
  onClose: () => void;
}

export function DatabaseSetup({ onClose }: DatabaseSetupProps) {
  const [status, setStatus] = useState<{
    views: 'pending' | 'success' | 'error';
    clicks: 'pending' | 'success' | 'error';
    storage: 'pending' | 'success' | 'error';
  }>({
    views: 'pending',
    clicks: 'pending',
    storage: 'pending',
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'instructions' | 'verify'>('instructions');

  const handleCopyToClipboard = async (text: string, id: string) => {
    const success = await copyText(text);
    if (success) {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } else {
      alert('No se pudo copiar. Por favor, selecciona y copia manualmente.');
    }
  };

  const createProfileViewsTable = async () => {
    setLoading(true);
    try {
      // Intentar insertar un registro de prueba para verificar si la tabla existe
      const { error } = await supabase.from(TABLES.PROFILE_VIEWS).select('id').limit(1);
      
      if (error) {
        console.error('❌ La tabla biolink_profile_views no existe');
        setStatus(prev => ({ ...prev, views: 'error' }));
      } else {
        console.log('✅ La tabla biolink_profile_views existe');
        setStatus(prev => ({ ...prev, views: 'success' }));
      }
    } catch (error) {
      console.error('Error al verificar tabla:', error);
      setStatus(prev => ({ ...prev, views: 'error' }));
    }
    setLoading(false);
  };

  const createLinkClicksTable = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from(TABLES.LINK_CLICKS).select('id').limit(1);
      
      if (error) {
        console.error('❌ La tabla biolink_link_clicks no existe');
        setStatus(prev => ({ ...prev, clicks: 'error' }));
      } else {
        console.log('✅ La tabla biolink_link_clicks existe');
        setStatus(prev => ({ ...prev, clicks: 'success' }));
      }
    } catch (error) {
      console.error('Error al verificar tabla:', error);
      setStatus(prev => ({ ...prev, clicks: 'error' }));
    }
    setLoading(false);
  };

  const createStorageBucket = async () => {
    setLoading(true);
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some(b => b.name === 'profile-images');
      
      if (exists) {
        console.log('✅ El bucket profile-images existe');
        setStatus(prev => ({ ...prev, storage: 'success' }));
      } else {
        console.error('❌ El bucket profile-images no existe. Debes crearlo manualmente.');
        setStatus(prev => ({ ...prev, storage: 'error' }));
      }
    } catch (error) {
      console.error('Error al verificar storage:', error);
      setStatus(prev => ({ ...prev, storage: 'error' }));
    }
    setLoading(false);
  };

  const checkAll = async () => {
    await createProfileViewsTable();
    await createLinkClicksTable();
    await createStorageBucket();
  };

  // Script SQL unificado que crea TODO
  const sqlCompleto = `-- ========================================
-- CLIPLI.TOP - SCRIPT DE CONFIGURACIÓN COMPLETO
-- Ejecuta este script UNA SOLA VEZ en el SQL Editor
-- ========================================

-- 1. CREAR TABLA DE PERFILES
CREATE TABLE IF NOT EXISTS public.biolink_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  profile_image TEXT,
  theme TEXT DEFAULT 'default',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.biolink_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.biolink_profiles(username);

ALTER TABLE public.biolink_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los perfiles son públicos" ON public.biolink_profiles
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios pueden crear su propio perfil" ON public.biolink_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.biolink_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar su propio perfil" ON public.biolink_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- 2. CREAR TABLA DE ENLACES
CREATE TABLE IF NOT EXISTS public.biolink_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.biolink_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_links_profile_id ON public.biolink_links(profile_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON public.biolink_links(position);

ALTER TABLE public.biolink_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los enlaces son públicos" ON public.biolink_links
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios pueden crear enlaces en su perfil" ON public.biolink_links
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.biolink_profiles
      WHERE id = profile_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden actualizar sus enlaces" ON public.biolink_links
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.biolink_profiles
      WHERE id = profile_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden eliminar sus enlaces" ON public.biolink_links
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.biolink_profiles
      WHERE id = profile_id AND user_id = auth.uid()
    )
  );

-- 3. CREAR TABLA DE REDES SOCIALES
CREATE TABLE IF NOT EXISTS public.biolink_social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.biolink_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_links_profile_id ON public.biolink_social_links(profile_id);

ALTER TABLE public.biolink_social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Las redes sociales son públicas" ON public.biolink_social_links
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios pueden crear redes sociales en su perfil" ON public.biolink_social_links
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.biolink_profiles
      WHERE id = profile_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden actualizar sus redes sociales" ON public.biolink_social_links
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.biolink_profiles
      WHERE id = profile_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden eliminar sus redes sociales" ON public.biolink_social_links
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.biolink_profiles
      WHERE id = profile_id AND user_id = auth.uid()
    )
  );

-- 4. CREAR TABLA DE VISTAS DE PERFIL
CREATE TABLE IF NOT EXISTS public.biolink_profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.biolink_profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON public.biolink_profile_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON public.biolink_profile_views(viewed_at);

ALTER TABLE public.biolink_profile_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Las vistas son públicas" ON public.biolink_profile_views
  FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede registrar vistas" ON public.biolink_profile_views
  FOR INSERT WITH CHECK (true);

-- 5. CREAR TABLA DE CLICKS EN ENLACES
CREATE TABLE IF NOT EXISTS public.biolink_link_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID NOT NULL REFERENCES public.biolink_links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON public.biolink_link_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at ON public.biolink_link_clicks(clicked_at);

ALTER TABLE public.biolink_link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los clicks son públicos" ON public.biolink_link_clicks
  FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede registrar clicks" ON public.biolink_link_clicks
  FOR INSERT WITH CHECK (true);

-- 6. CREAR FUNCIONES RPC PARA INCREMENTAR CONTADORES
-- Función para incrementar vistas de perfil
CREATE OR REPLACE FUNCTION increment_profile_views(profile_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.biolink_profiles
  SET views_count = views_count + 1
  WHERE id = profile_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar clicks en enlaces
CREATE OR REPLACE FUNCTION increment_link_clicks(link_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.biolink_links
  SET clicks_count = clicks_count + 1
  WHERE id = link_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar clicks en redes sociales
CREATE OR REPLACE FUNCTION increment_social_clicks(social_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.biolink_social_links
  SET clicks_count = clicks_count + 1
  WHERE id = social_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`;

  const sqlStorage = `-- ========================================
-- POLÍTICAS DE STORAGE
-- Ejecuta esto DESPUÉS de crear el bucket "profile-images"
-- ========================================

CREATE POLICY "Cualquiera puede ver imágenes" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Usuarios autenticados pueden subir" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Usuarios pueden actualizar sus imágenes" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Usuarios pueden eliminar sus imágenes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-images' 
    AND auth.role() = 'authenticated'
  );`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-5xl w-full my-8">
        <h2 className="text-3xl mb-2">
          🔧 Configuración de Base de Datos
        </h2>
        
        <p className="text-gray-600 mb-6">
          Completa la configuración en 3 simples pasos
        </p>

        {/* Alerta de advertencia si hay errores */}
        {(status.views === 'error' || status.clicks === 'error' || status.storage === 'error') && (
          <div className="mb-6 p-5 bg-red-50 border-2 border-red-500 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-red-900 mb-2">
                  ⚠️ La base de datos NO está configurada
                </h3>
                <p className="text-red-800 mb-3">
                  Debes ejecutar el script SQL a continuación para crear las tablas necesarias.
                </p>
                <p className="text-sm text-red-700">
                  Sin estas tablas, la aplicación NO funcionará correctamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mostrar éxito si todo está bien */}
        {status.views === 'success' && status.clicks === 'success' && status.storage === 'success' && (
          <div className="mb-6 p-5 bg-green-50 border-2 border-green-500 rounded-xl">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-green-900 mb-2">
                  ✅ ¡Configuración Completa!
                </h3>
                <p className="text-green-800">
                  Todas las tablas y el storage están correctamente configurados. Ya puedes usar la aplicación.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Script completo prominente */}
        <div className="mb-6 border-4 border-purple-500 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-blue-50 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-purple-900">
                ⚡ PASO 1: Copiar Script SQL
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                Este script crea TODAS las tablas necesarias. Copia el script completo.
              </p>
            </div>
            <button
              onClick={() => handleCopyToClipboard(sqlCompleto, 'completo')}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {copied === 'completo' ? (
                <>
                  <Check size={20} />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copiar Script
                </>
              )}
            </button>
          </div>
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-green-400 text-xs font-mono">SQL Script - Configuración Completa</span>
              <span className="text-gray-400 text-xs">{sqlCompleto.split('\n').length} líneas</span>
            </div>
            <pre className="text-green-400 p-4 text-sm overflow-x-auto max-h-80 font-mono">
              {sqlCompleto}
            </pre>
          </div>
        </div>

        {/* PASO 2: Ejecutar en SQL Editor */}
        <div className="mb-6 border-4 border-blue-500 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
          <h3 className="text-xl font-bold text-blue-900 mb-3">
            🚀 PASO 2: Ejecutar en SQL Editor de Supabase
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div className="flex-1">
                <a
                  href="https://supabase.com/dashboard/project/ufdmpskuirirdcvodsnq/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold text-lg"
                >
                  Abrir SQL Editor de Supabase →
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div className="flex-1">
                <p className="font-semibold mb-1">Pegar el script copiado</p>
                <p className="text-sm text-gray-600">Presiona <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+V</kbd> (o <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Cmd+V</kbd> en Mac) en el editor</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div className="flex-1">
                <p className="font-semibold mb-1">Ejecutar el script</p>
                <p className="text-sm text-gray-600">Haz clic en el botón <span className="font-bold text-green-600">RUN</span> (▶️) en la esquina inferior derecha</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-100 rounded-lg border-2 border-green-400">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm text-green-800">
                  Verás un mensaje de éxito: <span className="font-mono text-xs bg-white px-2 py-0.5 rounded">Success. No rows returned</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PASO 3: Crear Storage Bucket */}
        <div className="mb-6 border-4 border-orange-500 rounded-xl p-5 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg">
          <h3 className="text-xl font-bold text-orange-900 mb-3">
            📦 PASO 3: Crear Storage Bucket
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
              <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div className="flex-1">
                <a
                  href="https://supabase.com/dashboard/project/ufdmpskuirirdcvodsnq/storage/buckets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline font-semibold text-lg"
                >
                  Abrir Storage de Supabase →
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
              <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div className="flex-1">
                <p className="font-semibold mb-1">Click en "New bucket"</p>
                <p className="text-sm text-gray-600">Botón verde en la esquina superior derecha</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
              <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div className="flex-1">
                <p className="font-semibold mb-2">Configurar el bucket:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Name: <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">profile-images</code></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span className="font-bold text-orange-700">✅ Marcar "Public bucket"</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span>File size limit: 5 MB</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Allowed MIME types: image/png, image/jpeg, image/jpg, image/gif, image/webp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Click en "Create bucket"</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* PASO 4 OPCIONAL: Políticas de Storage */}
        <div className="mb-6 border-4 border-teal-500 rounded-xl p-5 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-teal-900">
                🔐 PASO 4 (Opcional): Políticas de Storage
              </h3>
              <p className="text-sm text-teal-700 mt-1">
                Solo necesario si quieres agregar políticas adicionales de seguridad al bucket
              </p>
            </div>
            <button
              onClick={() => handleCopyToClipboard(sqlStorage, 'storage')}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {copied === 'storage' ? (
                <>
                  <Check size={20} />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copiar SQL
                </>
              )}
            </button>
          </div>
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-green-400 text-xs font-mono">SQL - Políticas de Storage</span>
              <span className="text-gray-400 text-xs">{sqlStorage.split('\n').length} líneas</span>
            </div>
            <pre className="text-green-400 p-4 text-sm overflow-x-auto max-h-60 font-mono">
              {sqlStorage}
            </pre>
          </div>
          <div className="mt-3 p-3 bg-teal-100 rounded-lg border border-teal-300">
            <p className="text-xs text-teal-800">
              💡 <strong>Nota:</strong> Este paso es opcional. El bucket público ya permite subir y ver imágenes. 
              Estas políticas agregan control adicional sobre quién puede modificar o eliminar archivos.
            </p>
          </div>
        </div>

        {/* Estado de verificación */}
        <div className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-lg">🔍 Verificar Configuración</h4>
            <button
              onClick={checkAll}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Verificar Ahora
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Después de ejecutar los 3 pasos anteriores, haz clic en "Verificar Ahora" para confirmar que todo está correcto.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`p-4 rounded-lg border-2 transition-all ${
              status.views === 'success' ? 'bg-green-50 border-green-500 shadow-green-200 shadow-md' :
              status.views === 'error' ? 'bg-red-50 border-red-500' :
              'bg-gray-100 border-gray-300'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {status.views === 'success' ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : status.views === 'error' ? (
                  <XCircle className="text-red-600" size={20} />
                ) : (
                  <AlertCircle className="text-gray-500" size={20} />
                )}
                <span className="text-sm font-bold">Tabla Profile Views</span>
              </div>
              <p className="text-xs text-gray-600 ml-7">biolink_profile_views</p>
            </div>

            <div className={`p-4 rounded-lg border-2 transition-all ${
              status.clicks === 'success' ? 'bg-green-50 border-green-500 shadow-green-200 shadow-md' :
              status.clicks === 'error' ? 'bg-red-50 border-red-500' :
              'bg-gray-100 border-gray-300'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {status.clicks === 'success' ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : status.clicks === 'error' ? (
                  <XCircle className="text-red-600" size={20} />
                ) : (
                  <AlertCircle className="text-gray-500" size={20} />
                )}
                <span className="text-sm font-bold">Tabla Link Clicks</span>
              </div>
              <p className="text-xs text-gray-600 ml-7">biolink_link_clicks</p>
            </div>

            <div className={`p-4 rounded-lg border-2 transition-all ${
              status.storage === 'success' ? 'bg-green-50 border-green-500 shadow-green-200 shadow-md' :
              status.storage === 'error' ? 'bg-red-50 border-red-500' :
              'bg-gray-100 border-gray-300'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {status.storage === 'success' ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : status.storage === 'error' ? (
                  <XCircle className="text-red-600" size={20} />
                ) : (
                  <AlertCircle className="text-gray-500" size={20} />
                )}
                <span className="text-sm font-bold">Storage Bucket</span>
              </div>
              <p className="text-xs text-gray-600 ml-7">profile-images</p>
            </div>
          </div>
        </div>

        {/* Botón cerrar */}
        <div className="flex justify-end gap-3">
          {status.views === 'success' && status.clicks === 'success' && status.storage === 'success' && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md"
            >
              ✅ Configuración Completa - Continuar
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}