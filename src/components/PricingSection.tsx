import { useState } from 'react';
import { Check } from 'lucide-react';

export function PricingSection() {
  const plans = [
    {
      name: 'Gratis',
      price: '$0',
      period: 'siempre',
      description: 'Perfecto para empezar',
      features: [
        'Enlaces ilimitados',
        'Personalización básica',
        '5 redes sociales',
        'Analytics básico',
        'Soporte por email',
      ],
      cta: 'Comenzar gratis',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9',
      period: '/mes',
      description: 'Para profesionales',
      features: [
        'Todo en Gratis',
        'Plantillas premium',
        'Analytics avanzado',
        'Dominio personalizado',
        'Sin marca de Clipli',
        'Soporte prioritario',
        'Integraciones avanzadas',
      ],
      cta: 'Probar Pro',
      popular: true,
    },
    {
      name: 'Business',
      price: '$29',
      period: '/mes',
      description: 'Para equipos y empresas',
      features: [
        'Todo en Pro',
        'Múltiples perfiles',
        'Team collaboration',
        'API access',
        'White label',
        'Soporte 24/7',
        'Custom features',
      ],
      cta: 'Contactar ventas',
      popular: false,
    },
  ];

  const [showModal, setShowModal] = useState(false);

  const handlePlanClick = (planName: string) => {
    if (planName === 'Pro' || planName === 'Business') {
      setShowModal(true);
    }
  };

  return (
    <>
      <div id="precios" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-4">
              Precios simples y transparentes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comienza gratis y actualiza cuando estés listo para más funciones
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-8 ${plan.popular
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl scale-105'
                  : 'bg-gray-50 border border-gray-200'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-semibold">
                    Más popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ${plan.popular ? 'text-purple-100' : 'text-gray-500'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm ${plan.popular ? 'text-purple-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check
                        size={20}
                        className={`flex-shrink-0 ${plan.popular ? 'text-purple-200' : 'text-purple-600'}`}
                      />
                      <span className={`text-sm ${plan.popular ? 'text-purple-50' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (plan.name === 'Gratis') {
                      document.getElementById('plantillas')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      handlePlanClick(plan.name);
                    }
                  }}
                  className={`w-full py-4 rounded-xl font-semibold transition ${plan.popular
                    ? 'bg-white text-purple-600 hover:bg-purple-50'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              ¿Necesitas algo más? <a href="#" className="text-purple-600 hover:underline">Contáctanos</a>
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">¡Buenas noticias!</h3>
              <p className="text-gray-600 mb-6">
                Todas las funciones Premium son gratuitas por tiempo limitado.
                Disfruta de Clipli.top sin costo.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition font-semibold"
              >
                ¡Entendido, gracias!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
