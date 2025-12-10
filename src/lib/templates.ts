export interface Template {
  id: string;
  name: string;
  profession: string;
  category: string;
  theme: Theme;
  icon: string;
  description: string;
  defaultLinks: Array<{ title: string; url: string }>;
  defaultSocials: { [key: string]: string };
}

interface Theme {
  id: string;
  name: string;
  type: 'gradient' | 'image';
  value: string;
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'round' | 'space';
  backgroundSize?: 'auto' | 'cover' | 'contain' | 'initial' | 'inherit' | string;
}

export const templates: Template[] = [
  // Tech & Digital
  {
    id: 'developer',
    name: 'Desarrollador',
    profession: 'Software Developer',
    category: 'Tech',
    theme: { id: 'blue', name: 'Azul', type: 'gradient', value: 'from-blue-600 to-cyan-600' },
    icon: '💻',
    description: 'Perfecto para desarrolladores y programadores',
    defaultLinks: [
      { title: 'GitHub Portfolio', url: 'https://github.com' },
      { title: 'Stack Overflow', url: 'https://stackoverflow.com' },
      { title: 'Blog Técnico', url: 'https://medium.com' },
    ],
    defaultSocials: { instagram: '', twitter: '', youtube: '', facebook: '' },
  },
  {
    id: 'designer',
    name: 'Diseñador',
    profession: 'UX/UI Designer',
    category: 'Creative',
    theme: { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-purple-600 to-pink-600' },
    icon: '🎨',
    description: 'Para diseñadores gráficos y UX/UI',
    defaultLinks: [
      { title: 'Portfolio Behance', url: 'https://behance.net' },
      { title: 'Dribbble', url: 'https://dribbble.com' },
      { title: 'Figma Community', url: 'https://figma.com' },
    ],
    defaultSocials: { instagram: '@designer', twitter: '@designer', youtube: '', facebook: '' },
  },
  {
    id: 'youtuber',
    name: 'YouTuber',
    profession: 'Content Creator',
    category: 'Social Media',
    theme: { id: 'orange', name: 'Naranja', type: 'gradient', value: 'from-red-600 to-orange-600' },
    icon: '🎬',
    description: 'Ideal para creadores de contenido en YouTube',
    defaultLinks: [
      { title: 'Canal de YouTube', url: 'https://youtube.com' },
      { title: 'Video Más Reciente', url: 'https://youtube.com' },
      { title: 'Merch Store', url: 'https://teespring.com' },
    ],
    defaultSocials: { instagram: '@youtuber', twitter: '@youtuber', youtube: '@youtuber', facebook: '' },
  },
  {
    id: 'photographer',
    name: 'Fotógrafo',
    profession: 'Professional Photographer',
    category: 'Creative',
    theme: { id: 'green', name: 'Verde', type: 'gradient', value: 'from-green-600 to-teal-600' },
    icon: '📸',
    description: 'Para fotógrafos profesionales',
    defaultLinks: [
      { title: 'Portfolio', url: 'https://example.com' },
      { title: 'Instagram Feed', url: 'https://instagram.com' },
      { title: 'Book Session', url: 'https://calendly.com' },
    ],
    defaultSocials: { instagram: '@photo', twitter: '', youtube: '', facebook: '' },
  },
  {
    id: 'musician',
    name: 'Músico',
    profession: 'Musician & Artist',
    category: 'Entertainment',
    theme: { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-purple-600 to-indigo-600' },
    icon: '🎵',
    description: 'Para músicos y artistas',
    defaultLinks: [
      { title: 'Spotify', url: 'https://spotify.com' },
      { title: 'Apple Music', url: 'https://music.apple.com' },
      { title: 'Tour Dates', url: 'https://bandsintown.com' },
    ],
    defaultSocials: { instagram: '@music', twitter: '@music', youtube: '@music', facebook: 'music' },
  },

  // Business & Professional
  {
    id: 'entrepreneur',
    name: 'Emprendedor',
    profession: 'Entrepreneur',
    category: 'Business',
    theme: { id: 'blue', name: 'Azul', type: 'gradient', value: 'from-blue-700 to-indigo-700' },
    icon: '💼',
    description: 'Para emprendedores y dueños de negocios',
    defaultLinks: [
      { title: 'Mi Empresa', url: 'https://company.com' },
      { title: 'LinkedIn', url: 'https://linkedin.com' },
      { title: 'Agendar Reunión', url: 'https://calendly.com' },
    ],
    defaultSocials: { instagram: '', twitter: '@entrepreneur', youtube: '', facebook: '' },
  },
  {
    id: 'consultant',
    name: 'Consultor',
    profession: 'Business Consultant',
    category: 'Business',
    theme: { id: 'green', name: 'Verde', type: 'gradient', value: 'from-emerald-600 to-green-600' },
    icon: '📊',
    description: 'Para consultores empresariales',
    defaultLinks: [
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Testimonios', url: 'https://reviews.com' },
      { title: 'Contacto', url: 'https://contact.com' },
    ],
    defaultSocials: { instagram: '', twitter: '@consultant', youtube: '', facebook: '' },
  },
  {
    id: 'realtor',
    name: 'Agente Inmobiliario',
    profession: 'Real Estate Agent',
    category: 'Business',
    theme: { id: 'orange', name: 'Naranja', type: 'gradient', value: 'from-orange-600 to-amber-600' },
    icon: '🏠',
    description: 'Para agentes de bienes raíces',
    defaultLinks: [
      { title: 'Propiedades Disponibles', url: 'https://zillow.com' },
      { title: 'Agendar Visita', url: 'https://calendly.com' },
      { title: 'Testimonios', url: 'https://reviews.com' },
    ],
    defaultSocials: { instagram: '@realtor', twitter: '', youtube: '', facebook: 'realtor' },
  },

  // Health & Wellness
  {
    id: 'fitness',
    name: 'Entrenador Personal',
    profession: 'Fitness Trainer',
    category: 'Health',
    theme: { id: 'orange', name: 'Naranja', type: 'gradient', value: 'from-red-500 to-orange-500' },
    icon: '💪',
    description: 'Para entrenadores personales',
    defaultLinks: [
      { title: 'Planes de Entrenamiento', url: 'https://training.com' },
      { title: 'Transformaciones', url: 'https://instagram.com' },
      { title: 'Agendar Sesión', url: 'https://calendly.com' },
    ],
    defaultSocials: { instagram: '@fitness', twitter: '', youtube: '@fitness', facebook: '' },
  },
  {
    id: 'nutritionist',
    name: 'Nutricionista',
    profession: 'Nutritionist',
    category: 'Health',
    theme: { id: 'green', name: 'Verde', type: 'gradient', value: 'from-green-500 to-emerald-500' },
    icon: '🥗',
    description: 'Para nutricionistas y dietistas',
    defaultLinks: [
      { title: 'Consulta Online', url: 'https://booking.com' },
      { title: 'Recetas Saludables', url: 'https://blog.com' },
      { title: 'Planes Nutricionales', url: 'https://plans.com' },
    ],
    defaultSocials: { instagram: '@nutrition', twitter: '', youtube: '', facebook: '' },
  },
  {
    id: 'yoga',
    name: 'Instructor de Yoga',
    profession: 'Yoga Instructor',
    category: 'Health',
    theme: { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-purple-500 to-pink-500' },
    icon: '🧘',
    description: 'Para instructores de yoga y meditación',
    defaultLinks: [
      { title: 'Clases Online', url: 'https://classes.com' },
      { title: 'Retiros', url: 'https://retreats.com' },
      { title: 'YouTube Channel', url: 'https://youtube.com' },
    ],
    defaultSocials: { instagram: '@yoga', twitter: '', youtube: '@yoga', facebook: '' },
  },

  // Creative & Arts
  {
    id: 'writer',
    name: 'Escritor',
    profession: 'Writer & Author',
    category: 'Creative',
    theme: { id: 'blue', name: 'Azul', type: 'gradient', value: 'from-blue-600 to-purple-600' },
    icon: '✍️',
    description: 'Para escritores y autores',
    defaultLinks: [
      { title: 'Blog', url: 'https://medium.com' },
      { title: 'Libros Publicados', url: 'https://amazon.com' },
      { title: 'Newsletter', url: 'https://substack.com' },
    ],
    defaultSocials: { instagram: '', twitter: '@writer', youtube: '', facebook: '' },
  },
  {
    id: 'artist',
    name: 'Artista',
    profession: 'Visual Artist',
    category: 'Creative',
    theme: { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-pink-600 to-purple-600' },
    icon: '🎭',
    description: 'Para artistas visuales',
    defaultLinks: [
      { title: 'Galería', url: 'https://gallery.com' },
      { title: 'Tienda', url: 'https://shop.com' },
      { title: 'Comisiones', url: 'https://commissions.com' },
    ],
    defaultSocials: { instagram: '@artist', twitter: '@artist', youtube: '', facebook: '' },
  },
  {
    id: 'videoeditor',
    name: 'Editor de Video',
    profession: 'Video Editor',
    category: 'Creative',
    theme: { id: 'orange', name: 'Naranja', type: 'gradient', value: 'from-orange-600 to-red-600' },
    icon: '🎞️',
    description: 'Para editores de video',
    defaultLinks: [
      { title: 'Portafolio', url: 'https://vimeo.com' },
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Contacto', url: 'https://contact.com' },
    ],
    defaultSocials: { instagram: '@editor', twitter: '', youtube: '@editor', facebook: '' },
  },

  // Education
  {
    id: 'teacher',
    name: 'Profesor',
    profession: 'Teacher',
    category: 'Education',
    theme: { id: 'blue', name: 'Azul', type: 'gradient', value: 'from-blue-500 to-cyan-500' },
    icon: '👨‍🏫',
    description: 'Para profesores y educadores',
    defaultLinks: [
      { title: 'Recursos Educativos', url: 'https://resources.com' },
      { title: 'Clases Online', url: 'https://classes.com' },
      { title: 'Blog Educativo', url: 'https://blog.com' },
    ],
    defaultSocials: { instagram: '', twitter: '@teacher', youtube: '@teacher', facebook: '' },
  },
  {
    id: 'coach',
    name: 'Life Coach',
    profession: 'Life Coach',
    category: 'Education',
    theme: 'green',
    gradient: 'from-green-600 to-teal-600',
    icon: '🎯',
    description: 'Para coaches de vida',
    defaultLinks: [
      { title: 'Sesión Gratuita', url: 'https://calendly.com' },
      { title: 'Testimonios', url: 'https://testimonials.com' },
      { title: 'Programas', url: 'https://programs.com' },
    ],
    defaultSocials: { instagram: '@coach', twitter: '@coach', youtube: '', facebook: '' },
  },

  // Fashion & Beauty
  {
    id: 'fashionblogger',
    name: 'Fashion Blogger',
    profession: 'Fashion Influencer',
    category: 'Fashion',
    theme: { id: 'pink', name: 'Rosa', type: 'gradient', value: 'from-pink-600 to-rose-600' },
    icon: '👗',
    description: 'Para bloggers de moda',
    defaultLinks: [
      { title: 'Instagram', url: 'https://instagram.com' },
      { title: 'Blog de Moda', url: 'https://blog.com' },
      { title: 'Shop My Look', url: 'https://ltk.com' },
    ],
    defaultSocials: { instagram: '@fashion', twitter: '@fashion', youtube: '', facebook: '' },
  },
  {
    id: 'makeup',
    name: 'Maquillador',
    profession: 'Makeup Artist',
    category: 'Beauty',
    theme: { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-purple-600 to-pink-600' },
    icon: '💄',
    description: 'Para maquilladores profesionales',
    defaultLinks: [
      { title: 'Portfolio', url: 'https://portfolio.com' },
      { title: 'Booking', url: 'https://booking.com' },
      { title: 'Tutoriales', url: 'https://youtube.com' },
    ],
    defaultSocials: { instagram: '@makeup', twitter: '', youtube: '@makeup', facebook: '' },
  },
  {
    id: 'stylist',
    name: 'Estilista',
    profession: 'Personal Stylist',
    category: 'Fashion',
    theme: { id: 'orange', name: 'Naranja', type: 'gradient', value: 'from-orange-600 to-pink-600' },
    icon: '✂️',
    description: 'Para estilistas personales',
    defaultLinks: [
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Antes y Después', url: 'https://instagram.com' },
      { title: 'Reservar Cita', url: 'https://booking.com' },
    ],
    defaultSocials: { instagram: '@stylist', twitter: '', youtube: '', facebook: '' },
  },

  // Food & Beverage
  {
    id: 'chef',
    name: 'Chef',
    profession: 'Professional Chef',
    category: 'Food',
    theme: { id: 'orange', name: 'Naranja', type: 'gradient', value: 'from-orange-600 to-red-600' },
    icon: '👨‍🍳',
    description: 'Para chefs profesionales',
    defaultLinks: [
      { title: 'Recetas', url: 'https://recipes.com' },
      { title: 'Clases de Cocina', url: 'https://classes.com' },
      { title: 'Restaurante', url: 'https://restaurant.com' },
    ],
    defaultSocials: { instagram: '@chef', twitter: '', youtube: '@chef', facebook: '' },
  },
  {
    id: 'foodblogger',
    name: 'Food Blogger',
    profession: 'Food Content Creator',
    category: 'Food',
    theme: { id: 'green', name: 'Verde', type: 'gradient', value: 'from-green-600 to-yellow-600' },
    icon: '🍔',
    description: 'Para bloggers de comida',
    defaultLinks: [
      { title: 'Blog de Recetas', url: 'https://blog.com' },
      { title: 'Instagram', url: 'https://instagram.com' },
      { title: 'Ebook Gratuito', url: 'https://ebook.com' },
    ],
    defaultSocials: { instagram: '@foodie', twitter: '@foodie', youtube: '', facebook: '' },
  },

  // Travel
  {
    id: 'travelblogger',
    name: 'Travel Blogger',
    profession: 'Travel Content Creator',
    category: 'Travel',
    theme: { id: 'blue', name: 'Azul', type: 'gradient', value: 'from-blue-600 to-teal-600' },
    icon: '✈️',
    description: 'Para bloggers de viajes',
    defaultLinks: [
      { title: 'Blog de Viajes', url: 'https://blog.com' },
      { title: 'Guías de Destinos', url: 'https://guides.com' },
      { title: 'Instagram', url: 'https://instagram.com' },
    ],
    defaultSocials: { instagram: '@travel', twitter: '@travel', youtube: '@travel', facebook: '' },
  },

  // E-commerce & Sales
  {
    id: 'ecommerce',
    name: 'E-commerce',
    profession: 'Online Store Owner',
    category: 'Business',
    theme: { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-purple-600 to-indigo-600' },
    icon: '🛍️',
    description: 'Para tiendas online',
    defaultLinks: [
      { title: 'Tienda Online', url: 'https://shop.com' },
      { title: 'Nuevos Productos', url: 'https://new.com' },
      { title: 'Ofertas', url: 'https://deals.com' },
    ],
    defaultSocials: { instagram: '@shop', twitter: '', youtube: '', facebook: 'shop' },
  },
  {
    id: 'dropshipper',
    name: 'Dropshipper',
    profession: 'Dropshipping Business',
    category: 'Business',
    theme: { id: 'green', name: 'Verde', type: 'gradient', value: 'from-green-600 to-emerald-600' },
    icon: '📦',
    description: 'Para negocios de dropshipping',
    defaultLinks: [
      { title: 'Tienda', url: 'https://shopify.com' },
      { title: 'Productos Trending', url: 'https://trending.com' },
      { title: 'Descuentos', url: 'https://deals.com' },
    ],
    defaultSocials: { instagram: '@store', twitter: '', youtube: '', facebook: '' },
  },

  // Gaming & Entertainment
  {
    id: 'gamer',
    name: 'Gamer',
    profession: 'Professional Gamer',
    category: 'Gaming',
    theme: { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-purple-600 to-blue-600' },
    icon: '🎮',
    description: 'Para gamers y streamers',
    defaultLinks: [
      { title: 'Twitch', url: 'https://twitch.tv' },
      { title: 'YouTube Gaming', url: 'https://youtube.com' },
      { title: 'Discord', url: 'https://discord.gg' },
    ],
    defaultSocials: { instagram: '', twitter: '@gamer', youtube: '@gamer', facebook: '' },
  },
  {
    id: 'streamer',
    name: 'Streamer',
    profession: 'Content Streamer',
    category: 'Gaming',
    theme: { id: 'orange', name: 'Naranja', type: 'gradient', value: 'from-purple-600 to-pink-600' },
    icon: '🎙️',
    description: 'Para streamers de contenido',
    defaultLinks: [
      { title: 'Live Stream', url: 'https://twitch.tv' },
      { title: 'Schedule', url: 'https://schedule.com' },
      { title: 'Donations', url: 'https://streamlabs.com' },
    ],
    defaultSocials: { instagram: '@stream', twitter: '@stream', youtube: '', facebook: '' },
  },

  // Podcasting
  {
    id: 'podcaster',
    name: 'Podcaster',
    profession: 'Podcast Host',
    category: 'Entertainment',
    theme: { id: 'blue', name: 'Azul', type: 'gradient', value: 'from-blue-600 to-purple-600' },
    icon: '🎧',
    description: 'Para hosts de podcasts',
    defaultLinks: [
      { title: 'Spotify Podcast', url: 'https://spotify.com' },
      { title: 'Apple Podcasts', url: 'https://podcasts.apple.com' },
      { title: 'Episodio Más Reciente', url: 'https://latest.com' },
    ],
    defaultSocials: { instagram: '@podcast', twitter: '@podcast', youtube: '', facebook: '' },
  },

  // Real Estate & Property
  {
    id: 'architect',
    name: 'Arquitecto',
    profession: 'Architect',
    category: 'Professional',
    theme: { id: 'green', name: 'Verde', type: 'gradient', value: 'from-slate-600 to-gray-600' },
    icon: '🏛️',
    description: 'Para arquitectos',
    defaultLinks: [
      { title: 'Portfolio', url: 'https://portfolio.com' },
      { title: 'Proyectos', url: 'https://projects.com' },
      { title: 'Contacto', url: 'https://contact.com' },
    ],
    defaultSocials: { instagram: '@architect', twitter: '', youtube: '', facebook: '' },
  },

  // Legal & Finance
  {
    id: 'lawyer',
    name: 'Abogado',
    profession: 'Attorney at Law',
    category: 'Professional',
    theme: { id: 'blue', name: 'Azul', type: 'gradient', value: 'from-blue-800 to-indigo-800' },
    icon: '⚖️',
    description: 'Para abogados',
    defaultLinks: [
      { title: 'Áreas de Práctica', url: 'https://practice.com' },
      { title: 'Consulta Gratuita', url: 'https://consult.com' },
      { title: 'Testimonios', url: 'https://reviews.com' },
    ],
    defaultSocials: { instagram: '', twitter: '', youtube: '', facebook: '' },
  },
  {
    id: 'accountant',
    name: 'Contador',
    profession: 'Certified Accountant',
    category: 'Professional',
    theme: { id: 'green', name: 'Verde', type: 'gradient', value: 'from-green-700 to-teal-700' },
    icon: '📊',
    description: 'Para contadores',
    defaultLinks: [
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Consulta', url: 'https://booking.com' },
      { title: 'Recursos', url: 'https://resources.com' },
    ],
    defaultSocials: { instagram: '', twitter: '', youtube: '', facebook: '' },
  },

  // Medical & Healthcare
  {
    id: 'doctor',
    name: 'Doctor',
    profession: 'Medical Doctor',
    category: 'Health',
    theme: { id: 'blue', name: 'Azul', type: 'gradient', value: 'from-blue-600 to-cyan-600' },
    icon: '👨‍⚕️',
    description: 'Para médicos',
    defaultLinks: [
      { title: 'Agendar Cita', url: 'https://booking.com' },
      { title: 'Especialidades', url: 'https://specialties.com' },
      { title: 'Telemedicina', url: 'https://telemedicine.com' },
    ],
    defaultSocials: { instagram: '', twitter: '', youtube: '', facebook: '' },
  },
  {
    id: 'therapist',
    name: 'Terapeuta',
    profession: 'Licensed Therapist',
    category: 'Health',
    theme: { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-purple-600 to-indigo-600' },
    icon: '🧠',
    description: 'Para terapeutas',
    defaultLinks: [
      { title: 'Reservar Sesión', url: 'https://booking.com' },
      { title: 'Recursos de Salud Mental', url: 'https://resources.com' },
      { title: 'Blog', url: 'https://blog.com' },
    ],
    defaultSocials: { instagram: '@therapy', twitter: '', youtube: '', facebook: '' },
  },

  // Marketing & PR
  {
    id: 'marketer',
    name: 'Marketing Digital',
    profession: 'Digital Marketer',
    category: 'Business',
    theme: { id: 'orange', name: 'Naranja', type: 'gradient', value: 'from-orange-600 to-red-600' },
    icon: '📱',
    description: 'Para especialistas en marketing',
    defaultLinks: [
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Casos de Éxito', url: 'https://cases.com' },
      { title: 'Consulta Gratuita', url: 'https://consult.com' },
    ],
    defaultSocials: { instagram: '@marketing', twitter: '@marketing', youtube: '', facebook: '' },
  },
  {
    id: 'socialmedia',
    name: 'Social Media Manager',
    profession: 'Social Media Expert',
    category: 'Business',
    theme: { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-pink-600 to-purple-600' },
    icon: '📲',
    description: 'Para gestores de redes sociales',
    defaultLinks: [
      { title: 'Portfolio', url: 'https://portfolio.com' },
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Testimonios', url: 'https://testimonials.com' },
    ],
    defaultSocials: { instagram: '@smm', twitter: '@smm', youtube: '', facebook: '' },
  },

  // Event Planning
  {
    id: 'eventplanner',
    name: 'Organizador de Eventos',
    profession: 'Event Planner',
    category: 'Business',
    theme: { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-purple-600 to-pink-600' },
    icon: '🎉',
    description: 'Para organizadores de eventos',
    defaultLinks: [
      { title: 'Eventos Pasados', url: 'https://portfolio.com' },
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Cotización', url: 'https://quote.com' },
    ],
    defaultSocials: { instagram: '@events', twitter: '', youtube: '', facebook: 'events' },
  },

  // Automotive
  {
    id: 'mechanic',
    name: 'Mecánico',
    profession: 'Auto Mechanic',
    category: 'Automotive',
    theme: { id: 'gray', name: 'Gris', type: 'gradient', value: 'from-gray-700 to-gray-900' },
    icon: '🔧',
    description: 'Para mecánicos automotrices',
    defaultLinks: [
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Reservar Cita', url: 'https://booking.com' },
      { title: 'Reseñas', url: 'https://reviews.com' },
    ],
    defaultSocials: { instagram: '', twitter: '', youtube: '', facebook: 'garage' },
  },

  // Pet Services
  {
    id: 'veterinarian',
    name: 'Veterinario',
    profession: 'Veterinarian',
    category: 'Health',
    theme: 'green',
    gradient: 'from-green-600 to-teal-600',
    icon: '🐾',
    description: 'Para veterinarios',
    defaultLinks: [
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Agendar Cita', url: 'https://booking.com' },
      { title: 'Consejos para Mascotas', url: 'https://tips.com' },
    ],
    defaultSocials: { instagram: '@vet', twitter: '', youtube: '', facebook: '' },
  },

  // Beauty Services
  {
    id: 'hairstylist',
    name: 'Estilista de Cabello',
    profession: 'Hair Stylist',
    category: 'Beauty',
    theme: 'pink',
    gradient: 'from-pink-600 to-purple-600',
    icon: '💇',
    description: 'Para estilistas de cabello',
    defaultLinks: [
      { title: 'Galería', url: 'https://gallery.com' },
      { title: 'Reservar', url: 'https://booking.com' },
      { title: 'Precios', url: 'https://pricing.com' },
    ],
    defaultSocials: { instagram: '@hair', twitter: '', youtube: '', facebook: '' },
  },
  {
    id: 'nailartist',
    name: 'Nail Artist',
    profession: 'Nail Technician',
    category: 'Beauty',
    theme: 'purple',
    gradient: 'from-pink-500 to-purple-500',
    icon: '💅',
    description: 'Para técnicos de uñas',
    defaultLinks: [
      { title: 'Diseños', url: 'https://designs.com' },
      { title: 'Booking', url: 'https://booking.com' },
      { title: 'Instagram', url: 'https://instagram.com' },
    ],
    defaultSocials: { instagram: '@nails', twitter: '', youtube: '', facebook: '' },
  },

  // Crafts & Handmade
  {
    id: 'craftsman',
    name: 'Artesano',
    profession: 'Craftsman',
    category: 'Creative',
    theme: 'orange',
    gradient: 'from-amber-600 to-orange-600',
    icon: '🛠️',
    description: 'Para artesanos',
    defaultLinks: [
      { title: 'Tienda', url: 'https://shop.com' },
      { title: 'Galería', url: 'https://gallery.com' },
      { title: 'Pedidos Personalizados', url: 'https://custom.com' },
    ],
    defaultSocials: { instagram: '@craft', twitter: '', youtube: '', facebook: '' },
  },

  // Spiritual & Wellness
  {
    id: 'tarot',
    name: 'Tarotista',
    profession: 'Tarot Reader',
    category: 'Spiritual',
    theme: 'purple',
    gradient: 'from-purple-700 to-indigo-700',
    icon: '🔮',
    description: 'Para lectores de tarot',
    defaultLinks: [
      { title: 'Reservar Lectura', url: 'https://booking.com' },
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Testimonios', url: 'https://reviews.com' },
    ],
    defaultSocials: { instagram: '@tarot', twitter: '', youtube: '', facebook: '' },
  },

  // Language & Translation
  {
    id: 'translator',
    name: 'Traductor',
    profession: 'Translator',
    category: 'Professional',
    theme: 'blue',
    gradient: 'from-blue-600 to-cyan-600',
    icon: '🌐',
    description: 'Para traductores',
    defaultLinks: [
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Portafolio', url: 'https://portfolio.com' },
      { title: 'Cotización', url: 'https://quote.com' },
    ],
    defaultSocials: { instagram: '', twitter: '', youtube: '', facebook: '' },
  },

  // Voice & Audio
  {
    id: 'voiceactor',
    name: 'Actor de Voz',
    profession: 'Voice Actor',
    category: 'Entertainment',
    theme: 'orange',
    gradient: 'from-orange-600 to-red-600',
    icon: '🎤',
    description: 'Para actores de voz',
    defaultLinks: [
      { title: 'Demo Reel', url: 'https://soundcloud.com' },
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Contacto', url: 'https://contact.com' },
    ],
    defaultSocials: { instagram: '', twitter: '@voice', youtube: '', facebook: '' },
  },

  // Dance & Performance
  {
    id: 'dancer',
    name: 'Bailarín',
    profession: 'Professional Dancer',
    category: 'Entertainment',
    theme: 'purple',
    gradient: 'from-purple-600 to-pink-600',
    icon: '💃',
    description: 'Para bailarines profesionales',
    defaultLinks: [
      { title: 'Videos', url: 'https://youtube.com' },
      { title: 'Clases', url: 'https://classes.com' },
      { title: 'Shows', url: 'https://shows.com' },
    ],
    defaultSocials: { instagram: '@dancer', twitter: '', youtube: '@dancer', facebook: '' },
  },

  // Sports & Athletics
  {
    id: 'athlete',
    name: 'Atleta',
    profession: 'Professional Athlete',
    category: 'Sports',
    theme: 'orange',
    gradient: 'from-red-600 to-orange-600',
    icon: '🏃',
    description: 'Para atletas profesionales',
    defaultLinks: [
      { title: 'Competencias', url: 'https://competitions.com' },
      { title: 'Patrocinadores', url: 'https://sponsors.com' },
      { title: 'Entrenamientos', url: 'https://training.com' },
    ],
    defaultSocials: { instagram: '@athlete', twitter: '@athlete', youtube: '', facebook: '' },
  },

  // Non-Profit & Activism
  {
    id: 'activist',
    name: 'Activista',
    profession: 'Social Activist',
    category: 'Social',
    theme: 'green',
    gradient: 'from-green-600 to-teal-600',
    icon: '✊',
    description: 'Para activistas sociales',
    defaultLinks: [
      { title: 'Nuestra Causa', url: 'https://cause.com' },
      { title: 'Donar', url: 'https://donate.com' },
      { title: 'Voluntariado', url: 'https://volunteer.com' },
    ],
    defaultSocials: { instagram: '@activist', twitter: '@activist', youtube: '', facebook: '' },
  },

  // Real Estate Photography
  {
    id: 'realestatephoto',
    name: 'Fotógrafo Inmobiliario',
    profession: 'Real Estate Photographer',
    category: 'Creative',
    theme: 'blue',
    gradient: 'from-blue-600 to-indigo-600',
    icon: '📷',
    description: 'Para fotografía inmobiliaria',
    defaultLinks: [
      { title: 'Portfolio', url: 'https://portfolio.com' },
      { title: 'Paquetes', url: 'https://packages.com' },
      { title: 'Reservar', url: 'https://booking.com' },
    ],
    defaultSocials: { instagram: '@realestatephoto', twitter: '', youtube: '', facebook: '' },
  },

  // Florist
  {
    id: 'florist',
    name: 'Florista',
    profession: 'Florist',
    category: 'Services',
    theme: 'purple',
    gradient: 'from-pink-500 to-purple-500',
    icon: '🌸',
    description: 'Para floristas',
    defaultLinks: [
      { title: 'Catálogo', url: 'https://catalog.com' },
      { title: 'Pedidos', url: 'https://orders.com' },
      { title: 'Eventos', url: 'https://events.com' },
    ],
    defaultSocials: { instagram: '@flowers', twitter: '', youtube: '', facebook: '' },
  },

  // Baker/Pastry Chef
  {
    id: 'baker',
    name: 'Pastelero',
    profession: 'Pastry Chef',
    category: 'Food',
    theme: 'orange',
    gradient: 'from-pink-500 to-orange-500',
    icon: '🍰',
    description: 'Para pasteleros',
    defaultLinks: [
      { title: 'Galería', url: 'https://gallery.com' },
      { title: 'Pedidos', url: 'https://orders.com' },
      { title: 'Precios', url: 'https://pricing.com' },
    ],
    defaultSocials: { instagram: '@bakery', twitter: '', youtube: '', facebook: '' },
  },

  // Wedding Planner
  {
    id: 'weddingplanner',
    name: 'Wedding Planner',
    profession: 'Wedding Coordinator',
    category: 'Business',
    theme: 'purple',
    gradient: 'from-pink-600 to-purple-600',
    icon: '💒',
    description: 'Para coordinadores de bodas',
    defaultLinks: [
      { title: 'Portfolio', url: 'https://portfolio.com' },
      { title: 'Servicios', url: 'https://services.com' },
      { title: 'Consulta', url: 'https://consult.com' },
    ],
    defaultSocials: { instagram: '@weddings', twitter: '', youtube: '', facebook: '' },
  },

  // Barber
  {
    id: 'barber',
    name: 'Barbero',
    profession: 'Barber',
    category: 'Beauty',
    theme: 'orange',
    gradient: 'from-slate-700 to-gray-700',
    icon: '💈',
    description: 'Para barberos',
    defaultLinks: [
      { title: 'Estilos', url: 'https://styles.com' },
      { title: 'Reservar', url: 'https://booking.com' },
      { title: 'Ubicación', url: 'https://maps.google.com' },
    ],
    defaultSocials: { instagram: '@barber', twitter: '', youtube: '', facebook: '' },
  },

  // DJ
  {
    id: 'dj',
    name: 'DJ',
    profession: 'Disc Jockey',
    category: 'Entertainment',
    theme: 'purple',
    gradient: 'from-purple-600 to-blue-600',
    icon: '🎧',
    description: 'Para DJs',
    defaultLinks: [
      { title: 'Mixes', url: 'https://soundcloud.com' },
      { title: 'Eventos', url: 'https://events.com' },
      { title: 'Booking', url: 'https://booking.com' },
    ],
    defaultSocials: { instagram: '@dj', twitter: '@dj', youtube: '', facebook: '' },
  },
];

export const categories = [
  'Todos',
  'Tech',
  'Creative',
  'Business',
  'Health',
  'Fashion',
  'Food',
  'Entertainment',
  'Education',
  'Professional',
  'Services',
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): Template[] {
  if (category === 'Todos') return templates;
  return templates.filter(t => t.category === category);
}
