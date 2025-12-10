import { supabase } from './supabase';
import { TABLES } from './supabase';

// Autenticación con Google
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: (() => {
          // Prioridad: variable de entorno -> hardcoded si es prod -> origin
          const productionUrl = 'https://clipli.top';
          const url = import.meta.env.VITE_SITE_URL || (import.meta.env.PROD ? productionUrl : window.location.origin);

          console.log('Google Auth Redirect URL:', url); // DEBUG
          console.log('Is Prod:', import.meta.env.PROD); // DEBUG
          return url;
        })(),
      },
    });

    if (error) {
      console.error('Error en signInWithGoogle:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  }
}

// Función para verificar si un username está disponible
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Error al verificar username:', error);
      return false;
    }

    return !data; // Disponible si no hay datos
  } catch (error) {
    console.error('Error en checkUsernameAvailability:', error);
    return false;
  }
}

// Función para obtener perfil por username
export async function getProfileByUsername(username: string) {
  try {
    const { data: profile, error } = await supabase
      .from(TABLES.PROFILES)
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error al obtener perfil:', error);
      return null;
    }

    if (!profile) return null;

    // Obtener enlaces
    const { data: links, error: linksError } = await supabase
      .from(TABLES.LINKS)
      .select('*')
      .eq('profile_id', profile.id)
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (linksError) {
      console.error('Error al obtener enlaces:', linksError);
    }

    // Obtener redes sociales
    const { data: socials, error: socialsError } = await supabase
      .from(TABLES.SOCIAL_LINKS)
      .select('*')
      .eq('profile_id', profile.id);

    if (socialsError) {
      console.error('Error al obtener redes sociales:', socialsError);
    }

    return {
      ...profile,
      links: links || [],
      socials: socials || [],
    };
  } catch (error) {
    console.error('Error en getProfileByUsername:', error);
    return null;
  }
}

// Función para registrar vista de perfil
export async function trackProfileView(profileId: string, referrer?: string) {
  try {
    // Registrar vista en la tabla de analytics
    const { error: viewError } = await supabase.from(TABLES.PROFILE_VIEWS).insert({
      profile_id: profileId,
      referrer: referrer || document.referrer || 'direct',
      user_agent: navigator.userAgent,
    });

    if (viewError) {
      console.error('Error al registrar vista:', viewError);
    }

    // Incrementar contador de vistas
    const { error: countError } = await supabase.rpc('increment_profile_views', {
      profile_uuid: profileId,
    });

    if (countError) {
      console.error('Error al incrementar vistas:', countError);
    }
  } catch (error) {
    console.error('Error en trackProfileView:', error);
  }
}

// Función para registrar click en enlace
export async function trackLinkClick(linkId: string) {
  try {
    // Registrar click
    const { error: clickError } = await supabase.from(TABLES.LINK_CLICKS).insert({
      link_id: linkId,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
    });

    if (clickError) {
      console.error('Error al registrar click:', clickError);
    }

    // Incrementar contador
    const { error: countError } = await supabase.rpc('increment_link_clicks', {
      link_uuid: linkId,
    });

    if (countError) {
      console.error('Error al incrementar clicks:', countError);
    }
  } catch (error) {
    console.error('Error en trackLinkClick:', error);
  }
}

// Función para registrar click en red social
export async function trackSocialClick(socialId: string) {
  try {
    const { error } = await supabase.rpc('increment_social_clicks', {
      social_uuid: socialId,
    });

    if (error) {
      console.error('Error al incrementar clicks sociales:', error);
    }
  } catch (error) {
    console.error('Error en trackSocialClick:', error);
  }
}

// Función para subir imagen de perfil
export async function uploadProfileImage(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;



    // Subir archivo
    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error al subir imagen:', uploadError);
      throw uploadError;
    }

    // Obtener URL pública
    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error en uploadProfileImage:', error);
    return null;
  }
}

// Función para subir imagen de fondo
export async function uploadBackgroundImage(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-background-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir archivo al bucket 'background-images'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('background-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error al subir imagen de fondo:', uploadError);
      throw uploadError;
    }

    // Obtener URL pública correctamente
    const { data } = supabase.storage
      .from('background-images')
      .getPublicUrl(filePath);

    console.log('URL generada:', data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('Error en uploadBackgroundImage:', error);
    return null;
  }
}

// Función para borrar imagen (bucket genérico)
export async function deleteImage(bucket: string, path: string): Promise<boolean> {
  try {
    // El path suele ser la URL completa, necesitamos extraer la ruta relativa al bucket
    // Ejemplo URL: https://xyz.supabase.co/storage/v1/object/public/gallery-images/user-123.jpg
    // Path relativo: user-123.jpg

    // Extraer nombre del archivo de la URL
    const urlParts = path.split('/');
    const fileName = urlParts[urlParts.length - 1];

    if (!fileName) return false;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error(`Error eliminando archivo de ${bucket}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error en deleteImage:', error);
    return false;
  }
}

// Función para subir imagen de galería
export async function uploadGalleryImage(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-gallery-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir archivo al bucket 'gallery-images'
    const { error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error al subir imagen de galería:', uploadError);
      throw uploadError;
    }

    // Construir URL pública manualmente
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/gallery-images/${filePath}`;

    console.log('Gallery image URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error en uploadGalleryImage:', error);
    return null;
  }
}

// Función para obtener analytics del perfil
export async function getProfileAnalytics(profileId: string, days: number = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Obtener vistas por día
    const { data: views, error: viewsError } = await supabase
      .from(TABLES.PROFILE_VIEWS)
      .select('viewed_at')
      .eq('profile_id', profileId)
      .gte('viewed_at', startDate.toISOString());

    if (viewsError) {
      console.error('Error al obtener vistas:', viewsError);
    }

    // Obtener clicks en enlaces
    const { data: profileWithLinks, error: profileError } = await supabase
      .from(TABLES.PROFILES)
      .select(`
        *,
        ${TABLES.LINKS} (
          id,
          title,
          clicks_count
        )
      `)
      .eq('id', profileId)
      .single();

    if (profileError) {
      console.error('Error al obtener perfil:', profileError);
    }

    const profileData = profileWithLinks as any; // Cast to any to bypass strict type check on join

    // Agrupar vistas por día
    const viewsByDay: { [key: string]: number } = {};
    views?.forEach((view) => {
      const date = new Date(view.viewed_at).toLocaleDateString();
      viewsByDay[date] = (viewsByDay[date] || 0) + 1;
    });

    return {
      totalViews: profileData?.views_count || 0,
      viewsByDay,
      linkClicks: profileData?.biolink_links || [], // Access using the actual table name property from the join
      recentViews: views?.length || 0,
    };
  } catch (error) {
    console.error('Error en getProfileAnalytics:', error);
    return {
      totalViews: 0,
      viewsByDay: {},
      linkClicks: [],
      recentViews: 0,
    };
  }
}

// Función para buscar perfiles
export async function searchProfiles(query: string) {
  try {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select('username, display_name, bio, profile_image')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Error al buscar perfiles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en searchProfiles:', error);
    return [];
  }
}

// Función para verificar la conexión con Supabase
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(TABLES.PROFILES)
      .select('id')
      .limit(1);

    return !error;
  } catch (error) {
    console.error('Error al verificar conexión:', error);
    return false;
  }
}