import { Link2, Palette, BarChart3, Smartphone, Zap, Shield } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Link2,
      title: 'Enlaces Ilimitados',
      description: 'Agrega todos los enlaces que quieras. Sin restricciones, sin costos ocultos.',
    },
    {
      icon: Palette,
      title: 'Personalización Total',
      description: 'Elige entre hermosos temas o crea tu propio diseño único.',
    },
    {
      icon: BarChart3,
      title: 'Analíticas',
      description: 'Rastrea clics, vistas y engagement con analíticas detalladas.',
    },
    {
      icon: Smartphone,
      title: 'Optimizado para Móvil',
      description: 'Se ve perfecto en cualquier dispositivo, desde teléfonos hasta computadoras.',
    },
    {
      icon: Zap,
      title: 'Súper Rápido',
      description: 'Carga instantánea y rendimiento fluido para tus visitantes.',
    },
    {
      icon: Shield,
      title: 'Seguro y Confiable',
      description: '99.9% de disponibilidad con seguridad de nivel empresarial.',
    },
  ];

  return (
    <div id="features" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl mb-4">
            Todo lo que necesitas para crecer
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Funciones poderosas para ayudarte a compartir tu contenido y conectar con tu audiencia
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg md:text-xl mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
