import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Copy, ExternalLink, AlertTriangle, RefreshCw, Terminal, Database } from 'lucide-react';

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

interface SetupStatus {
  tables: {
    biolink_profiles: boolean;
    biolink_links: boolean;
    biolink_social_links: boolean;
    biolink_profile_views: boolean;
    biolink_link_clicks: boolean;
  };
  functions: {
    increment_profile_views: boolean;
    increment_link_clicks: boolean;
    increment_social_clicks: boolean;
  };
  storage: {
    bucket_exists: boolean;
    bucket_public: boolean;
    can_upload: boolean;
  };
  checking: boolean;
}

export function AdvancedSetup({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<SetupStatus>({
    tables: {
      biolink_profiles: false,
      biolink_links: false,
      biolink_social_links: false,
      biolink_profile_views: false,
      biolink_link_clicks: false,
    },
    functions: {
      increment_profile_views: false,
      increment_link_clicks: false,
      increment_social_clicks: false,
    },
    storage: {
      bucket_exists: false,
      bucket_public: false,
      can_upload: false,
    },
    checking: true,
  });

  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'check' | 'sql' | 'done'>('check');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    console.log('🔍 Verificando estado completo del sistema...');
    setStatus(prev => ({ ...prev, checking: true }));

    const newStatus: SetupStatus = {
      tables: {
        biolink_profiles: false,
        biolink_links: false,
        biolink_social_links: false,
        biolink_profile_views: false,
        biolink_link_clicks: false,
      },
      functions: {
        increment_profile_views: false,
        increment_link_clicks: false,
        increment_social_clicks: false,
      },
      storage: {
        bucket_exists: false,
        bucket_public: false,
        can_upload: false,
      },
      checking: false,
    };

    // Verificar tablas
    const tables = ['biolink_profiles', 'biolink_links', 'biolink_social_links', 'biolink_profile_views', 'biolink_link_clicks'];
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1);
        newStatus.tables[table as keyof typeof newStatus.tables] = !error;
      } catch (e: any) {
        console.error(`❌ Error verificando ${table}:`, e.message);
      }
    }

    // Verificar funciones RPC
    const functions = ['increment_profile_views', 'increment_link_clicks', 'increment_social_clicks'];
    for (const func of functions) {
      try {
        const paramName = func.includes('profile') ? 'profile_uuid' : func.includes('link') ? 'link_uuid' : 'social_uuid';
        const { error } = await supabase.rpc(func, { [paramName]: '00000000-0000-0000-0000-000000000000' });
        // La función existe si no da error 404
        const exists = !error || !error.message.includes('Could not find');
        newStatus.functions[func as keyof typeof newStatus.functions] = exists;
      } catch (e: any) {
        console.error(`❌ Error verificando función ${func}:`, e.message);
      }
    }

    // Verificar Storage con más detalle
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (!bucketsError) {
        const profileBucket = buckets?.find(b => b.name === 'profile-images');
        
        if (profileBucket) {
          newStatus.storage.bucket_exists = true;
          newStatus.storage.bucket_public = profileBucket.public || false;
          
          // Verificar permisos de upload
          try {
            const testFile = new Blob(['test'], { type: 'text/plain' });
            const testPath = `test-${Date.now()}.txt`;
            
            const { error: uploadError } = await supabase.storage
              .from('profile-images')
              .upload(testPath, testFile, { upsert: true });
            
            if (!uploadError) {
              newStatus.storage.can_upload = true;
              await supabase.storage.from('profile-images').remove([testPath]);
            }
          } catch (e) {}
        }
      }
    } catch (e: any) {
      console.error('❌ Error en verificación de storage:', e.message);
    }

    setStatus(newStatus);
    
    // Determinar el siguiente paso
    const allTablesOk = Object.values(newStatus.tables).every(v => v);
    const allFunctionsOk = Object.values(newStatus.functions).every(v => v);
    const storageOk = newStatus.storage.bucket_exists && newStatus.storage.bucket_public;
    
    if (allTablesOk && allFunctionsOk && storageOk) {
      setStep('done');
    } else if (allTablesOk && allFunctionsOk && !storageOk) {
      setStep('storage'); // SI SOLO FALTA EL BUCKET, IR A INSTRUCCIONES MANUALES
    } else {
      setStep('sql');
    }
  };

  const createBucketAuto = async () => {
    try {
      console.log('Intentando crear bucket automáticamente...');
      const { data, error } = await supabase.storage.createBucket('profile-images', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });

      if (error) {
        // Si el error dice que ya existe pero no lo detectamos antes, quizás es tema de permisos
        if (error.message.includes('already exists')) {
            alert('El sistema dice que el bucket ya existe. Vamos a verificar de nuevo.');
        } else {
            throw error;
        }
      } else {
        alert('✨ ¡Bucket creado exitosamente!');
      }
      
      // Recargar estado
      await checkStatus();
    } catch (e: any) {
      console.error('Error creando bucket:', e);
      alert('⚠️ No se pudo crear automáticamente (Error: ' + e.message + ').\n\nPor favor sigue los pasos manuales listados abajo.');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.warn('Portapapeles bloqueado, usando fallback manual...', err);
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
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
        alert('No pudimos copiar automáticamente. Por favor selecciona el texto manualmente.');
      }
    }
  };

  const StatusIcon = ({ value }: { value: boolean }) => {
    return value ? (
      <CheckCircle className="text-green-500" size={20} />
    ) : (
      <XCircle className="text-red-500" size={20} />
    );
  };

  const allTablesOk = Object.values(status.tables).every(v => v);
  const allFunctionsOk = Object.values(status.functions).every(v => v);
  const storageOk = status.storage.bucket_exists && status.storage.bucket_public;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6">
          <h2 className="text-3xl mb-2 flex items-center gap-2">
            <Database size={32} />
            <span>Configuración Avanzada V2</span>
          </h2>
          <p className="text-indigo-100">
            Diagnóstico y reparación automática integral
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Estado de Tablas */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-blue-900">📊 Tablas</h3>
                <StatusIcon value={allTablesOk} />
              </div>
              <div className="space-y-2 text-sm">
                {Object.entries(status.tables).map(([table, ok]) => (
                  <div key={table} className="flex items-center gap-2">
                    <StatusIcon value={ok} />
                    <span className="text-xs text-blue-800">{table}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estado de Funciones */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-purple-900">⚡ Funciones</h3>
                <StatusIcon value={allFunctionsOk} />
              </div>
              <div className="space-y-2 text-sm">
                {Object.entries(status.functions).map(([func, ok]) => (
                  <div key={func} className="flex items-center gap-2">
                    <StatusIcon value={ok} />
                    <span className="text-xs text-purple-800">{func}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estado de Storage */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border-2 border-pink-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-pink-900">📦 Storage</h3>
                <StatusIcon value={storageOk} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <StatusIcon value={status.storage.bucket_exists} />
                  <span className="text-xs text-pink-800">Bucket existe</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon value={status.storage.bucket_public} />
                  <span className="text-xs text-pink-800">Bucket público</span>
                </div>
              </div>
            </div>
          </div>

          {step === 'check' && (
             <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 flex items-center justify-center">
                <RefreshCw className="animate-spin text-blue-600 mr-2" />
                <span className="font-bold text-blue-900">Verificando sistema...</span>
             </div>
          )}

          {step === 'sql' && (
            <div className="space-y-4">
              <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-orange-600 flex-shrink-0 mt-1" size={32} />
                  <div className="flex-1">
                    <h3 className="font-bold text-orange-900 text-xl mb-3">⚠️ Reparación Necesaria</h3>
                    <p className="text-orange-800 mb-4">
                      Detectamos componentes faltantes. Ejecuta este script SQL para reparar <strong>TODO</strong> (incluyendo el Bucket de Storage).
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-orange-900 mb-4">
                      <li className="pl-2"><strong>Copia el SQL</strong> (botón abajo)</li>
                      <li className="pl-2"><strong>Pega en Supabase SQL Editor</strong> y ejecuta</li>
                      <li className="pl-2"><strong>Vuelve aquí y verifica</strong></li>
                    </ol>
                    <div className="flex gap-3">
                      <button
                        onClick={() => copyToClipboard(COMPLETE_SQL)}
                        className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2 shadow-lg"
                      >
                        {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                        <span>{copied ? '¡Copiado!' : 'Copiar SQL Completo'}</span>
                      </button>
                      <a
                        href="https://supabase.com/dashboard/project/_/sql/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 shadow-lg"
                      >
                        <ExternalLink size={20} />
                        <span>Abrir SQL Editor</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fallback Manual Storage - Visible siempre por seguridad */}
              {!status.storage.bucket_exists && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Database className="text-yellow-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-yellow-900">¿Problemas con Storage?</h4>
                      <p className="text-yellow-800 text-sm mb-2">
                        Si el SQL no logra crear el bucket automáticamente (puede pasar por permisos), hazlo manual:
                      </p>
                      <a
                        href="https://supabase.com/dashboard/project/_/storage/buckets"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-yellow-700 font-bold hover:underline"
                      >
                        <ExternalLink size={14} />
                        Ir a Storage y crear bucket "profile-images" (Público)
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'storage' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={32} />
                  <div className="flex-1">
                    <h3 className="font-bold text-yellow-900 text-xl mb-3">📦 Falta Crear el Bucket de Storage</h3>
                    <p className="text-yellow-800 mb-4">
                      Las tablas están listas, pero el script SQL no pudo crear el bucket de imágenes automáticamente (probablemente por permisos).
                    </p>

                    {/* Botón de intento automático */}
                    <button
                      onClick={createBucketAuto}
                      className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition flex items-center justify-center gap-2 shadow-md font-bold"
                    >
                      <Database size={20} />
                      <span>Intentar Reparar Automáticamente</span>
                    </button>

                    <div className="text-center text-yellow-800 text-sm mb-2 font-semibold">
                      — O SI FALLA, HAZLO MANUALMENTE —
                    </div>

                    <ol className="list-decimal list-inside space-y-2 text-yellow-900 mb-4 bg-white/50 p-4 rounded-lg">
                      <li className="pl-2"><strong>Click en "Abrir Storage"</strong> abajo</li>
                      <li className="pl-2"><strong>Click en "New bucket"</strong> (botón verde)</li>
                      <li className="pl-2">Nombre: <code className="bg-yellow-200 px-2 py-1 rounded font-mono">profile-images</code></li>
                      <li className="pl-2">✅ <strong>MARCA "Public bucket"</strong> (MUY IMPORTANTE)</li>
                      <li className="pl-2"><strong>Click en "Create bucket"</strong></li>
                      <li className="pl-2"><strong>Vuelve aquí y verifica</strong></li>
                    </ol>
                    <a
                      href="https://supabase.com/dashboard/project/_/storage/buckets"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ExternalLink size={20} />
                      <span>Abrir Storage en Supabase</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={48} />
                <div>
                  <h3 className="font-bold text-green-900 text-2xl mb-2">✅ Sistema 100% Operativo</h3>
                  <p className="text-green-800">
                    Tablas, Funciones y Storage están configurados correctamente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cerrar
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={checkStatus}
                disabled={status.checking}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={16} className={status.checking ? 'animate-spin' : ''} />
                <span>Verificar de Nuevo</span>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
