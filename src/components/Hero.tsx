import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Instagram, Twitter, Youtube, Facebook, Menu, X } from 'lucide-react';
import { ThreeDCarousel } from './ThreeDCarousel';

interface HeroProps {
  onLogin: () => void;
  onSignup: () => void;
  isLoggedIn: boolean;
  user?: any;
  onShowSetup: () => void;
}

export function Hero({ onLogin, onSignup, isLoggedIn, user, onShowSetup }: HeroProps) {
  const [username, setUsername] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleClaim = () => {
    if (username.trim()) {
      onSignup();
    } else {
      alert('Por favor ingresa un nombre de usuario');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative overflow-hidden text-white">
      {/* Background Elements */}
      <div
        className="absolute inset-0 z-0 h-full w-full"
        style={{
          background: 'linear-gradient(90deg, rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)'
        }}
      ></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a href="/" className="hover:opacity-80 transition">
                <img
                  src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logo-blanco.png"
                  alt="Clipli.top"
                  className="w-[300px] h-[90px] object-contain"
                />
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('features')} className="text-white hover:text-white/80 transition font-medium">
                Características
              </button>
              <button onClick={() => scrollToSection('plantillas')} className="text-white hover:text-white/80 transition font-medium">
                Plantillas
              </button>
              <button onClick={() => scrollToSection('precios')} className="text-white hover:text-white/80 transition font-medium">
                Precios
              </button>
              {!isLoggedIn ? (
                <>
                  <button onClick={onLogin} className="text-white hover:text-white/80 font-medium">
                    Iniciar sesión
                  </button>
                  <button
                    onClick={onSignup}
                    className="px-6 py-2 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition shadow-md"
                  >
                    Registrarse gratis
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onSignup}
                    className="px-6 py-2 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition shadow-md"
                  >
                    Mi Perfil
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/20 pt-4">
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-white hover:text-white/80 py-2 transition font-medium"
              >
                Características
              </button>
              <button
                onClick={() => scrollToSection('plantillas')}
                className="block w-full text-left text-white hover:text-white/80 py-2 transition font-medium"
              >
                Plantillas
              </button>
              <button
                onClick={() => scrollToSection('precios')}
                className="block w-full text-left text-white hover:text-white/80 py-2 transition font-medium"
              >
                Precios
              </button>
              <button
                onClick={onLogin}
                className="block w-full text-left text-white hover:text-white/80 py-2 transition font-medium"
              >
                Iniciar sesión
              </button>
              <button
                onClick={onSignup}
                className="w-full px-6 py-2 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition shadow-md"
              >
                Registrarse gratis
              </button>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-bold">Únete a más de 10M de creadores</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-sm">
                Un enlace para todo tu contenido
              </h1>

              <p className="text-lg md:text-xl text-white leading-relaxed font-medium">
                Comparte tus enlaces, perfiles de redes sociales, información de contacto y más en una sola página. Perfecto para Instagram, TikTok, Twitter y todas tus redes.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      clipli.top/
                    </span>
                    <input
                      type="text"
                      placeholder="tunombre"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleClaim()}
                      className="w-full pl-24 pr-4 py-4 border-2 border-white/30 bg-white rounded-full focus:outline-none focus:border-purple-300 text-gray-900 placeholder-gray-400 font-medium shadow-inner"
                    />
                  </div>
                </div>
                <button
                  onClick={handleClaim}
                  className="px-6 sm:px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition flex items-center justify-center gap-2 shadow-xl"
                >
                  Reclamar enlace
                  <ArrowRight size={20} />
                </button>
              </div>

              <p className="text-sm text-white/90 font-medium">
                Gratis para siempre. Sin tarjeta de crédito.
              </p>
            </div>

            {/* Right Content - 3D Carousel */}
            <div className="relative flex justify-center h-[600px] w-full items-center">
              <ThreeDCarousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}