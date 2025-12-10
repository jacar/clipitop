import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export async function setupDatabase() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const results = {
    tables: {
      profile_views: false,
      link_clicks: false,
    },
    functions: {
      increment_profile_views: false,
      increment_link_clicks: false,
      increment_social_clicks: false,
    },
    storage: {
      profile_images: false,
    },
    errors: [] as string[],
  };

  try {
    // 1. Crear tabla profile_views
    console.log('📊 Creando tabla profile_views...');
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: `
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

        DROP POLICY IF EXISTS "Las vistas son públicas" ON public.biolink_profile_views;
        DROP POLICY IF EXISTS "Cualquiera puede registrar vistas" ON public.biolink_profile_views;

        CREATE POLICY "Las vistas son públicas" ON public.biolink_profile_views
          FOR SELECT USING (true);

        CREATE POLICY "Cualquiera puede registrar vistas" ON public.biolink_profile_views
          FOR INSERT WITH CHECK (true);
      `
    });
    
    if (error1) {
      console.error('❌ Error creando profile_views:', error1);
      results.errors.push(`profile_views: ${error1.message}`);
    } else {
      console.log('✅ Tabla profile_views creada');
      results.tables.profile_views = true;
    }

    // 2. Crear tabla link_clicks
    console.log('📊 Creando tabla link_clicks...');
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: `
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

        DROP POLICY IF EXISTS "Los clicks son públicos" ON public.biolink_link_clicks;
        DROP POLICY IF EXISTS "Cualquiera puede registrar clicks" ON public.biolink_link_clicks;

        CREATE POLICY "Los clicks son públicos" ON public.biolink_link_clicks
          FOR SELECT USING (true);

        CREATE POLICY "Cualquiera puede registrar clicks" ON public.biolink_link_clicks
          FOR INSERT WITH CHECK (true);
      `
    });
    
    if (error2) {
      console.error('❌ Error creando link_clicks:', error2);
      results.errors.push(`link_clicks: ${error2.message}`);
    } else {
      console.log('✅ Tabla link_clicks creada');
      results.tables.link_clicks = true;
    }

    // 3. Crear funciones RPC
    console.log('⚡ Creando funciones RPC...');
    const { error: error3 } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION increment_profile_views(profile_uuid UUID)
        RETURNS void AS $$
        BEGIN
          UPDATE public.biolink_profiles
          SET views_count = views_count + 1
          WHERE id = profile_uuid;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        CREATE OR REPLACE FUNCTION increment_link_clicks(link_uuid UUID)
        RETURNS void AS $$
        BEGIN
          UPDATE public.biolink_links
          SET clicks_count = clicks_count + 1
          WHERE id = link_uuid;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        CREATE OR REPLACE FUNCTION increment_social_clicks(social_uuid UUID)
        RETURNS void AS $$
        BEGIN
          UPDATE public.biolink_social_links
          SET clicks_count = clicks_count + 1
          WHERE id = social_uuid;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (error3) {
      console.error('❌ Error creando funciones RPC:', error3);
      results.errors.push(`RPC functions: ${error3.message}`);
    } else {
      console.log('✅ Funciones RPC creadas');
      results.functions.increment_profile_views = true;
      results.functions.increment_link_clicks = true;
      results.functions.increment_social_clicks = true;
    }

  } catch (error: any) {
    console.error('❌ Error general:', error);
    results.errors.push(`General error: ${error.message}`);
  }

  // 4. Crear bucket de Storage (esto SÍ funciona desde el servidor)
  try {
    console.log('📦 Creando bucket de Storage...');
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'profile-images');
    
    if (!bucketExists) {
      const { error: storageError } = await supabase.storage.createBucket('profile-images', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });
      
      if (storageError) {
        console.error('❌ Error creando bucket:', storageError);
        results.errors.push(`Storage: ${storageError.message}`);
      } else {
        console.log('✅ Bucket profile-images creado');
        results.storage.profile_images = true;
      }
    } else {
      console.log('✅ Bucket profile-images ya existe');
      results.storage.profile_images = true;
    }
  } catch (error: any) {
    console.error('❌ Error en storage:', error);
    results.errors.push(`Storage error: ${error.message}`);
  }

  return results;
}
