import { useState } from 'react';
import { templates, categories } from '../lib/templates';
import { Sparkles } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  type: 'gradient' | 'image' | 'texture';
  value: string;
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'round' | 'space';
  backgroundSize?: 'auto' | 'cover' | 'contain' | 'initial' | 'inherit' | string;
}

interface TemplatesSectionProps {
  onSelectTemplate: (templateId: string) => void;
}

export function TemplatesSection({ onSelectTemplate }: TemplatesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'Todos' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.profession.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const allThemes: Theme[] = [
    { id: 'purple', name: 'Púrpura', type: 'gradient', value: 'from-purple-600 to-pink-600' },
    { id: 'blue', name: 'Azul', type: 'gradient', value: 'from-blue-600 to-cyan-600' },
    { id: 'green', name: 'Verde', type: 'gradient', value: 'from-green-600 to-teal-600' },
    { id: 'orange', name: 'Naranja', type: 'gradient', value: 'from-orange-600 to-red-600' },
    { id: 'pink', name: 'Rosa', type: 'gradient', value: 'from-pink-600 to-rose-600' },
    { id: 'red-yellow', name: 'Rojo-Amarillo', type: 'gradient', value: 'from-red-500 to-yellow-500' },
    { id: 'cyan-blue', name: 'Cian-Azul', type: 'gradient', value: 'from-cyan-500 to-blue-500' },
    { id: 'pink-purple', name: 'Rosa-Púrpura', type: 'gradient', value: 'from-pink-500 to-purple-500' },
    { id: 'teal-green', name: 'Teal-Verde', type: 'gradient', value: 'from-teal-500 to-green-500' },
    { id: 'indigo-violet', name: 'Índigo-Violeta', type: 'gradient', value: 'from-indigo-500 to-violet-500' },
    { id: 'stripes-blue', name: 'Rayas Azules', type: 'texture', value: 'repeating-linear-gradient(45deg, #e0f2f7, #e0f2f7 10px, #b3e5fc 10px, #b3e5fc 20px)' },
    { id: 'dots-grey', name: 'Puntos Grises', type: 'texture', value: 'repeating-radial-gradient(circle, #e0e0e0, #e0e0e0 2px, #f5f5f5 2px, #f5f5f5 10px)' },
    { id: 'grid-light', name: 'Cuadrícula Clara', type: 'texture', value: 'linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px)' },
    { id: 'honeycomb', name: 'Panal', type: 'texture', value: 'repeating-conic-gradient(#f0f0f0 0% 25%, #e0e0e0 0% 50%) 0 0 / 20px 20px' }
  ];

  return (
    <div id="plantillas" className="py-24 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-4">
            <Sparkles size={20} />
            <span className="font-semibold">50+ Plantillas Profesionales</span>
          </div>
          <h2 className="text-5xl mb-4">
            Plantillas para cada profesión
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Elige una plantilla diseñada específicamente para tu industria y personalízala en minutos
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Buscar plantilla..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:outline-none focus:border-purple-600 shadow-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full transition ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all cursor-pointer group border border-gray-100 hover:border-purple-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-lg ${template.theme.type === 'gradient' ? `bg-gradient-to-br ${template.theme.value}` : ''}`}
                  style={template.theme.type === 'image' ? { backgroundImage: `url(${template.theme.value})`, backgroundRepeat: template.theme.backgroundRepeat || 'no-repeat', backgroundSize: template.theme.backgroundSize || 'contain' } : template.theme.type === 'texture' ? { backgroundImage: template.theme.value } : {}}
                >
                  {template.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-xs text-gray-500">{template.category}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.profession}</p>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-600 font-medium">
                  {template.defaultLinks.length} enlaces incluidos
                </span>
                <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium group-hover:bg-purple-600 group-hover:text-white transition">
                  Usar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron plantillas</p>
          </div>
        )}
      </div>
    </div>
  );
}
