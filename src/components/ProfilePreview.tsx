import { ImageWithFallback } from './figma/ImageWithFallback';
import { Instagram, Twitter, Globe, Mail } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  type: 'gradient' | 'image';
  value: string;
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'round' | 'space';
  backgroundSize?: 'auto' | 'cover' | 'contain' | 'initial' | 'inherit' | string;
}

export function ProfilePreview({ onViewProfile }: { onViewProfile?: (username: string) => void }) {
  const examples: {
    name: string;
    username: string;
    avatar: string;
    bio: string;
    theme: Theme;
    links: string[];
  }[] = [
    {
      name: 'María González',
      username: '@mariag',
      avatar: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0OTYzNTgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Creadora de Contenido de Moda',
      theme: { id: 'pink-orange', name: 'Rosa Naranja', type: 'gradient', value: 'from-pink-500 to-orange-500' },
      links: ['Último Look', 'Mi Tienda', 'Suscríbete'],
    },
    {
      name: 'Alex Rivera',
      username: '@alexrivera',
      avatar: 'https://images.unsplash.com/photo-1690883793939-f8cca2f28ee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzb2NpYWwlMjBtZWRpYSUyMHBob25lfGVufDF8fHx8MTc2NTA0NjMwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Reviews y Tutoriales de Tech',
      theme: { id: 'blue-purple', name: 'Azul Púrpura', type: 'gradient', value: 'from-blue-500 to-purple-500' },
      links: ['Canal YouTube', 'Newsletter', 'Consultoría'],
    },
    {
      name: 'Emma Creativa',
      username: '@emmacrea',
      avatar: 'https://images.unsplash.com/photo-1519217651866-847339e674d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjUwMDIxODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Artista Digital & Diseñadora',
      theme: { id: 'green-teal', name: 'Verde Azulado', type: 'gradient', value: 'from-green-500 to-teal-500' },
      links: ['Portfolio', 'Comprar Arte', 'Comisiones'],
    },
    {
      name: 'Carlos Viajero',
      username: '@carlosviajero',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWxlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTA0NjMwNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      bio: 'Explorador del Mundo',
      theme: { id: 'rainy_night', name: 'Noche Lluviosa', type: 'image', value: 'https://cdn.bio.link/themes/backgrounds/rainy_night.jpg', backgroundRepeat: 'no-repeat' },
      links: ['Blog de Viajes', 'Guías', 'Contacto'],
    },
  ];

  const handleSocialClick = (social: string) => {
    console.log(`Navegando a ${social}`);
    alert(`Abriendo ${social}...`);
  };

  const handleLinkClick = (link: string) => {
    console.log(`Navegando a ${link}`);
    alert(`Abriendo: ${link}`);
  };

  return (
    <div id="ejemplos" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl mb-4">
            Únete a creadores de todo el mundo
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Desde influencers hasta emprendedores, millones confían en Clipli.top para compartir su contenido
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {examples.map((example, index) => (
            <div
                key={index}
                onClick={() => onViewProfile?.(example.username.replace('@', ''))}
                className="group relative p-[2px] rounded-3xl overflow-hidden cursor-pointer"
                style={example.theme.type === 'image' ? { backgroundImage: `url(${example.theme.value})`, backgroundSize: example.theme.backgroundSize || 'contain', backgroundPosition: 'center', backgroundRepeat: example.theme.backgroundRepeat || 'no-repeat' } : { backgroundImage: `linear-gradient(to br, ${example.theme.value.replace('from-', '').replace('to-', '')})` }}
              >
                <div className="absolute inset-0 opacity-100 group-hover:opacity-80 transition"></div>
              <div className="relative bg-white rounded-3xl p-6 md:p-8">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <ImageWithFallback
                    src={example.avatar}
                    alt={example.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <h3 className="text-lg md:text-xl">{example.name}</h3>
                    <p className="text-gray-600 text-sm md:text-base">{example.username}</p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">{example.bio}</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleSocialClick('Instagram')}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition cursor-pointer active:scale-95"
                    >
                      <Instagram size={16} />
                    </button>
                    <button 
                      onClick={() => handleSocialClick('Twitter')}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition cursor-pointer active:scale-95"
                    >
                      <Twitter size={16} />
                    </button>
                    <button 
                      onClick={() => handleSocialClick('Website')}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition cursor-pointer active:scale-95"
                    >
                      <Globe size={16} />
                    </button>
                    <button 
                      onClick={() => handleSocialClick('Email')}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition cursor-pointer active:scale-95"
                    >
                      <Mail size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {example.links.map((link, linkIndex) => (
                    <button
                      key={linkIndex}
                      onClick={() => handleLinkClick(link)}
                      className={`w-full ${
                        linkIndex === 0
                          ? example.theme.type === 'image'
                            ? 'bg-cover bg-center text-white'
                            : `bg-gradient-to-br ${example.theme.value} text-white`
                          : 'bg-gray-50 hover:bg-gray-100'
                      } rounded-xl p-3 md:p-4 text-center cursor-pointer transition active:scale-95 text-sm md:text-base`}
                      style={linkIndex === 0 && example.theme.type === 'image' ? { backgroundImage: `url(${example.theme.value})`, backgroundRepeat: example.theme.backgroundRepeat || 'no-repeat', backgroundSize: example.theme.backgroundSize || 'contain' } : {}}
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 md:px-12 py-3 md:py-4 bg-black text-white rounded-full hover:bg-gray-800 transition text-base md:text-lg"
          >
            Crea tu página gratis
          </button>
        </div>
      </div>
    </div>
  );
}