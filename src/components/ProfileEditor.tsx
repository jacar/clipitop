import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase, TABLES } from '../lib/supabase';
import { uploadProfileImage, uploadBackgroundImage, uploadGalleryImage, checkUsernameAvailability, deleteImage } from '../lib/supabase-functions';

// ... lines 5-550 ...


import { Analytics } from './Analytics';
import { getTemplateById } from '../lib/templates';
import { copyToClipboard } from '../lib/clipboard';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Eye,
  BarChart3,
  Save,
  Share2,
  LogOut,
  X,
  Settings,
  Camera,
  Check,
  Plus,
  GripVertical,
  Trash2,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Globe,
  Mail,
  Download,
  Copy,
  Palette,
  Linkedin,
  MessageCircle,
  Phone,
  Music,
  MapPin,
  Smile,
  Store,
  Heart,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Footer } from './Footer';
import { EditorPreview } from './EditorPreview';

interface ProfileEditorProps {
  onClose: () => void;
  user: any;
  onLogout: () => void;
  selectedTemplate?: string | null;
  onNavigate?: (page: string) => void;
}

interface Link {
  id: string;
  title: string;
  url: string;
  position: number;
  button_color?: string;
  text_color?: string;
  icon_key?: string;
  icon_color?: string;
}

const ICON_OPTIONS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'twitter', label: 'X / Twitter', icon: Twitter },
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'youtube', label: 'YouTube', icon: Youtube },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'globe', label: 'Web', icon: Globe },
  { key: 'mail', label: 'Mail', icon: Mail },
  { key: 'message-circle', label: 'WhatsApp', icon: MessageCircle },
  { key: 'phone', label: 'Teléfono', icon: Phone },
  { key: 'music', label: 'Música', icon: Music },
  { key: 'map-pin', label: 'Ubicación', icon: MapPin },
  { key: 'behance', label: 'Behance', icon: Palette }, // Using Palette as proxy
  { key: 'store', label: 'Tienda', icon: Store },
  { key: 'heart', label: 'Favorito', icon: Heart },
  { key: 'smile', label: 'Smile', icon: Smile },
];

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
  link?: string;
  created_at: string;
}

export function ProfileEditor({ onClose, user, onLogout, selectedTemplate, onNavigate }: ProfileEditorProps) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcG9ydHJhaXQ%3D&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=ref...');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [backgroundSize, setBackgroundSize] = useState<'auto' | 'cover' | 'contain'>('cover');
  const [backgroundPosition, setBackgroundPosition] = useState<'center' | 'top' | 'bottom' | 'left' | 'right'>('center');
  const [backgroundRepeat, setBackgroundRepeat] = useState<'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'>('no-repeat');
  const [profileId, setProfileId] = useState<string | null>(null);
  const [links, setLinks] = useState<Link[]>([]);

  const [theme, setTheme] = useState<Theme | string>('purple');
  const [showPreview, setShowPreview] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBackgroundImage, setUploadingBackgroundImage] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [globalButtonColor, setGlobalButtonColor] = useState('#ffffff'); // Default button color
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [textColor, setTextColor] = useState('#FFFFFF'); // Default to white text
  const [linkColor, setLinkColor] = useState('#FFFFFF'); // Default to white link color
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);

  // WhatsApp Floating Button State
  const [whatsappActive, setWhatsappActive] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [whatsappPosition, setWhatsappPosition] = useState<'left' | 'right'>('right');
  const [whatsappColor, setWhatsappColor] = useState('#25D366');

  /* New state for Share Modal */
  const [showShareModal, setShowShareModal] = useState(false);




  const themes: Theme[] = [
    // Gradientes Vibrantes
    { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'linear-gradient(to right, #9333ea, #db2777)' },
    { id: 'blue', name: 'Azul', type: 'gradient', value: 'linear-gradient(to right, #2563eb, #06b6d4)' },
    { id: 'green', name: 'Verde', type: 'gradient', value: 'linear-gradient(to right, #16a34a, #14b8a6)' },
    { id: 'orange', name: 'Naranja', type: 'gradient', value: 'linear-gradient(to right, #ea580c, #dc2626)' },
    { id: 'red-yellow', name: 'Rojo-Amarillo', type: 'gradient', value: 'linear-gradient(to right, #ef4444, #eab308)' },
    { id: 'cyan-blue', name: 'Cian-Azul', type: 'gradient', value: 'linear-gradient(to right, #06b6d4, #3b82f6)' },
    { id: 'pink-purple', name: 'Rosa-Púrpura', type: 'gradient', value: 'linear-gradient(to right, #ec4899, #a855f7)' },
    { id: 'teal-green', name: 'Teal-Verde', type: 'gradient', value: 'linear-gradient(to right, #14b8a6, #22c55e)' },
    { id: 'indigo-violet', name: 'Índigo-Violeta', type: 'gradient', value: 'linear-gradient(to right, #6366f1, #8b5cf6)' },

    // Gradientes Sunset/Sunrise
    { id: 'sunset', name: 'Atardecer', type: 'gradient', value: 'linear-gradient(to right, #f97316, #ec4899, #9333ea)' },
    { id: 'sunrise', name: 'Amanecer', type: 'gradient', value: 'linear-gradient(to right, #facc15, #fb923c, #ec4899)' },
    { id: 'ocean', name: 'Océano', type: 'gradient', value: 'linear-gradient(to right, #60a5fa, #06b6d4, #0d9488)' },
    { id: 'forest', name: 'Bosque', type: 'gradient', value: 'linear-gradient(to right, #4ade80, #10b981, #0d9488)' },
    { id: 'fire', name: 'Fuego', type: 'gradient', value: 'linear-gradient(to right, #ef4444, #f97316, #facc15)' },

    // Gradientes Pastel
    { id: 'pastel-pink', name: 'Rosa Pastel', type: 'gradient', value: 'linear-gradient(to right, #fbcfe8, #e9d5ff)' },
    { id: 'pastel-blue', name: 'Azul Pastel', type: 'gradient', value: 'linear-gradient(to right, #bfdbfe, #a5f3fc)' },
    { id: 'pastel-green', name: 'Verde Pastel', type: 'gradient', value: 'linear-gradient(to right, #bbf7d0, #99f6e4)' },
    { id: 'pastel-rainbow', name: 'Arcoíris Pastel', type: 'gradient', value: 'linear-gradient(to right, #fbcfe8, #e9d5ff, #bfdbfe)' },

    // Gradientes Oscuros/Nocturnos
    { id: 'dark-purple', name: 'Púrpura Oscuro', type: 'gradient', value: 'linear-gradient(to right, #581c87, #312e81)' },
    { id: 'dark-blue', name: 'Azul Oscuro', type: 'gradient', value: 'linear-gradient(to right, #1e3a8a, #0f172a)' },
    { id: 'midnight', name: 'Medianoche', type: 'gradient', value: 'linear-gradient(to right, #0f172a, #581c87, #0f172a)' },
    { id: 'aurora', name: 'Aurora', type: 'gradient', value: 'linear-gradient(to right, #4ade80, #3b82f6, #9333ea)' },

    // Colores Sólidos Modernos
    { id: 'solid-black', name: 'Negro', type: 'gradient', value: 'linear-gradient(to right, #111827, #111827)' },
    { id: 'solid-white', name: 'Blanco', type: 'gradient', value: 'linear-gradient(to right, #ffffff, #ffffff)' },
    { id: 'solid-navy', name: 'Azul Marino', type: 'gradient', value: 'linear-gradient(to right, #1e3a8a, #1e3a8a)' },
    { id: 'solid-emerald', name: 'Esmeralda', type: 'gradient', value: 'linear-gradient(to right, #059669, #059669)' },
    { id: 'solid-rose', name: 'Rosa', type: 'gradient', value: 'linear-gradient(to right, #f43f5e, #f43f5e)' },

    // Texturas y Patrones
    { id: 'stripes-blue', name: 'Rayas Azules', type: 'texture', value: 'repeating-linear-gradient(45deg, #e0f2f7, #e0f2f7 10px, #b3e5fc 10px, #b3e5fc 20px)' },
    { id: 'stripes-purple', name: 'Rayas Púrpura', type: 'texture', value: 'repeating-linear-gradient(45deg, #f3e5f5, #f3e5f5 10px, #e1bee7 10px, #e1bee7 20px)' },
    { id: 'dots-grey', name: 'Puntos Grises', type: 'texture', value: 'repeating-radial-gradient(circle, #e0e0e0, #e0e0e0 2px, #f5f5f5 2px, #f5f5f5 10px)' },
    { id: 'dots-colorful', name: 'Puntos Coloridos', type: 'texture', value: 'repeating-radial-gradient(circle, #fce4ec, #fce4ec 2px, #f8bbd0 2px, #f8bbd0 10px)' },
    { id: 'grid-light', name: 'Cuadrícula Clara', type: 'texture', value: 'linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px)' },
    { id: 'grid-dark', name: 'Cuadrícula Oscura', type: 'texture', value: 'linear-gradient(to right, rgba(100, 100, 100, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(100, 100, 100, 0.3) 1px, transparent 1px)' },
    { id: 'honeycomb', name: 'Panal', type: 'texture', value: 'repeating-conic-gradient(#f0f0f0 0% 25%, #e0e0e0 0% 50%) 0 0 / 20px 20px' },
    { id: 'waves', name: 'Olas', type: 'texture', value: 'repeating-linear-gradient(0deg, #e3f2fd, #e3f2fd 10px, #bbdefb 10px, #bbdefb 20px)' },
    { id: 'diagonal', name: 'Diagonal', type: 'texture', value: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 20px)' },
  ];

  // Cargar perfil existente o crear uno nuevo
  useEffect(() => {
    loadProfile();
  }, [user]);

  // Aplicar plantilla seleccionada
  useEffect(() => {
    if (selectedTemplate) {
      const template = getTemplateById(selectedTemplate);
      if (template) {
        setDisplayName(template.profession);
        setBio(template.description);
        setTheme(template.theme);
        if (template.theme.type === 'image') {
          setBackgroundSize((template.theme.backgroundSize as any) || 'contain');
          setBackgroundRepeat((template.theme.backgroundRepeat as any) || 'no-repeat');
        }
        setLinks(template.defaultLinks.map((link, index) => ({
          id: Date.now().toString() + index,
          title: link.title,
          url: link.url,
          position: index,
        })));
      }
    }
  }, [selectedTemplate, profileId]);

  // Verificar disponibilidad de username
  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      // No verificar si es el username actual del perfil
      if (profileId) {
        const { data: currentProfile } = await supabase
          .from(TABLES.PROFILES)
          .select('username')
          .eq('id', profileId)
          .single();

        if (currentProfile?.username === username) {
          setUsernameAvailable(true);
          return;
        }
      }

      setCheckingUsername(true);
      const available = await checkUsernameAvailability(username);
      setUsernameAvailable(available);
      setCheckingUsername(false);
    };

    const timeout = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeout);
  }, [username, profileId]);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (!user) return;
    const draft = {
      username, displayName, bio, profileImage, backgroundImageUrl, theme,
      textColor, linkColor,
      whatsappActive, whatsappNumber, whatsappMessage, whatsappPosition, whatsappColor,
      links, galleryImages,
      backgroundSize, backgroundRepeat,
      timestamp: Date.now()
    };
    localStorage.setItem(`biolink_draft_${user.id}`, JSON.stringify(draft));
  }, [
    username, displayName, bio, profileImage, backgroundImageUrl, theme,
    textColor, linkColor,
    whatsappActive, whatsappNumber, whatsappMessage, whatsappPosition, whatsappColor,
    links, galleryImages,
    backgroundSize, backgroundRepeat,
    user
  ]);

  // Restore draft if exists and newer/relevant? 
  // For now, let's just make sure it's saved so if they accidentally reload, we can restore it.
  // We need to modify loadProfile to check for this?
  // Or add a "Restore Draft" button? 
  // Let's modify loadProfile to check if we are creating a *new* profile but have a draft.


  const loadProfile = async () => {
    if (!user) return;

    try {
      // Buscar perfil existente
      const { data } = await supabase
        .from(TABLES.PROFILES)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const profile = data && data.length > 0 ? data[0] : null;

      if (profile) {
        setProfileId(profile.id);
        setUsername(profile.username);
        setDisplayName(profile.display_name);
        setBio(profile.bio || '');
        setProfileImage(profile.profile_image || profileImage);
        setBackgroundImageUrl(profile.background_image_url || null);
        if (typeof profile.theme === 'string') {
          setTheme(profile.theme || 'purple');
        } else {
          setTheme(profile.theme || 'purple');
          setBackgroundSize(profile.theme.backgroundSize || 'cover');
          setBackgroundRepeat(profile.theme.backgroundRepeat || 'no-repeat');
          setGlobalButtonColor(profile.theme.buttonColor || '#ffffff');
        }

        setTextColor(profile.text_color || '#FFFFFF');
        setLinkColor(profile.link_color || '#FFFFFF');

        // Load WhatsApp settings
        setWhatsappActive(profile.whatsapp_active || false);
        setWhatsappNumber(profile.whatsapp_number || '');
        setWhatsappMessage(profile.whatsapp_message || '');
        setWhatsappPosition(profile.whatsapp_position || 'right');
        setWhatsappColor(profile.whatsapp_color || '#25D366');

        // Cargar enlaces
        const { data: linksData } = await supabase
          .from(TABLES.LINKS)
          .select('*')
          .eq('profile_id', profile.id)
          .order('position', { ascending: true });

        if (linksData) {
          setLinks(linksData);
        }

        // Cargar galería
        const { data: galleryData } = await supabase
          .from(TABLES.GALLERY_IMAGES)
          .select('*')
          .eq('profile_id', profile.id)
          .order('position', { ascending: true });

        if (galleryData) {
          setGalleryImages(galleryData);
        }
      } else {
        // Check for local draft first
        const savedDraft = localStorage.getItem(`biolink_draft_${user.id}`);
        if (savedDraft) {
          try {
            const draft = JSON.parse(savedDraft);
            // Optional: Check if draft is "recent" or ask user? For now just load it to prevent data loss.
            setUsername(draft.username || '');
            setDisplayName(draft.displayName || '');
            setBio(draft.bio || '');
            setProfileImage(draft.profileImage || profileImage);
            setBackgroundImageUrl(draft.backgroundImageUrl || null);
            setTheme(draft.theme || 'purple');
            setBackgroundSize(draft.backgroundSize || 'cover');
            setBackgroundRepeat(draft.backgroundRepeat || 'no-repeat');
            setTextColor(draft.textColor || '#FFFFFF');
            setLinkColor(draft.linkColor || '#FFFFFF');
            setWhatsappActive(draft.whatsappActive || false);
            setWhatsappNumber(draft.whatsappNumber || '');
            setWhatsappMessage(draft.whatsappMessage || '');
            setWhatsappPosition(draft.whatsappPosition || 'right');
            setWhatsappColor(draft.whatsappColor || '#25D366');
            setLinks(draft.links || []);
            setGalleryImages(draft.galleryImages || []);
          } catch (e) {
            console.error('Error loading draft', e);
            // Fallback to default
            const defaultUsername = user.email?.split('@')[0] || 'usuario';
            setUsername(defaultUsername);
            setDisplayName('Mi Nombre');
            setBio('Creador de contenido');
          }
        } else {
          // Perfil nuevo - usar email como username por defecto
          const defaultUsername = user.email?.split('@')[0] || 'usuario';
          setUsername(defaultUsername);
          setDisplayName('Mi Nombre');
          setBio('Creador de contenido');
        }
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user || !username.trim()) {
      alert('Por favor ingresa un nombre de usuario');
      return;
    }

    setSaving(true);

    try {
      let currentProfileId = profileId;

      // Crear o actualizar perfil
      if (profileId) {
        // Actualizar
        const { error } = await supabase
          .from(TABLES.PROFILES)
          .update({
            username: username.trim(),
            display_name: displayName,
            bio,
            profile_image: profileImage,
            background_image_url: backgroundImageUrl,
            theme: typeof theme === 'string'
              ? {
                ...(themes.find((t) => t.id === theme) || themes[0]),
                backgroundSize,
                backgroundRepeat,
                buttonColor: globalButtonColor,
              }
              : {
                ...theme,
                backgroundSize,
                backgroundRepeat,
                buttonColor: globalButtonColor,
              },
            text_color: textColor,
            link_color: linkColor,
          })
          .eq('id', profileId);

        if (error) throw error;
      } else {
        // Crear nuevo
        const { data, error } = await supabase
          .from(TABLES.PROFILES)
          .insert({
            user_id: user.id,
            username: username.trim(),
            display_name: displayName,
            bio,
            profile_image: profileImage,
            background_image_url: backgroundImageUrl,
            theme: typeof theme === 'string'
              ? { ...(themes.find(t => t.id === theme) || themes[0]), backgroundSize, backgroundRepeat }
              : { ...theme, backgroundSize, backgroundRepeat },
            text_color: textColor,
            link_color: linkColor,
          })
          .select()
          .single();

        if (error) throw error;
        currentProfileId = data.id;
        setProfileId(data.id);
      }

      // Guardar enlaces
      if (currentProfileId) {
        // Eliminar enlaces existentes
        await supabase
          .from(TABLES.LINKS)
          .delete()
          .eq('profile_id', currentProfileId);

        // Insertar nuevos enlaces
        if (links.length > 0) {
          const linksToInsert = links.map((link, index) => ({
            profile_id: currentProfileId,
            title: link.title,
            url: link.url,
            position: index,
            button_color: link.button_color,
            text_color: link.text_color,
            icon_key: link.icon_key,
            icon_color: link.icon_color
          }));

          const { error: linksError } = await supabase
            .from(TABLES.LINKS)
            .insert(linksToInsert);

          if (linksError) throw linksError;
        }



        // Guardar galería
        await supabase
          .from(TABLES.GALLERY_IMAGES)
          .delete()
          .eq('profile_id', currentProfileId);

        if (galleryImages.length > 0) {
          const galleryToInsert = galleryImages.map((image, index) => ({
            profile_id: currentProfileId,
            image_url: image.image_url,
            position: index,
            description: image.description,
          }));

          await supabase.from(TABLES.GALLERY_IMAGES).insert(galleryToInsert);
        }

      }



      // Open Share Modal on success instead of alert
      setShowShareModal(true);
    } catch (error: any) {
      console.error('Error guardando perfil:', error);
      if (error.code === '23505') {
        alert('Este nombre de usuario ya está en uso. Por favor elige otro.');
      } else {
        alert('Error al guardar: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    const newLink: Link = {
      id: Date.now().toString(),
      title: 'Nuevo Enlace',
      url: 'https://',
      position: links.length,
    };
    setLinks([...links, newLink]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const updateLink = (id: string, field: Exclude<keyof Link, 'id' | 'position'>, value: string) => {
    setLinks(links.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const moveLink = (id: string, direction: 'up' | 'down') => {
    const index = links.findIndex(l => l.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === links.length - 1) return;

    const newLinks = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];

    // Update positions explicitly if needed (though order in array is usually enough for UI, DB sync might need positions)
    const updatedLinks = newLinks.map((link, idx) => ({ ...link, position: idx }));

    setLinks(updatedLinks);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadProfileImage(file, user.id);
      setProfileImage(imageUrl || profileImage);
    } catch (error) {
      console.error('Error subiendo imagen de perfil:', error);
      alert('Error al subir la imagen de perfil');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleBackgroundImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBackgroundImage(true);
    try {
      const imageUrl = await uploadBackgroundImage(file, user.id);
      setBackgroundImageUrl(imageUrl);
    } catch (error) {
      console.error('Error subiendo imagen de fondo:', error);
      alert('Error al subir la imagen de fondo');
    } finally {
      setUploadingBackgroundImage(false);
      e.target.value = '';
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGalleryImage(true);
    try {
      // Función uploadGalleryImage debe ser importada y definida
      const imageUrl = await uploadGalleryImage(file, user.id);
      setGalleryImages([...galleryImages, {
        id: Date.now().toString(),
        profile_id: profileId || '',
        image_url: imageUrl || '',
        position: galleryImages.length,
        created_at: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error subiendo imagen a la galería:', error);
      alert('Error al subir la imagen a la galería');
    } finally {
      setUploadingGalleryImage(false);
      e.target.value = '';
    }
  };

  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replacingImageId, setReplacingImageId] = useState<string | null>(null);

  const handleReplaceClick = (id: string) => {
    setReplacingImageId(id);
    replaceFileInputRef.current?.click();
  };

  const handleReplaceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingImageId) return;

    setUploadingGalleryImage(true);
    try {
      const imageUrl = await uploadGalleryImage(file, user.id);
      setGalleryImages(galleryImages.map(img =>
        img.id === replacingImageId ? { ...img, image_url: imageUrl || '' } : img
      ));
    } catch (error) {
      console.error('Error reemplazando imagen:', error);
      alert('Error al reemplazar la imagen');
    } finally {
      setUploadingGalleryImage(false);
      setReplacingImageId(null);
      e.target.value = '';
    }
  };

  const removeGalleryImage = async (id: string) => {
    if (!confirm('¿Estás seguro de querer eliminar esta imagen?')) return;

    const imageToDelete = galleryImages.find(image => image.id === id);
    if (imageToDelete) {
      await deleteImage('gallery-images', imageToDelete.image_url);
    }
    setGalleryImages(galleryImages.filter(image => image.id !== id));
  };

  const updateGalleryImageDescription = (id: string, description: string) => {
    setGalleryImages(galleryImages.map(image =>
      image.id === id ? { ...image, description } : image
    ));
  };

  const updateGalleryImageLink = (id: string, link: string) => {
    setGalleryImages(galleryImages.map(image =>
      image.id === id ? { ...image, link } : image
    ));
  };

  const moveGalleryImage = (id: string, direction: 'up' | 'down') => {
    const index = galleryImages.findIndex(img => img.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === galleryImages.length - 1) return;

    const newImages = [...galleryImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];

    setGalleryImages(newImages);
  };

  const handleShare = () => {
    if (!username) return;
    setShowShareModal(true);
  };

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                <img
                  src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logoclic.svg"
                  alt="Clipli.top"
                  className="w-[300px] h-[90px] object-contain"
                />
              </a>
              <span className="text-sm text-gray-500">/ {username}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 sm:px-4 py-2 flex items-center gap-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <Eye size={18} />
                <span className="hidden sm:inline">Vista Previa</span>
              </button>
              {profileId && (
                <button
                  onClick={() => setShowAnalytics(true)}
                  className="px-3 sm:px-4 py-2 flex items-center gap-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                >
                  <BarChart3 size={18} />
                  <span className="hidden sm:inline">Analytics</span>
                </button>
              )}
              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-3 sm:px-4 py-2 flex items-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                <Save size={18} />
                <span className="hidden sm:inline">{saving ? 'Guardando...' : 'Guardar'}</span>
              </button>
              <button
                onClick={handleShare}
                className="px-3 sm:px-4 py-2 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Compartir</span>
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Editor Panel */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Profile Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
                <Settings size={18} className="sm:w-5 sm:h-5" />
                Perfil
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <ImageWithFallback
                      src={profileImage}
                      alt="Perfil"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <label
                      htmlFor="profile-image-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition cursor-pointer"
                    >
                      {uploadingImage ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera size={16} />
                      )}
                    </label>
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Foto de perfil</p>
                    <label
                      htmlFor="profile-image-upload"
                      className="text-sm text-purple-600 hover:underline cursor-pointer"
                    >
                      {uploadingImage ? 'Subiendo...' : 'Cambiar imagen'}
                    </label>
                  </div>
                </div>


                <div className="flex-1">
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    Nombre a mostrar
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Tu Nombre"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="tu_usuario"
                  />
                  {checkingUsername && <p className="text-sm text-gray-500 mt-1">Verificando...</p>}
                  {usernameAvailable === false && !checkingUsername && (
                    <p className="text-sm text-red-500 mt-1">Este nombre de usuario no está disponible.</p>
                  )}
                  {usernameAvailable === true && !checkingUsername && (
                    <p className="text-sm text-green-500 mt-1">Nombre de usuario disponible.</p>
                  )}
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Biografía
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Una breve descripción sobre ti..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Background Image Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl mb-4">Imagen de Fondo</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="background-image-upload"
                    className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-purple-600 transition"
                  >
                    {uploadingBackgroundImage ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Subiendo...</span>
                      </div>
                    ) : (
                      <span className="text-gray-600">
                        {backgroundImageUrl ? 'Cambiar imagen de fondo' : 'Subir imagen de fondo'}
                      </span>
                    )}
                  </label>
                  <input
                    id="background-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                    className="hidden"
                    disabled={uploadingBackgroundImage}
                  />
                </div>
                {backgroundImageUrl && (
                  <>
                    <div className="relative">
                      <img
                        src={backgroundImageUrl}
                        alt="Fondo"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setBackgroundImageUrl(null)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tamaño de fondo
                      </label>
                      <select
                        value={backgroundSize}
                        onChange={(e) => setBackgroundSize(e.target.value as any)}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="cover">Cubrir</option>
                        <option value="contain">Contener</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setBackgroundImageUrl(null)}
                      className="w-full px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 transition"
                    >
                      <Trash2 size={16} />
                      Eliminar imagen de fondo
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Sección de Color de Texto */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <Settings size={20} />
                Color de Texto
              </h2>
              <div>
                <label htmlFor="textColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Color
                </label>
                <input
                  type="color"
                  id="textColor"
                  className="w-full h-10 rounded-md border border-gray-300 cursor-pointer"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </div>
            </div>

            {/* Sección de Color de Enlaces */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <Settings size={20} />
                Color de Enlaces
              </h2>
              <div>
                <label htmlFor="linkColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Color
                </label>
                <input
                  type="color"
                  id="linkColor"
                  className="w-full h-10 rounded-md border border-gray-300 cursor-pointer"
                  value={linkColor}
                  onChange={(e) => setLinkColor(e.target.value)}
                />
              </div>
            </div>

            {/* Sección de Color de Fondo de Botones */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <Palette size={20} />
                Color de Fondo de Botones
              </h2>
              <div>
                <label htmlFor="buttonColor" className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Color
                </label>
                <input
                  type="color"
                  id="buttonColor"
                  className="w-full h-10 rounded-md border border-gray-300 cursor-pointer"
                  value={globalButtonColor}
                  onChange={(e) => setGlobalButtonColor(e.target.value)}
                />
              </div>
            </div>



            {/* Theme Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl mb-3 sm:mb-4">Tema</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-200">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-3 rounded-lg border-2 transition hover:scale-105 ${theme === t.id ? 'border-purple-600 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'
                      }`}
                  >
                    {t.type === 'gradient' && (
                      <div
                        className="w-full h-16 rounded mb-2"
                        style={{ background: t.value }}
                      />
                    )}
                    {t.type === 'texture' && (
                      <div className="w-full h-16 rounded mb-2 bg-white" style={{ background: t.value, backgroundSize: '20px 20px' }} />
                    )}
                    <p className="text-xs font-medium text-center">{t.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Image Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl mb-4">Imagen de Fondo</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="background-image-upload"
                    className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-purple-600 transition"
                  >
                    {uploadingBackgroundImage ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Subiendo...</span>
                      </div>
                    ) : (
                      <span className="text-gray-600">
                        {backgroundImageUrl ? 'Cambiar imagen de fondo' : 'Subir imagen de fondo'}
                      </span>
                    )}
                  </label>
                  <input
                    id="background-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                    className="hidden"
                    disabled={uploadingBackgroundImage}
                  />
                </div>
                {backgroundImageUrl && (
                  <>
                    <div className="relative">
                      <img
                        src={backgroundImageUrl}
                        alt="Fondo"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setBackgroundImageUrl(null)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tamaño de fondo
                      </label>
                      <select
                        value={backgroundSize}
                        onChange={(e) => setBackgroundSize(e.target.value as any)}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="cover">Cubrir</option>
                        <option value="contain">Contener</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Links Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Enlaces</h2>
                <button
                  onClick={addLink}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>
              <div className="space-y-3">
                {links.map((link) => (
                  <div key={link.id} className="p-3 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveLink(link.id, 'up')}
                          disabled={links.indexOf(link) === 0}
                          className="text-gray-400 hover:text-purple-600 disabled:opacity-30 disabled:hover:text-gray-400"
                          title="Mover arriba"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => moveLink(link.id, 'down')}
                          disabled={links.indexOf(link) === links.length - 1}
                          className="text-gray-400 hover:text-purple-600 disabled:opacity-30 disabled:hover:text-gray-400"
                          title="Mover abajo"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                          placeholder="Título del enlace"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <button
                        onClick={() => removeLink(link.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 pl-7 border-t border-gray-200 pt-2 mt-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 font-medium">Fondo:</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="color"
                            value={link.button_color || '#ffffff'}
                            onChange={(e) => updateLink(link.id, 'button_color', e.target.value)}
                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0"
                            title="Color del botón"
                          />
                          {link.button_color && (
                            <button
                              onClick={() => updateLink(link.id, 'button_color', '')}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Restaurar color global"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 font-medium">Texto:</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="color"
                            value={link.text_color || '#000000'}
                            onChange={(e) => updateLink(link.id, 'text_color', e.target.value)}
                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0"
                            title="Color del texto"
                          />
                          {link.text_color && (
                            <button
                              onClick={() => updateLink(link.id, 'text_color', '')}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Restaurar color global"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 pl-7">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icono
                        </label>
                        <select
                          value={link.icon_key || ''}
                          onChange={(e) => updateLink(link.id, 'icon_key', e.target.value)}
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                        >
                          <option value="">Ninguno</option>
                          {ICON_OPTIONS.map((option) => (
                            <option key={option.key} value={option.key}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color Icono
                        </label>
                        <div className="flex gap-2 h-10">
                          <input
                            type="color"
                            value={link.icon_color || '#ffffff'}
                            onChange={(e) => updateLink(link.id, 'icon_color', e.target.value)}
                            className="w-10 h-full rounded border border-gray-300 cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={link.icon_color || ''}
                            onChange={(e) => updateLink(link.id, 'icon_color', e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1 border border-gray-300 rounded-md px-3 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>




            {/* WhatsApp Floating Button Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl flex items-center gap-2">
                  <MessageCircle size={20} className="text-green-500" />
                  WhatsApp Flotante
                </h2>
                <div
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${whatsappActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  onClick={() => setWhatsappActive(!whatsappActive)}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${whatsappActive ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                </div>
              </div>

              {whatsappActive && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de WhatsApp
                    </label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. 573001234567"
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Incluye el código de país sin símbolos (+)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje Predefinido (Opcional)
                    </label>
                    <input
                      type="text"
                      value={whatsappMessage}
                      onChange={(e) => setWhatsappMessage(e.target.value)}
                      placeholder="¡Hola! Me gustaría más información."
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Posición
                      </label>
                      <div className="flex rounded-md shadow-sm">
                        <button
                          onClick={() => setWhatsappPosition('left')}
                          className={`flex-1 px-4 py-2 text-sm border rounded-l-md ${whatsappPosition === 'left'
                            ? 'bg-purple-50 text-purple-700 border-purple-500 z-10'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          Izquierda
                        </button>
                        <button
                          onClick={() => setWhatsappPosition('right')}
                          className={`flex-1 px-4 py-2 text-sm border rounded-r-md -ml-px ${whatsappPosition === 'right'
                            ? 'bg-purple-50 text-purple-700 border-purple-500 z-10'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          Derecha
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color del Botón
                      </label>
                      <div className="flex gap-2 h-10">
                        <input
                          type="color"
                          value={whatsappColor}
                          onChange={(e) => setWhatsappColor(e.target.value)}
                          className="w-10 h-full rounded border border-gray-300 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={whatsappColor}
                          onChange={(e) => setWhatsappColor(e.target.value)}
                          maxLength={7}
                          className="flex-1 border border-gray-300 rounded-md px-3 text-sm uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Galería</h2>
                <label
                  htmlFor="gallery-image-upload"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={18} />
                  Agregar Imagen
                </label>
                <input
                  id="gallery-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryImageUpload}
                  className="hidden"
                  disabled={uploadingGalleryImage}
                />
                <input
                  ref={replaceFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleReplaceImageUpload}
                  className="hidden"
                  disabled={uploadingGalleryImage}
                />
              </div>
              <div className="space-y-4">
                {galleryImages.map((image) => (
                  <div key={image.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex gap-4">
                      <div className="relative group flex-shrink-0">
                        <img
                          src={image.image_url}
                          alt="Galería"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeGalleryImage(image.id)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full shadow-sm hover:scale-110 transition"
                          title="Eliminar imagen"
                        >
                          <X size={14} />
                        </button>
                        <button
                          onClick={() => handleReplaceClick(image.id)}
                          className="absolute bottom-1 right-1 p-1 bg-white text-purple-600 rounded-full shadow-sm hover:scale-110 transition border border-gray-200"
                          title="Cambiar imagen"
                        >
                          <Camera size={14} />
                        </button>
                      </div>


                      <div className="flex flex-col justify-center gap-1 mr-2">
                        <button
                          onClick={() => moveGalleryImage(image.id, 'up')}
                          disabled={galleryImages.indexOf(image) === 0}
                          className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                          title="Mover arriba"
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button
                          onClick={() => moveGalleryImage(image.id, 'down')}
                          disabled={galleryImages.indexOf(image) === galleryImages.length - 1}
                          className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                          title="Mover abajo"
                        >
                          <ChevronDown size={18} />
                        </button>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                          </label>
                          <input
                            type="text"
                            value={image.description || ''}
                            onChange={(e) => updateGalleryImageDescription(image.id, e.target.value)}
                            placeholder="Descripción corta de la imagen"
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link (opcional)
                          </label>
                          <input
                            type="url"
                            value={image.link || ''}
                            onChange={(e) => updateGalleryImageLink(image.id, e.target.value)}
                            placeholder="https://ejemplo.com"
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            <EditorPreview
              backgroundImageUrl={backgroundImageUrl}
              theme={theme}
              currentTheme={typeof theme === 'string' ? themes.find(t => t.id === theme) || themes[0] : theme}
              backgroundSize={backgroundSize}
              backgroundPosition={backgroundPosition}
              backgroundRepeat={backgroundRepeat}
              profileImage={profileImage}
              displayName={displayName}
              textColor={textColor}
              bio={bio}
              links={links}
              linkColor={linkColor}
              galleryImages={galleryImages}
              globalButtonColor={globalButtonColor}
              whatsappActive={whatsappActive}
              whatsappNumber={whatsappNumber}
              whatsappMessage={whatsappMessage}
              whatsappPosition={whatsappPosition}
              whatsappColor={whatsappColor}
            />
          </div>
          {/* Analytics Modal */}
          {
            showAnalytics && profileId && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                    <h2 className="text-2xl">Analytics</h2>
                    <button
                      onClick={() => setShowAnalytics(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="p-6">
                    <Analytics profileId={profileId} onClose={() => setShowAnalytics(false)} />
                  </div>
                </div>
              </div>
            )
          }
          {/* Share Modal with QR */}
          {
            showShareModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
                  <div className="flex justify-end mb-2">
                    <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                  </div>

                  <h2 className="text-2xl font-bold mb-2">¡Tu Biolink está listo!</h2>
                  <p className="text-gray-600 mb-6">Comparte tu enlace con el mundo</p>

                  <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 inline-block mb-6">
                    <QRCodeCanvas
                      value={`https://clipli.top/${username}`}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        const url = `https://clipli.top/${username}`;
                        copyToClipboard(url);
                        alert('¡Enlace copiado!');
                      }}
                      className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2"
                    >
                      <Copy size={20} />
                      Copiar Enlace
                    </button>

                    <a
                      href={`https://clipli.top/${username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
                    >
                      <Eye size={20} />
                      Ver mi Biolink
                    </a>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div >
      <Footer />
    </div >
  );
}
