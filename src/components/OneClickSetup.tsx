import { useState } from 'react';
import { Copy, CheckCircle, ExternalLink, AlertTriangle, Database } from 'lucide-react';

const COMPLETE_SQL = `-- ==========================================
-- 🚀 CLIPLI.TOP - CONFIGURACIÓN COMPLETA (V2)
-- ==========================================
-- Este script configura:
-- 1. Tablas de Base de Datos
-- 2. Funciones RPC y Triggers
-- 3. STORAGE BUCKET y Políticas (¡NUEVO!)
-- ==========================================

-- ==========================================
-- 1️⃣ EXTENSIONES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2️⃣ TABLA: biolink_profiles
-- ==========================================
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.biolink_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.biolink_profiles(username);

ALTER TABLE public.biolink_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los perfiles son visibles públicamente" ON public.biolink_profiles;
DROP POLICY IF EXISTS "Los usuarios pueden crear su propio perfil" ON public.biolink_profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.biolink_profiles;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar su propio perfil" ON public.biolink_profiles;

CREATE POLICY "Los perfiles son visibles públicamente" ON public.biolink_profiles FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden crear su propio perfil" ON public.biolink_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.biolink_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Los usuarios pueden eliminar su propio perfil" ON public.biolink_profiles FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 3️⃣ TABLA: biolink_links
-- ==========================================
CREATE TABLE IF NOT EXISTS public.biolink_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.biolink_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT url_not_empty CHECK (char_length(url) > 0)
);

CREATE INDEX IF NOT EXISTS idx_links_profile_id ON public.biolink_links(profile_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON public.biolink_links(profile_id, position);

ALTER TABLE public.biolink_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los links son visibles públicamente" ON public.biolink_links;
DROP POLICY IF EXISTS "Los usuarios pueden crear links en su perfil" ON public.biolink_links;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propios links" ON public.biolink_links;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propios links" ON public.biolink_links;

CREATE POLICY "Los links son visibles públicamente" ON public.biolink_links FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden crear links en su perfil" ON public.biolink_links FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "Los usuarios pueden actualizar sus propios links" ON public.biolink_links FOR UPDATE USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "Los usuarios pueden eliminar sus propios links" ON public.biolink_links FOR DELETE USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));

-- ==========================================
-- 4️⃣ TABLA: biolink_social_links
-- ==========================================
CREATE TABLE IF NOT EXISTS public.biolink_social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.biolink_profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT platform_not_empty CHECK (char_length(platform) > 0),
  CONSTRAINT username_not_empty CHECK (char_length(username) > 0)
);

CREATE INDEX IF NOT EXISTS idx_social_links_profile_id ON public.biolink_social_links(profile_id);

ALTER TABLE public.biolink_social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los social links son visibles públicamente" ON public.biolink_social_links;
DROP POLICY IF EXISTS "Los usuarios pueden crear social links en su perfil" ON public.biolink_social_links;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propios social links" ON public.biolink_social_links;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propios social links" ON public.biolink_social_links;

CREATE POLICY "Los social links son visibles públicamente" ON public.biolink_social_links FOR SELECT USING (true);
CREATE POLICY "Los usuarios pueden crear social links en su perfil" ON public.biolink_social_links FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "Los usuarios pueden actualizar sus propios social links" ON public.biolink_social_links FOR UPDATE USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "Los usuarios pueden eliminar sus propios social links" ON public.biolink_social_links FOR DELETE USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));

-- ==========================================
-- 5️⃣ TABLAS DE ANALYTICS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.biolink_profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.biolink_profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON public.biolink_profile_views(profile_id);
ALTER TABLE public.biolink_profile_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cualquiera puede registrar vistas" ON public.biolink_profile_views;
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias analytics" ON public.biolink_profile_views;
CREATE POLICY "Cualquiera puede registrar vistas" ON public.biolink_profile_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Los usuarios pueden ver sus propias analytics" ON public.biolink_profile_views FOR SELECT USING (EXISTS (SELECT 1 FROM public.biolink_profiles WHERE id = profile_id AND user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS public.biolink_link_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID NOT NULL REFERENCES public.biolink_links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id ON public.biolink_link_clicks(link_id);
ALTER TABLE public.biolink_link_clicks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cualquiera puede registrar clicks" ON public.biolink_link_clicks;
DROP POLICY IF EXISTS "Los usuarios pueden ver clicks de sus links" ON public.biolink_link_clicks;
CREATE POLICY "Cualquiera puede registrar clicks" ON public.biolink_link_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Los usuarios pueden ver clicks de sus links" ON public.biolink_link_clicks FOR SELECT USING (EXISTS (SELECT 1 FROM public.biolink_links l JOIN public.biolink_profiles p ON l.profile_id = p.id WHERE l.id = link_id AND p.user_id = auth.uid()));

-- ==========================================
-- 6️⃣ FUNCIONES RPC & TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION increment_profile_views(profile_uuid UUID) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN UPDATE public.biolink_profiles SET views_count = COALESCE(views_count, 0) + 1 WHERE id = profile_uuid; END; $$;

CREATE OR REPLACE FUNCTION increment_link_clicks(link_uuid UUID) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN UPDATE public.biolink_links SET clicks_count = COALESCE(clicks_count, 0) + 1 WHERE id = link_uuid; END; $$;

CREATE OR REPLACE FUNCTION increment_social_clicks(social_uuid UUID) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN UPDATE public.biolink_social_links SET clicks_count = COALESCE(clicks_count, 0) + 1 WHERE id = social_uuid; END; $$;

CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.biolink_profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.biolink_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 7️⃣ STORAGE BUCKET (¡AUTO-CREACIÓN!)
-- ==========================================
-- Intentamos crear el bucket directamente en la tabla de sistema storage.buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de seguridad para el Storage
-- Permitir acceso público para VER imágenes
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-images' );

-- Permitir a usuarios autenticados SUBIR imágenes
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.role() = 'authenticated'
);

-- Permitir a usuarios actualizar/borrar sus propias imágenes (simplificado)
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );

-- ==========================================
-- ✅ FIN DEL SCRIPT
-- ==========================================
`;

export function OneClickSetup({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.warn('Portapapeles bloqueado, usando fallback manual...', err);
      
      // Fallback para entornos restrictivos
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Asegurar que el elemento no sea visible pero sea parte del DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        } else {
          throw new Error('Fallback failed');
        }
      } catch (fallbackErr) {
        console.error('Error crítico al copiar:', fallbackErr);
        alert('No pudimos copiar automáticamente. Por favor selecciona el texto manualmente.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <h2 className="text-2xl mb-2 flex items-center gap-2">
            <Database size={28} />
            <span>Configuración Automática V2 (Completa)</span>
          </h2>
          <p className="text-blue-100">
            Script mejorado que configura TODO (Tablas, Funciones y Storage)
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Instrucciones */}
            <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-3 text-lg">🚀 Solo 1 paso necesario:</h4>
                  <ol className="list-decimal list-inside space-y-3 text-blue-900">
                    <li className="pl-2">
                      <strong>Click en "Copiar SQL Completo"</strong> (abajo)
                    </li>
                    <li className="pl-2">
                      <strong>Pega y ejecuta</strong> en Supabase SQL Editor
                    </li>
                    <li className="pl-2">
                      <strong>¡Listo!</strong> Ya no necesitas configurar nada manualmente.
                    </li>
                  </ol>
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm font-semibold">
                    ✨ ¡Ahora incluye la creación automática del bucket de Storage!
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de copiar grande */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => copyToClipboard(COMPLETE_SQL)}
                className="w-full max-w-md px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl text-lg transform hover:scale-105"
              >
                {copied ? (
                  <>
                    <CheckCircle size={24} />
                    <span>¡Copiado! Pégalo en Supabase</span>
                  </>
                ) : (
                  <>
                    <Copy size={24} />
                    <span>Copiar SQL Completo</span>
                  </>
                )}
              </button>

              <a
                href="https://supabase.com/dashboard/project/_/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-md px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                <ExternalLink size={20} />
                <span>Abrir SQL Editor en Supabase</span>
              </a>
            </div>

            {/* Preview del SQL */}
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <span>👀 Vista previa del SQL:</span>
                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-700">Versión 2.0 (Full Auto)</span>
              </h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs max-h-48 border-2 border-gray-700 font-mono">
                {COMPLETE_SQL}
              </pre>
            </div>

            {/* Fallback Manual para Storage */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <h4 className="font-bold text-yellow-900 mb-2 text-sm flex items-center gap-2">
                <AlertTriangle size={16} />
                ¿El bucket "profile-images" sigue sin aparecer?
              </h4>
              <p className="text-yellow-800 text-xs mb-3">
                A veces la creación automática de Storage falla por permisos. Si tras ejecutar el SQL sigues viendo errores, crea el bucket manualmente:
              </p>
              <div className="flex gap-2">
                <a
                  href="https://supabase.com/dashboard/project/_/storage/buckets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  Crear Bucket Manualmente
                </a>
                <div className="text-xs text-yellow-800 flex flex-col justify-center">
                  <span>1. Name: <strong>profile-images</strong></span>
                  <span>2. <strong>Public bucket: YES</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <CheckCircle size={18} />
            <span>Ya ejecuté el SQL, recargar página</span>
          </button>
        </div>
      </div>
    </div>
  );
}
