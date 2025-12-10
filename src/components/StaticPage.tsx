import { ArrowLeft } from 'lucide-react';
import { Footer } from './Footer';

interface StaticPageProps {
    pageId: string;
    onBack: () => void;
    onNavigate: (page: string) => void;
}

export function StaticPage({ pageId, onBack, onNavigate }: StaticPageProps) {
    const getPageContent = (id: string) => {
        switch (id) {
            // LEGAL
            case 'Privacidad':
                return {
                    title: 'Política de Privacidad',
                    content: (
                        <div className="space-y-6 text-gray-700">
                            <p className="lead">Última actualización: 10 de Diciembre, 2025</p>
                            <p>En Clipli.top ("nosotros", "nuestro"), respetamos su privacidad y estamos comprometidos a proteger los datos personales que comparte con nosotros. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos su información cuando visita nuestro sitio web y utiliza nuestros servicios.</p>

                            <h3 className="text-xl font-bold text-gray-900 mt-8">1. Información que Recopilamos</h3>
                            <p>Podemos recopilar información sobre usted de varias maneras:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Datos Personales:</strong> Nombre, dirección de correo electrónico, y otra información de registro que usted nos proporciona voluntariamente.</li>
                                <li><strong>Datos de Uso:</strong> Información sobre cómo interactúa con nuestros servicios, incluyendo dirección IP, tipo de navegador, páginas visitadas y tiempos de acceso.</li>
                                <li><strong>Datos Derivados:</strong> Información que nuestros servidores recopilan automáticamente cuando accede al sitio.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-gray-900 mt-8">2. Uso de su Información</h3>
                            <p>Utilizamos la información recopilada para:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Crear y administrar su cuenta.</li>
                                <li>Procesar sus transacciones y suscripciones.</li>
                                <li>Enviarle notificaciones administrativas y actualizaciones del servicio.</li>
                                <li>Mejorar la eficiencia y funcionamiento de nuestro sitio web.</li>
                                <li>Prevenir actividades fraudulentas y monitorear contra robos.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-gray-900 mt-8">3. Compartir su Información</h3>
                            <p>No vendemos su información personal. Podemos compartir información con terceros solo en las siguientes situaciones:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Proveedores de Servicios:</strong> Terceros que realizan servicios para nosotros o en nuestro nombre (procesamiento de pagos, análisis de datos, envío de correos).</li>
                                <li><strong>Obligaciones Legales:</strong> Si es necesario para cumplir con leyes, regulaciones o procesos legales aplicables.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-gray-900 mt-8">4. Seguridad</h3>
                            <p>Utilizamos medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger su información personal. Si bien hemos tomado medidas razonables para asegurar la información personal que nos proporciona, tenga en cuenta que ninguna medida de seguridad es perfecta o impenetrable.</p>
                        </div>
                    )
                };
            case 'Términos':
                return {
                    title: 'Términos de Servicio',
                    content: (
                        <div className="space-y-6 text-gray-700">
                            <p className="lead">Última actualización: 10 de Diciembre, 2025</p>
                            <p>Por favor, lea estos Términos de Servicio ("Términos") cuidadosamente antes de utilizar el servicio operado por Clipli.top.</p>

                            <h3 className="text-xl font-bold text-gray-900 mt-8">1. Aceptación de los Términos</h3>
                            <p>Al acceder o utilizar el Servicio, usted acepta estar sujeto a estos Términos. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.</p>

                            <h3 className="text-xl font-bold text-gray-900 mt-8">2. Cuentas</h3>
                            <p>Cuando crea una cuenta con nosotros, debe proporcionarnos información precisa, completa y actual en todo momento. El no hacerlo constituye una violación de los Términos, lo que puede resultar en la terminación inmediata de su cuenta en nuestro Servicio.</p>

                            <h3 className="text-xl font-bold text-gray-900 mt-8">3. Propiedad Intelectual</h3>
                            <p>El Servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de Clipli.top y sus licenciantes. El Servicio está protegido por derechos de autor, marcas registradas y otras leyes.</p>

                            <h3 className="text-xl font-bold text-gray-900 mt-8">4. Enlaces a Otros Sitios Web</h3>
                            <p>Nuestro Servicio puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni están controlados por Clipli.top. No tenemos control ni asumimos responsabilidad por el contenido, políticas de privacidad o prácticas de sitios web o servicios de terceros.</p>

                            <h3 className="text-xl font-bold text-gray-900 mt-8">5. Terminación</h3>
                            <p>Podemos terminar o suspender su cuenta inmediatamente, sin previo aviso o responsabilidad, por cualquier motivo, incluyendo, entre otros, si usted incumple los Términos.</p>
                        </div>
                    )
                };
            case 'Cookies':
                return {
                    title: 'Política de Cookies',
                    content: (
                        <div className="space-y-6 text-gray-700">
                            <p>Esta Política de Cookies explica qué son las cookies, cómo las utilizamos y sus opciones con respecto a ellas.</p>

                            <h3 className="text-xl font-bold text-gray-900 mt-8">¿Qué son las cookies?</h3>
                            <p>Las cookies son pequeños fragmentos de texto enviados a su navegador web por un sitio web que visita. Se almacenan en su dispositivo y permiten que el Servicio o un tercero lo reconozca y haga que su próxima visita sea más fácil y el Servicio más útil para usted.</p>

                            <h3 className="text-xl font-bold text-gray-900 mt-8">Cómo utilizamos las cookies</h3>
                            <p>Cuando utiliza y accede al Servicio, podemos colocar una serie de archivos de cookies en su navegador web. Utilizamos cookies para los siguientes propósitos:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Cookies Esenciales:</strong> Necesarias para autenticar usuarios y prevenir el uso fraudulento de cuentas de usuario.</li>
                                <li><strong>Cookies de Preferencias:</strong> Para recordar información que cambia la forma en que el Servicio se comporta o se ve, como su preferencia de idioma.</li>
                                <li><strong>Cookies de Análisis:</strong> Para rastrear información sobre cómo se utiliza el Servicio para que podamos hacer mejoras.</li>
                            </ul>
                        </div>
                    )
                };
            case 'Licencias':
                return {
                    title: 'Licencias y Atribuciones',
                    content: (
                        <div className="space-y-6 text-gray-700">
                            <p>Clipli.top utiliza software de código abierto y agradece a la comunidad de desarrolladores por sus contribuciones. A continuación se enumeran las licencias de los principales componentes utilizados:</p>

                            <div className="border rounded-lg p-6 bg-gray-50 mt-4">
                                <h4 className="font-bold text-lg mb-2">React</h4>
                                <p className="text-sm text-gray-600 mb-2">Copyright (c) Meta Platforms, Inc. and affiliates.</p>
                                <p className="text-sm">Licensed under the MIT License.</p>
                            </div>

                            <div className="border rounded-lg p-6 bg-gray-50 mt-4">
                                <h4 className="font-bold text-lg mb-2">Lucide Icons</h4>
                                <p className="text-sm text-gray-600 mb-2">Copyright (c) Lucide Contributors.</p>
                                <p className="text-sm">Licensed under the ISC License.</p>
                            </div>

                            <div className="border rounded-lg p-6 bg-gray-50 mt-4">
                                <h4 className="font-bold text-lg mb-2">Tailwind CSS</h4>
                                <p className="text-sm text-gray-600 mb-2">Copyright (c) Tailwind Labs, Inc.</p>
                                <p className="text-sm">Licensed under the MIT License.</p>
                            </div>
                        </div>
                    )
                };
            case 'Configuración':
                return {
                    title: 'Configuración de Privacidad',
                    content: (
                        <div className="space-y-6 text-gray-700">
                            <p>Gestione sus preferencias de privacidad y datos personales.</p>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            Para acceder a la configuración avanzada y eliminar o exportar sus datos, por favor inicie sesión en su cuenta.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t pt-8">
                                <h3 className="text-lg font-medium text-gray-900">Preferencias de Comunicación</h3>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex-grow flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">Boletín de Noticias</span>
                                            <span className="text-sm text-gray-500">Recibir actualizaciones sobre nuevas características y consejos.</span>
                                        </span>
                                        <button type="button" className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                            <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                };

            // RECURSOS
            case 'Centro de Ayuda':
                return {
                    title: 'Centro de Ayuda',
                    content: (
                        <div className="space-y-6">
                            <p>¿Necesitas ayuda? Aquí encontrarás respuestas a las preguntas más frecuentes.</p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-6 border rounded-lg hover:shadow-md transition">
                                    <h4 className="font-bold mb-2">Primeros Pasos</h4>
                                    <p className="text-sm text-gray-600">Aprende a configurar tu perfil básico en minutos.</p>
                                </div>
                                <div className="p-6 border rounded-lg hover:shadow-md transition">
                                    <h4 className="font-bold mb-2">Gestión de Cuenta</h4>
                                    <p className="text-sm text-gray-600">Cómo cambiar tu contraseña o actualizar tu email.</p>
                                </div>
                            </div>
                        </div>
                    )
                };
            case 'Tutoriales':
                return {
                    title: 'Tutoriales',
                    content: (
                        <div className="space-y-6">
                            <p>Aprende a sacar el máximo provecho de Clipli.top con nuestros tutoriales paso a paso.</p>
                            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500">Video Tutorial: Creando tu primer Biolink</p>
                            </div>
                        </div>
                    )
                };

            // COMPAÑÍA
            case 'Acerca de NOSOTROS':
                return {
                    title: 'Acerca de NOSOTROS',
                    content: (
                        <div className="space-y-6">
                            <p className="text-lg">Somos un equipo apasionado dedicado a simplificar tu presencia online.</p>
                            <p>Nuestra misión es proporcionar herramientas poderosas y fáciles de usar para creadores, empresas y profesionales.</p>
                        </div>
                    )
                };
            case 'Contacto':
                return {
                    title: 'Contacto',
                    content: (
                        <div className="space-y-6">
                            <p>¿Tienes alguna pregunta o sugerencia? Nos encantaría escucharte.</p>
                            <form className="max-w-md space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                                    <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"></textarea>
                                </div>
                                <button type="button" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Enviar Mensaje</button>
                            </form>
                        </div>
                    )
                };

            // PRODUCTO
            case 'Características':
                return {
                    title: 'Características',
                    content: (
                        <div className="space-y-8">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="p-6 bg-purple-50 rounded-xl">
                                    <h3 className="text-xl font-bold mb-3 text-purple-900">Editor Intuitivo</h3>
                                    <p className="text-gray-600">Arrastra y suelta elementos para construir tu página perfecta.</p>
                                </div>
                                <div className="p-6 bg-blue-50 rounded-xl">
                                    <h3 className="text-xl font-bold mb-3 text-blue-900">Analíticas Avanzadas</h3>
                                    <p className="text-gray-600">Conoce a tu audiencia con estadísticas detalladas.</p>
                                </div>
                                <div className="p-6 bg-green-50 rounded-xl">
                                    <h3 className="text-xl font-bold mb-3 text-green-900">Personalización Total</h3>
                                    <p className="text-gray-600">Colores, fuentes y temas ilimitados.</p>
                                </div>
                            </div>
                        </div>
                    )
                };
            case 'Precios':
                return {
                    title: 'Planes y Precios',
                    content: (
                        <div className="text-center">
                            <p className="mb-8">Elige el plan que mejor se adapte a tus necesidades.</p>
                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <div className="border rounded-2xl p-8 hover:shadow-lg transition">
                                    <h3 className="text-2xl font-bold text-gray-900">Gratis</h3>
                                    <p className="text-4xl font-bold my-4">$0 <span className="text-sm font-normal text-gray-500">/mes</span></p>
                                    <ul className="text-left space-y-3 mb-8">
                                        <li>✓ Enlaces ilimitados</li>
                                        <li>✓ Analíticas básicas</li>
                                        <li>✓ Temas predefinidos</li>
                                    </ul>
                                    <button className="w-full py-2 px-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200">Comenzar Gratis</button>
                                </div>
                                <div className="border border-purple-500 rounded-2xl p-8 shadow-md relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-3 py-1 rounded-bl-lg">PRO</div>
                                    <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                                    <p className="text-4xl font-bold my-4">$9.99 <span className="text-sm font-normal text-gray-500">/mes</span></p>
                                    <ul className="text-left space-y-3 mb-8">
                                        <li>✓ Todo lo de Gratis</li>
                                        <li>✓ Dominio personalizado</li>
                                        <li>✓ Analíticas avanzadas</li>
                                        <li>✓ Sin marca de agua</li>
                                    </ul>
                                    <button className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Obtener Pro</button>
                                </div>
                            </div>
                        </div>
                    )
                };
            case 'Analíticas':
                return {
                    title: 'Analíticas',
                    content: (
                        <div className="space-y-6">
                            <p>Toma decisiones basadas en datos reales.</p>
                            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                                <div className="h-64 bg-white rounded-lg shadow-sm flex items-center justify-center">
                                    <p className="text-gray-400">[Gráfico de demostración: Vistas por día]</p>
                                </div>
                            </div>
                        </div>
                    )
                };
            case 'Ejemplos':
                return {
                    title: 'Ejemplos',
                    content: (
                        <div className="grid md:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-[9/16] bg-gray-100 rounded-xl border-4 border-gray-800 shadow-xl flex items-center justify-center">
                                    <span className="text-gray-400">Ejemplo {i}</span>
                                </div>
                            ))}
                        </div>
                    )
                };

            default:
                return {
                    title: pageId,
                    content: <p>Contenido en construcción para: {pageId}</p>
                };
        }
    };

    const { title, content } = getPageContent(pageId);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header simple */}
            <nav className="bg-white border-b py-4 px-6 sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <a href="/" className="hover:opacity-80 transition">
                            <img src="https://www.webcincodev.com/blog/wp-content/uploads/2025/12/logoclic.svg" alt="Clipli.top" className="w-[300px] h-[90px] object-contain" />
                        </a>
                    </div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                    >
                        <ArrowLeft size={20} />
                        Volver
                    </button>
                </div>
            </nav>

            {/* Hero / Title Section */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{title}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-12 flex-grow">
                <div className="max-w-4xl mx-auto prose prose-lg prose-purple">
                    {content}
                </div>
            </div>

            <Footer onNavigate={onNavigate} />
        </div>
    );
}
