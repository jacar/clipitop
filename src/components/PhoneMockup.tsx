import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PhoneMockupProps {
    variant?: 'purple' | 'blue' | 'green' | 'orange' | 'dark';
    className?: string;
}

export function PhoneMockup({ variant = 'purple', className = '' }: PhoneMockupProps) {
    const getTheme = () => {
        switch (variant) {
            case 'blue':
                return {
                    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
                    button: 'bg-white text-blue-600',
                    text: 'text-blue-900',
                    icon: 'text-blue-500',
                    profile: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60'
                };
            case 'green':
                return {
                    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
                    button: 'bg-white text-green-600',
                    text: 'text-green-900',
                    icon: 'text-green-500',
                    profile: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&auto=format&fit=crop&q=60'
                };
            case 'orange':
                return {
                    bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
                    button: 'bg-white text-orange-600',
                    text: 'text-orange-900',
                    icon: 'text-orange-500',
                    profile: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60'
                };
            case 'dark':
                return {
                    bg: 'bg-gray-900',
                    button: 'bg-gray-800 text-white',
                    text: 'text-white',
                    icon: 'text-gray-400',
                    profile: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60'
                };
            default: // purple
                return {
                    bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
                    button: 'bg-white text-purple-600',
                    text: 'text-purple-900',
                    icon: 'text-purple-600',
                    profile: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
                };
        }
    };

    const theme = getTheme();

    return (
        <div className={`relative w-[280px] h-[560px] bg-black rounded-[3rem] p-3 shadow-2xl ${className}`}>
            <div className={`w-full h-full ${theme.bg} rounded-[2.5rem] overflow-hidden`}>
                {/* Phone Content */}
                <div className="p-6 space-y-6 overflow-y-auto h-full no-scrollbar">
                    <div className="flex flex-col items-center gap-3">
                        <ImageWithFallback
                            src={theme.profile}
                            alt="Perfil"
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="text-center">
                            <h3 className={`text-lg font-bold ${theme.text}`}>@usuario</h3>
                            <p className={`text-xs ${theme.text} opacity-80`}>Creador de contenido</p>
                        </div>
                        <div className="flex gap-3">
                            <Instagram size={18} className={`${theme.icon} cursor-pointer hover:scale-110 transition`} />
                            <Twitter size={18} className={`${theme.icon} cursor-pointer hover:scale-110 transition`} />

                            {/* LinkedIn Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`${theme.icon} cursor-pointer hover:scale-110 transition`}
                            >
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect width="4" height="12" x="2" y="9" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>

                            {/* Globe (Custom) Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`${theme.icon} cursor-pointer hover:scale-110 transition`}
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                <path d="M2 12h20" />
                            </svg>

                            <Youtube size={18} className={`${theme.icon} cursor-pointer hover:scale-110 transition`} />
                            <Facebook size={18} className={`${theme.icon} cursor-pointer hover:scale-110 transition`} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`${theme.button} rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer active:scale-95`}>
                                <p className="text-center text-sm font-medium">Link destacado {i}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
