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
    X
} from 'lucide-react';

interface Link {
    id: string;
    title: string;
    url: string;
    position: number;
    button_color?: string;
    text_color?: string;
}

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
    socials: {
        instagram: string;
        twitter: string;
        linkedin: string;
    };
    youtubeUrl: string;
    facebookUrl: string;
    websiteUrl: string;
    emailUrl: string;
    links: Link[];
    linkColor: string;
    galleryImages: GalleryImage[];
    whatsappActive: boolean;
    whatsappNumber: string;
    whatsappMessage: string;
    whatsappPosition: string;
    whatsappColor: string;
    globalButtonColor: string; // New prop
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
    whatsappActive,
    whatsappNumber,
    whatsappMessage,
    whatsappPosition,
    whatsappColor,
    globalButtonColor // New prop
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

                        {/* Social Icons */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            {socials.instagram && (
                                <a
                                    href={`https://instagram.com/${socials.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                                >
                                    <Instagram size={20} className="text-pink-600" />
                                </a>
                            )}
                            {socials.twitter && (
                                <a
                                    href={`https://twitter.com/${socials.twitter.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                                >
                                    {/* X Icon */}
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-black"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                                </a>
                            )}
                            {youtubeUrl && (
                                <a
                                    href={youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                                >
                                    <Youtube size={20} className="text-red-600" />
                                </a>
                            )}
                            {facebookUrl && (
                                <a
                                    href={facebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                                >
                                    <Facebook size={20} className="text-blue-600" />
                                </a>
                            )}
                            {socials.linkedin && (
                                <a
                                    href={`https://linkedin.com/in/${socials.linkedin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                                >
                                    <Linkedin size={20} className="text-blue-700" />
                                </a>
                            )}
                            {websiteUrl && (
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                                >
                                    <Globe size={20} className="text-green-600" />
                                </a>
                            )}
                            {emailUrl && (
                                <a
                                    href={`mailto:${emailUrl}`}
                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                                >
                                    <Mail size={20} className="text-gray-600" />
                                </a>
                            )}
                        </div>

                        {/* Links */}
                        <div className="w-full space-y-3 mb-6">
                            {links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-3 px-4 bg-white rounded-full text-center shadow-md hover:scale-105 transition break-words"
                                    style={{
                                        color: link.text_color || linkColor,
                                        backgroundColor: link.button_color || globalButtonColor
                                    }}
                                >
                                    {link.title}
                                </a>
                            ))}
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

                {/* Floating WhatsApp Button */}
                {whatsappActive && (
                    <div
                        className={`absolute bottom-6 z-[60] transition-all duration-300 hover:scale-110 ${whatsappPosition === 'left' ? 'left-6' : 'right-6'}`}
                    >
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-white cursor-pointer transition-colors hover:brightness-110"
                            style={{ backgroundColor: whatsappColor }}
                            title="Chat en WhatsApp"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-8 h-8"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const EditorPreview = memo(EditorPreviewString);
