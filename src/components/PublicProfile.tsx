import { useEffect, useState } from 'react';
import { Instagram, Twitter, Youtube, Facebook, Linkedin, ExternalLink, ArrowLeft } from 'lucide-react';

import { supabase, TABLES } from '../lib/supabase';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getProfileByUsername, trackProfileView, trackLinkClick, trackSocialClick } from '../lib/supabase-functions';

interface PublicProfileProps {
  username: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

interface Theme {
  id: string;
  name: string;
  type: 'gradient' | 'image' | 'texture';
  value: string;
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'round' | 'space';
  backgroundSize?: 'auto' | 'cover' | 'contain' | 'initial' | 'inherit' | string;
}

interface GalleryImage {
  id: string;
  profile_id: string;
  image_url: string;
  position: number;
  description?: string;
  created_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string;
  profile_image: string;
  background_image_url: string | null;
  theme: string | Theme;
  youtube_url: string | null;
  facebook_url: string | null;
  website_url: string | null;
  email_url: string | null;
  text_color: string;
  link_color: string;
  whatsapp_active?: boolean;
  whatsapp_number?: string;
  whatsapp_message?: string;
  whatsapp_position?: 'left' | 'right';
  whatsapp_color?: string;
  links: any[];
  socials: any[];
  galleryImages: GalleryImage[];
}

export function PublicProfile({ username, onBack, onNavigate }: PublicProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      const data = await getProfileByUsername(username);

      if (!data) {
        setError(true);
        setLoading(false);
        return;
      }

      // Cargar imágenes de la galería
      const { data: galleryData } = await supabase
        .from(TABLES.GALLERY_IMAGES)
        .select('*')
        .eq('profile_id', data.id)
        .order('position', { ascending: true });

      const profileWithGallery = { ...data, galleryImages: galleryData || [] };

      setProfile(profileWithGallery);

      // Registrar vista
      await trackProfileView(data.id);

      setLoading(false);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(true);
      setLoading(false);
    }
  };

  const handleLinkClick = async (link: any) => {
    await trackLinkClick(link.id);
    window.open(link.url, '_blank');
  };

  const handleSocialClick = async (social: any, platform: string) => {
    await trackSocialClick(social.id);

    const urls: { [key: string]: string } = {
      instagram: `https://instagram.com/${social.username.replace('@', '')}`,
      twitter: `https://twitter.com/${social.username.replace('@', '')}`,
      youtube: `https://youtube.com/@${social.username.replace('@', '')}`,
      facebook: `https://facebook.com/${social.username.replace('@', '')}`,
      linkedin: `https://linkedin.com/in/${social.username.replace('@', '')}`,
    };

    window.open(urls[platform], '_blank');
  };

  const themes: Theme[] = [
    { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-purple-600 to-pink-600' },
    { id: 'blue', name: 'Azul', type: 'gradient', value: 'from-blue-600 to-cyan-600' },
    { id: 'green', name: 'Verde', type: 'gradient', value: 'from-green-600 to-teal-600' },
    { id: 'orange', name: 'Naranja', type: 'gradient', value: 'from-orange-600 to-red-600' },
    { id: 'red-yellow', name: 'Rojo-Amarillo', type: 'gradient', value: 'from-red-500 to-yellow-500' },
    { id: 'cyan-blue', name: 'Cian-Azul', type: 'gradient', value: 'from-cyan-500 to-blue-500' },
    { id: 'pink-purple', name: 'Rosa-Púrpura', type: 'gradient', value: 'from-pink-500 to-purple-500' },
    { id: 'teal-green', name: 'Teal-Verde', type: 'gradient', value: 'from-teal-500 to-green-500' },
    { id: 'indigo-violet', name: 'Índigo-Violeta', type: 'gradient', value: 'from-indigo-500 to-violet-500' },
    { id: 'stripes-blue', name: 'Rayas Azules', type: 'texture', value: 'repeating-linear-gradient(45deg, #e0f2f7, #e0f2f7 10px, #b3e5fc 10px, #b3e5fc 20px)' },
    { id: 'dots-grey', name: 'Puntos Grises', type: 'texture', value: 'repeating-radial-gradient(circle, #e0e0e0, #e0e0e0 2px, #f5f5f5 2px, #f5f5f5 10px)' },
    { id: 'grid-light', name: 'Cuadrícula Clara', type: 'texture', value: 'linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px)' },
    { id: 'honeycomb', name: 'Panal', type: 'texture', value: 'repeating-conic-gradient(#f0f0f0 0% 25%, #e0e0e0 0% 50%) 0 0 / 20px 20px' }
  ];

  const currentTheme = themes.find(t => t.id === profile?.theme) || themes[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😕</span>
          </div>
          <h1 className="text-3xl mb-2">Perfil no encontrado</h1>
          <p className="text-gray-600 mb-6">
            El usuario @{username} no existe o ha sido eliminado.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const socialsMap = profile.socials.reduce((acc: any, s: any) => {
    acc[s.platform] = s;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header con botón de volver */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header con gradiente o imagen */}
          <div
            className="h-32 bg-cover bg-center"
            style={
              profile.background_image_url
                ? {
                  backgroundImage: `url(${profile.background_image_url})`,
                  backgroundSize: typeof profile.theme !== 'string' && profile.theme.backgroundSize ? profile.theme.backgroundSize : 'cover',
                  backgroundRepeat: typeof profile.theme !== 'string' && profile.theme.backgroundRepeat ? profile.theme.backgroundRepeat : 'no-repeat'
                }
                : currentTheme.type === 'image'
                  ? { backgroundImage: `url(${currentTheme.value})`, backgroundRepeat: currentTheme.backgroundRepeat || 'no-repeat', backgroundSize: currentTheme.backgroundSize || 'contain' }
                  : currentTheme.type === 'texture'
                    ? { backgroundImage: currentTheme.value }
                    : { backgroundImage: `linear-gradient(to right, ${currentTheme.value.replace('from-', '').replace('to-', '')})` }
            }
          ></div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <ImageWithFallback
                src={profile.profile_image}
                alt={profile.display_name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4"
              />

              {/* Name and Bio */}
              <h1 className="text-3xl mb-1 text-center">{profile.display_name}</h1>
              <p className="text-gray-600 mb-2 text-center">@{profile.username}</p>
              {profile.bio && (
                <p className="text-gray-600 text-center max-w-md mb-6">{profile.bio}</p>
              )}

              {/* Social Links */}
              {profile.socials.length > 0 && (
                <div className="flex gap-3 mb-8">
                  {socialsMap.instagram && (
                    <button
                      onClick={() => handleSocialClick(socialsMap.instagram, 'instagram')}
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                    >
                      <Instagram size={20} />
                    </button>
                  )}
                  {socialsMap.twitter && (
                    <button
                      onClick={() => handleSocialClick(socialsMap.twitter, 'twitter')}
                      className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                    >
                      {/* X Icon SVG */}
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                    </button>
                  )}
                  {socialsMap.youtube && (
                    <button
                      onClick={() => handleSocialClick(socialsMap.youtube, 'youtube')}
                      className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                    >
                      <Youtube size={20} />
                    </button>
                  )}
                  {socialsMap.facebook && (
                    <button
                      onClick={() => handleSocialClick(socialsMap.facebook, 'facebook')}
                      className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                    >
                      <Facebook size={20} />
                    </button>
                  )}
                  {socialsMap.linkedin && (
                    <button
                      onClick={() => handleSocialClick(socialsMap.linkedin, 'linkedin')}
                      className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg"
                    >
                      <Linkedin size={20} />
                    </button>
                  )}
                </div>
              )}

              {/* Links */}
              <div className="w-full max-w-lg space-y-4">
                {profile.links.map((link: any, index: number) => {
                  // Determine background style
                  let bgStyle = {};
                  let textColorClass = '';

                  if (link.button_color) {
                    bgStyle = { backgroundColor: link.button_color };
                    // If custom color, text color should be respected or default to black/white depending on preference, 
                    // but here we use link.text_color if available
                  } else if (index === 0) {
                    if (currentTheme.type === 'image') {
                      bgStyle = {
                        backgroundImage: `url(${currentTheme.value})`,
                        backgroundSize: currentTheme.backgroundSize || 'contain',
                        backgroundRepeat: currentTheme.backgroundRepeat || 'no-repeat'
                      };
                    } else if (currentTheme.type === 'texture') {
                      bgStyle = { backgroundImage: currentTheme.value };
                    } else {
                      // gradient
                      bgStyle = { backgroundImage: `linear-gradient(to right, ${currentTheme.value.replace('from-', '').replace('to-', '')})` };
                    }
                  } else {
                    bgStyle = {}; // Default class handling
                  }

                  const buttonClass = link.button_color
                    ? `w-full rounded-2xl p-5 text-center transition hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-between group`
                    : index === 0
                      ? `w-full rounded-2xl p-5 text-center transition hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-between group ${currentTheme.type === 'image' || currentTheme.type === 'gradient' ? 'text-white' : ''}`
                      : `w-full bg-gray-50 hover:bg-gray-100 rounded-2xl p-5 text-center transition hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-between group`;

                  return (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link)}
                      className={buttonClass}
                      style={{
                        ...bgStyle,
                        color: link.text_color ? link.text_color : (index === 0 && !link.button_color ? 'white' : undefined)
                      }}
                    >
                      <span className="flex-1 text-center" style={link.text_color ? { color: link.text_color } : {}}>{link.title}</span>
                      <ExternalLink
                        size={18}
                        className="opacity-0 group-hover:opacity-100 transition"
                        style={link.text_color ? { color: link.text_color } : {}}
                      />
                    </button>
                  )
                })}

                {profile.links.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Sin enlaces por el momento</p>
                  </div>
                )}
              </div>

              {/* Gallery Images */}
              {profile.galleryImages && profile.galleryImages.length > 0 && (
                <div className="w-full max-w-lg mt-8">
                  <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: profile.text_color }}>Galería</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.galleryImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image_url}
                          alt={image.description || 'Imagen de galería'}
                          className="w-full h-32 object-cover rounded-lg shadow-md"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}

      </div>
      {/* WhatsApp Floating Button */}
      {
        profile.whatsapp_active && profile.whatsapp_number && (
          <div className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none flex justify-center pb-6 px-6 safe-area-bottom">
            <div className="w-full max-w-2xl flex items-end">
              <a
                href={`https://wa.me/${profile.whatsapp_number}?text=${encodeURIComponent(profile.whatsapp_message || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`pointer-events-auto p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-white ${profile.whatsapp_position === 'left' ? 'mr-auto' : 'ml-auto'}`}
                style={{ backgroundColor: profile.whatsapp_color || '#25D366' }}
                aria-label="Contactar por WhatsApp"
              >
                {/* WhatsApp Icon SVG */}
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>
        )
      }
    </div >
  );
}
