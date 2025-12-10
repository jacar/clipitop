import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { templates } from '../lib/templates';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TemplatesCarouselProps {
  onSelectTemplate?: (templateId: string) => void;
}

export function TemplatesCarousel({ onSelectTemplate }: TemplatesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsPerView = 3;
  const maxIndex = Math.max(0, templates.length - itemsPerView);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const themes: { [key: string]: string } = {
    purple: 'from-purple-600 to-pink-600',
    blue: 'from-blue-600 to-cyan-600',
    green: 'from-green-600 to-teal-600',
    orange: 'from-orange-600 to-red-600',
    pink: 'from-pink-600 to-rose-600',
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <div
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onSelectTemplate?.(template.id)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${themes[template.theme] || template.gradient} rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition`}
                  >
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.profession}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                    {template.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                    {template.defaultLinks.length} enlaces
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        disabled={currentIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        disabled={currentIndex >= maxIndex}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
