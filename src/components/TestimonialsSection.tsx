import { Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'María González',
      role: 'Influencer de Moda',
      image: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1',
      content: 'Clipli.top transformó completamente mi presencia online. Ahora todos mis enlaces están en un solo lugar y el diseño es increíble.',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Fotógrafo Profesional',
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
      content: 'La facilidad de uso y las plantillas profesionales me ahorraron horas de trabajo. Mis clientes ahora encuentran todo lo que necesitan.',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      role: 'Coach de Vida',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
      content: 'Las analíticas me ayudan a entender qué contenido funciona mejor. Es una herramienta indispensable para mi negocio.',
      rating: 5,
    },
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Miles de creadores confían en Clipli.top para compartir su contenido
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
