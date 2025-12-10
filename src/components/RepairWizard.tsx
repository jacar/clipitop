import { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import { CheckCircle, XCircle, Copy, AlertTriangle, RefreshCw, ChevronRight, Database } from 'lucide-react';

interface RepairStep {
  id: string;
  title: string;
  description: string;
  sql: string;
  verify: () => Promise<boolean>;
  execute?: () => Promise<{ success: boolean; error?: string }>;
  status: 'pending' | 'checking' | 'success' | 'error' | 'executing';
}

export function RepairWizard({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<RepairStep[]>([
    {
      id: 'profile_views',
      title: '1️⃣ Tabla profile_views',
      description: 'Tabla para registrar las vistas de cada perfil',
      sql: `-- CREAR TABLA DE VISTAS DE PERFIL
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

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Las vistas son públicas" ON public.biolink_profile_views;
DROP POLICY IF EXISTS "Cualquiera puede registrar vistas" ON public.biolink_profile_views;

-- Crear políticas
CREATE POLICY "Las vistas son públicas" ON public.biolink_profile_views
  FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede registrar vistas" ON public.biolink_profile_views
  FOR INSERT WITH CHECK (true);`,
      verify: async () => {
        const { error } = await supabase.from(TABLES.PROFILE_VIEWS).select('id').limit(1);
        return !error;
      },
      status: 'pending',
    },
    {
      id: 'link_clicks',
      title: '2️⃣ Tabla link_clicks',
      description: 'Tabla para registrar los clicks en cada enlace',
      sql: `-- CREAR TABLA DE CLICKS EN ENLACES
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

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Los clicks son públicos" ON public.biolink_link_clicks;
DROP POLICY IF EXISTS "Cualquiera puede registrar clicks" ON public.biolink_link_clicks;

-- Crear políticas
CREATE POLICY "Los clicks son públicos" ON public.biolink_link_clicks
  FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede registrar clicks" ON public.biolink_link_clicks
  FOR INSERT WITH CHECK (true);`,
      verify: async () => {
        const { error } = await supabase.from(TABLES.LINK_CLICKS).select('id').limit(1);
        return !error;
      },
      status: 'pending',
    },
    {
      id: 'rpc_profile_views',
      title: '3️⃣ Función RPC: increment_profile_views',
      description: 'Función para incrementar el contador de vistas del perfil',
      sql: `-- FUNCIÓN PARA INCREMENTAR VISTAS DE PERFIL
CREATE OR REPLACE FUNCTION increment_profile_views(profile_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.biolink_profiles
  SET views_count = views_count + 1
  WHERE id = profile_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`,
      verify: async () => {
        const { error } = await supabase.rpc('increment_profile_views', { 
          profile_uuid: '00000000-0000-0000-0000-000000000000' 
        });
        // La función existe si el error es sobre el UUID inexistente, no sobre función no encontrada
        return !error || !error.message.includes('not found');
      },
      status: 'pending',
    },
    {
      id: 'rpc_link_clicks',
      title: '4️⃣ Función RPC: increment_link_clicks',
      description: 'Función para incrementar el contador de clicks en enlaces',
      sql: `-- FUNCIÓN PARA INCREMENTAR CLICKS EN ENLACES
CREATE OR REPLACE FUNCTION increment_link_clicks(link_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.biolink_links
  SET clicks_count = clicks_count + 1
  WHERE id = link_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`,
      verify: async () => {
        const { error } = await supabase.rpc('increment_link_clicks', { 
          link_uuid: '00000000-0000-0000-0000-000000000000' 
        });
        return !error || !error.message.includes('not found');
      },
      status: 'pending',
    },
    {
      id: 'rpc_social_clicks',
      title: '5️⃣ Función RPC: increment_social_clicks',
      description: 'Función para incrementar el contador de clicks en redes sociales',
      sql: `-- FUNCIÓN PARA INCREMENTAR CLICKS EN REDES SOCIALES
CREATE OR REPLACE FUNCTION increment_social_clicks(social_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.biolink_social_links
  SET clicks_count = clicks_count + 1
  WHERE id = social_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`,
      verify: async () => {
        const { error } = await supabase.rpc('increment_social_clicks', { 
          social_uuid: '00000000-0000-0000-0000-000000000000' 
        });
        return !error || !error.message.includes('not found');
      },
      status: 'pending',
    },
    {
      id: 'storage',
      title: '6️⃣ Storage Bucket: profile-images',
      description: 'Bucket para almacenar las imágenes de perfil',
      sql: `-- INTENTO DE CREACIÓN AUTOMÁTICA DE BUCKET
-- Si esto falla, tendrás que hacerlo manualmente (ver instrucciones abajo)

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de seguridad (Obligatorio)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-images' );

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'profile-images' AND auth.role() = 'authenticated' );`,
      verify: async () => {
        try {
          const { data: buckets, error } = await supabase.storage.listBuckets();
          if (error) {
            console.error('Error al verificar storage:', error);
            return false;
          }
          const hasBucket = buckets?.some(b => b.name === 'profile-images');
          console.log('Verificación storage - Bucket encontrado:', hasBucket);
          console.log('Buckets disponibles:', buckets?.map(b => b.name));
          return hasBucket || false;
        } catch (e) {
          console.error('Error en verificación de storage:', e);
          return false;
        }
      },
      status: 'pending',
    },
  ]);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Verificar todos los pasos al cargar
    verifyAllSteps();
  }, []);

  const verifyAllSteps = async () => {
    const updatedSteps = [...steps];
    
    for (let i = 0; i < updatedSteps.length; i++) {
      updatedSteps[i].status = 'checking';
      setSteps([...updatedSteps]);
      
      try {
        const success = await updatedSteps[i].verify();
        updatedSteps[i].status = success ? 'success' : 'error';
      } catch (error) {
        updatedSteps[i].status = 'error';
      }
      
      setSteps([...updatedSteps]);
    }
  };

  const verifyStep = async (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps[index].status = 'checking';
    setSteps(updatedSteps);

    try {
      const success = await steps[index].verify();
      updatedSteps[index].status = success ? 'success' : 'error';
    } catch (error) {
      updatedSteps[index].status = 'error';
    }

    setSteps(updatedSteps);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('Fallback failed');
        }
      } catch (fallbackErr) {
        console.error('Error crítico al copiar:', fallbackErr);
        alert('No pudimos copiar automáticamente. Por favor selecciona el texto manualmente.');
      }
    }
  };

  const currentStepData = steps[currentStep];
  const allSuccess = steps.every(s => s.status === 'success');

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'checking') return <RefreshCw className="animate-spin text-blue-500" size={20} />;
    if (status === 'success') return <CheckCircle className="text-green-500" size={20} />;
    if (status === 'error') return <XCircle className="text-red-500" size={20} />;
    return <AlertTriangle className="text-gray-400" size={20} />;
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
        if (error.message.includes('already exists')) {
          console.log('El bucket ya existe, verificando...');
          await verifyStep(currentStep);
          return;
        }
        throw error;
      }
      
      console.log('✨ Bucket creado exitosamente!');
      await verifyStep(currentStep);
    } catch (e: any) {
      console.error('Error creando bucket:', e);
      alert('⚠️ La reparación automática falló (Error: ' + (e.message || e) + ').\n\nPor favor intenta la creación manual.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <h2 className="text-2xl mb-2">🔧 Asistente de Reparación de Base de Datos</h2>
          <p className="text-purple-100">
            Configura tu base de datos paso a paso
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  currentStep === index
                    ? 'bg-purple-100 border-2 border-purple-600'
                    : 'bg-white border border-gray-200 hover:border-purple-300'
                }`}
              >
                <StatusIcon status={step.status} />
                <span className="text-sm">{index + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-2xl mb-2 flex items-center gap-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            {currentStepData.status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-green-800">✅ Este paso ya está configurado correctamente</span>
              </div>
            )}
            {currentStepData.status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <XCircle className="text-red-500" size={20} />
                <span className="text-red-800">❌ Este paso necesita ser configurado</span>
              </div>
            )}
            {currentStepData.status === 'checking' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <RefreshCw className="animate-spin text-blue-500" size={20} />
                <span className="text-blue-800">🔄 Verificando...</span>
              </div>
            )}
          </div>

          {/* Instructions */}
          {currentStepData.id === 'storage' ? (
            <div className="space-y-4">
              {/* Botón de Reparación Automática */}
              <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Database className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 mb-2">🤖 Reparación Automática</h4>
                    <p className="text-blue-800 mb-3 text-sm">
                      Intentaremos crear el bucket utilizando la API del cliente. Esto funciona si tu usuario tiene permisos de administrador o si las políticas lo permiten.
                    </p>
                    <button
                      onClick={createBucketAuto}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm font-bold"
                    >
                      <RefreshCw size={18} />
                      <span>Intentar Reparar Automáticamente</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-yellow-900 mb-2">⚠️ Configuración Manual (Si falla lo automático)</h4>
                    <p className="text-yellow-800 mb-3">
                      Si el botón de arriba falla, el bucket de Storage DEBE crearse manualmente en Supabase Dashboard:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-yellow-900">
                      <li>Ve a <strong>Storage</strong> en el menú lateral de Supabase</li>
                      <li>Click en <strong>\"New bucket\"</strong></li>
                      <li>Nombre: <code className="bg-yellow-200 px-2 py-1 rounded font-mono">profile-images</code></li>
                      <li>✅ <strong>ACTIVA \"Public bucket\"</strong></li>
                      <li>Click en <strong>\"Create bucket\"</strong></li>
                      <li>Vuelve aquí y click en <strong>\"Verificar Ahora\"</strong></li>
                    </ol>
                    
                    <div className="mt-4 pt-4 border-t border-yellow-300">
                      <p className="text-yellow-800 mb-2 text-sm">
                        💡 <strong>Atajo rápido:</strong> Haz click en el botón para abrir Supabase directamente:
                      </p>
                      <a
                        href="https://supabase.com/dashboard/project/_/storage/buckets"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Abrir Storage en Supabase
                      </a>
                      <p className="text-xs text-yellow-700 mt-2">
                        (Se abrirá en una nueva pestaña)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mostrar detalles de diagnóstico */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-2">🔍 Diagnóstico:</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Para ver información detallada de tus buckets, abre la consola del navegador (F12) y mira los logs de verificación.
                </p>
                <button
                  onClick={async () => {
                    console.log('🔍 DIAGNÓSTICO DETALLADO DE STORAGE');
                    try {
                      const { data: buckets, error } = await supabase.storage.listBuckets();
                      console.log('📦 Respuesta completa:', { buckets, error });
                      console.log('📦 Buckets encontrados:', buckets?.map(b => ({
                        name: b.name,
                        id: b.id,
                        public: b.public
                      })));
                      
                      const hasProfileImages = buckets?.some(b => b.name === 'profile-images');
                      if (hasProfileImages) {
                        console.log('✅ Bucket profile-images EXISTE');
                      } else {
                        console.log('❌ Bucket profile-images NO ENCONTRADO');
                        console.log('💡 Buckets disponibles:', buckets?.map(b => b.name).join(', ') || 'ninguno');
                      }
                    } catch (e) {
                      console.error('❌ Error:', e);
                    }
                    alert('Revisa la consola del navegador (F12) para ver los detalles');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm flex items-center gap-2"
                >
                  🐛 Ver Diagnóstico en Consola
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-2">📋 Cómo Ejecutar:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-blue-900 text-sm">
                      <li>Click en <strong>\"Copiar SQL\"</strong> abajo</li>
                      <li>Abre tu Dashboard de Supabase</li>
                      <li>Ve a <strong>SQL Editor</strong> en el menú lateral</li>
                      <li>Pega el SQL y click en <strong>\"RUN\"</strong> (esquina inferior derecha)</li>
                      <li>Si dice \"Success\" vuelve aquí y click en <strong>\"Verificar Ahora\"</strong></li>
                    </ol>
                    <p className="mt-3 text-xs text-blue-800">
                      💡 <strong>Tip:</strong> Los scripts son seguros de ejecutar múltiples veces.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">💾 Script SQL:</h4>
                  <button
                    onClick={() => copyToClipboard(currentStepData.sql)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <Copy size={16} />
                    {copied ? '¡Copiado!' : 'Copiar SQL'}
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                  {currentStepData.sql}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => verifyStep(currentStep)}
                disabled={currentStepData.status === 'checking'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw size={16} className={currentStepData.status === 'checking' ? 'animate-spin' : ''} />
                Verificar Ahora
              </button>
              
              <button
                onClick={verifyAllSteps}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Verificar Todo
              </button>
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  ← Anterior
                </button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                    allSuccess
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {allSuccess ? '✅ Completado' : 'Cerrar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}