import { Instagram, Twitter, Facebook, Youtube, Linkedin } from 'lucide-react';


interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const footerLinks = {
    Producto: ['Características', 'Precios'],
    Compañía: ['Acerca de NOSOTROS', 'Contacto'],
    Legal: ['Privacidad', 'Términos', 'Cookies'],
    Soporte: ['Licencias', 'Configuración'],
  };

  const handleLinkClick = (category: string, item: string) => {
    onNavigate?.(item);
  };

  const handleSocialClick = (platform: string) => {
    console.log(`Social click: ${platform}`);
  };

  return (
    <footer className="bg-gray-900 text-white py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <a href="/" className="hover:opacity-80 transition">
                <img
                  src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logo-blanco.png"
                  alt="Clipli.top"
                  className="w-[300px] h-[90px] object-contain"
                />
              </a>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Un enlace para todo tu contenido. Conecta con tu audiencia en todas partes.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-sm text-gray-400 hover:text-white transition text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 Clipli.top. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => handleLinkClick('Privacidad')}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Política de Privacidad
              </button>
              <button
                onClick={() => handleLinkClick('Términos')}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Términos de Servicio
              </button>
              <button
                onClick={() => handleLinkClick('Cookies')}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}