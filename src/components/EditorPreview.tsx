import React, { memo } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
    Instagram,
    Twitter,
    Youtube,
    Facebook,
    Globe,
    Mail,
    Linkedin,
    X,
    MessageCircle,
    Phone,
    Music,
    MapPin,
    Smile,
    Store,
    Heart,
    Palette
} from 'lucide-react';

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

const ICON_MAP: { [key: string]: any } = {
    'instagram': Instagram,
    'twitter': Twitter,
    'facebook': Facebook,
    'youtube': Youtube,
    'linkedin': Linkedin,
    'globe': Globe,
    'mail': Mail,
    'message-circle': MessageCircle,
    'phone': Phone,
    'music': Music,
    'map-pin': MapPin,
    'behance': Palette,
    'store': Store,
    'heart': Heart,
    'smile': Smile
};

interface GalleryImage {
    id: string;
    profile_id: string;
    image_url: string;
    position: number;
    description?: string;
    link?: string;
}

interface Theme {
    id: string;
    name: string;
    type: 'gradient' | 'image' | 'texture';
    value: string;
    backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'round' | 'space';
    backgroundSize?: 'auto' | 'cover' | 'contain' | 'initial' | 'inherit' | string;
}

interface EditorPreviewProps {
    backgroundImageUrl: string | null;
    theme: Theme | string;
    currentTheme: Theme; // Pasamos el tema resuelto para evitar lógica repetida
    backgroundSize: string;
    backgroundPosition: string;
    backgroundRepeat: string;
    profileImage: string;
    displayName: string;
    textColor: string;
    bio: string;
    socials?: {
        instagram: string;
        twitter: string;
        linkedin: string;
    };
    youtubeUrl?: string;
    facebookUrl?: string;
    websiteUrl?: string;
    emailUrl?: string;
    links: Link[];
    linkColor: string;
    galleryImages: GalleryImage[];
    globalButtonColor: string;
    whatsappActive?: boolean;
    whatsappNumber?: string;
    whatsappMessage?: string;
    whatsappPosition?: 'left' | 'right';
    whatsappColor?: string;
}

const EditorPreviewString = ({
    backgroundImageUrl,
    theme,
    currentTheme,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
    profileImage,
    displayName,
    textColor,
    bio,
    socials,
    youtubeUrl,
    facebookUrl,
    websiteUrl,
    emailUrl,
    links,
    linkColor,
    galleryImages,
    globalButtonColor,
    whatsappActive,
    whatsappNumber,
    whatsappMessage,
    whatsappPosition = 'right',
    whatsappColor = '#25D366'
}: EditorPreviewProps) => {
    return (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl mb-3 sm:mb-4">Vista Previa</h2>
            <div className="border-4 border-gray-300 rounded-3xl overflow-hidden relative" style={{ aspectRatio: '9/19.5' }}>
                <div
                    className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                    style={{
                        backgroundImage: backgroundImageUrl
                            ? `url(${backgroundImageUrl})`
                            : (typeof theme === 'string' && currentTheme ? currentTheme.value : undefined),
                        backgroundSize: backgroundImageUrl
                            ? backgroundSize
                            : (currentTheme?.backgroundSize || 'cover'),
                        backgroundPosition: backgroundImageUrl ? backgroundPosition : 'center',
                        backgroundRepeat: backgroundImageUrl
                            ? backgroundRepeat
                            : (currentTheme?.backgroundRepeat || 'no-repeat'),
                        backgroundColor: !backgroundImageUrl && (!currentTheme || currentTheme.type !== 'gradient') ? '#ffffff' : undefined
                    }}
                >
                    <div className="p-8 flex flex-col items-center min-h-full">
                        <ImageWithFallback
                            src={profileImage}
                            alt={displayName}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                        />
                        <h1 className="text-2xl mb-2 text-center font-bold break-words w-full" style={{ color: textColor }}>
                            {displayName || 'Tu Nombre'}
                        </h1>
                        <p className="text-center mb-6 break-words w-full" style={{ color: textColor }}>
                            {bio || 'Tu biografía irá aquí...'}
                        </p>


                        {/* Links */}
                        <div className="w-full space-y-3 mb-6">
                            {links.map((link) => {
                                const Icon = link.icon_key ? ICON_MAP[link.icon_key] : null;
                                return (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-3 px-4 bg-white rounded-full text-center shadow-md hover:scale-105 transition break-words relative flex items-center justify-center"
                                        style={{
                                            color: link.text_color || linkColor,
                                            backgroundColor: link.button_color || globalButtonColor
                                        }}
                                    >
                                        {Icon && (
                                            <Icon
                                                size={20}
                                                className="absolute left-4"
                                                style={{ color: link.icon_color || 'inherit' }}
                                            />
                                        )}
                                        <span className="mx-auto">{link.title}</span>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Gallery */}
                        {galleryImages.length > 0 && (
                            <div className="w-full mb-16">
                                <h3 className="text-lg mb-3 font-semibold text-center" style={{ color: textColor }}>
                                    Galería
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {galleryImages.map((image) => (
                                        <div key={image.id} className="space-y-2">
                                            {image.link ? (
                                                <a
                                                    href={image.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block group"
                                                >
                                                    <img
                                                        src={image.image_url}
                                                        alt={image.description || 'Galería'}
                                                        className="w-full h-32 object-cover rounded-lg shadow-sm hover:opacity-90 transition"
                                                    />
                                                </a>
                                            ) : (
                                                <img
                                                    src={image.image_url}
                                                    alt={image.description || 'Galería'}
                                                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                                                />
                                            )}
                                            {image.description && (
                                                <p className="text-xs text-center" style={{ color: textColor }}>
                                                    {image.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* WhatsApp Floating Button */}
                {whatsappActive && whatsappNumber && (
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`absolute bottom-6 ${whatsappPosition === 'left' ? 'left-6' : 'right-6'} z-50 hover:scale-110 transition-transform duration-300 drop-shadow-lg`}
                        style={{ color: whatsappColor }}
                    >
                        <div className="bg-white rounded-full p-1 shadow-lg">
                            <div className="rounded-full p-2" style={{ backgroundColor: whatsappColor }}>
                                <MessageCircle size={32} className="text-white" />
                            </div>
                        </div>
                    </a>
                )}
            </div>

            {/* Footer Credit */}
            <div className="mt-8 pb-20 text-center relative z-10">
                <a
                    href="https://clipli.top"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-xs font-medium text-gray-800 hover:bg-white transition-colors pointer-events-auto"
                >
                    Creado con clipli.top
                </a>
            </div>
        </div>
    );
};

export const EditorPreview = memo(EditorPreviewString);
