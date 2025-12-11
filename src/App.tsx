import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ProfilePreview } from './components/ProfilePreview';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { ProfileEditor } from './components/ProfileEditor';
import { SetupInstructions } from './components/SetupInstructions';
import { PublicProfile } from './components/PublicProfile';
import { TemplatesSection } from './components/TemplatesSection';
import { TemplatesCarousel } from './components/TemplatesCarousel';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PricingSection } from './components/PricingSection';

import { StaticPage } from './components/StaticPage';
import { UpdatePassword } from './components/UpdatePassword';
import { supabase, TABLES } from './lib/supabase';
import { getTemplateById } from './lib/templates';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [viewingPage, setViewingPage] = useState<string | null>(null);

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowEditor(true);
      }
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && !showEditor) {
        setShowEditor(true);
      }
    });

    // Manejar enrutamiento inicial basado en URL
    const path = window.location.pathname;
    if (path && path !== '/' && path !== '/index.html') {
      const route = path.substring(1); // quitar slash inicial

      // Rutas estáticas o reservadas
      if (['terms', 'privacy', 'cookies', 'update-password'].includes(route)) {
        setViewingPage(route);
      } else {
        // Asumir que es un nombre de usuario
        setViewingProfile(route);
      }
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('Intentando login con:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error de autenticación:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      console.log('Login exitoso:', data.user.email);
      setShowLogin(false);

      // Verificar si el usuario tiene un perfil
      const { data: profiles, error: profileError } = await supabase
        .from(TABLES.PROFILES)
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (profileError) {
        console.error('Error al verificar perfil:', profileError);
      }

      const profile = profiles && profiles.length > 0 ? profiles[0] : null;

      if (profile) {
        console.log('Usuario tiene perfil, abriendo editor');
        setShowEditor(true);
      } else {
        console.log('Usuario nuevo, necesita crear perfil');
        setShowEditor(true); // Abrir editor para crear perfil
      }
    } catch (error: any) {
      console.error('Error en handleLogin:', error);
      let errorMessage = 'Error al iniciar sesión';

      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor confirma tu email antes de iniciar sesión';
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  const handleSignup = async (email: string, password: string) => {
    try {
      console.log('Intentando registro con:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('Error de registro:', error);
        throw error;
      }

      console.log('Registro exitoso:', data);

      // Verificar si necesita confirmación de email
      if (data.user && !data.session) {
        alert('¡Cuenta creada! Revisa tu email para confirmar tu cuenta.');
        setShowSignup(false);
        setShowLogin(true);
      } else if (data.session) {
        // Auto-confirmación habilitada
        alert('¡Cuenta creada exitosamente!');
        setShowSignup(false);
        setShowEditor(true);
      }
    } catch (error: any) {
      console.error('Error en handleSignup:', error);
      let errorMessage = 'Error al crear la cuenta';

      if (error.message.includes('already registered')) {
        errorMessage = 'Este email ya está registrado';
      } else if (error.message.includes('Password should be')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowEditor(false);
    setUser(null);
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (user) {
      setShowEditor(true);
    } else {
      setShowSignup(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {viewingPage ? (
        <StaticPage
          pageId={viewingPage}
          onBack={() => setViewingPage(null)}
          onNavigate={(page) => setViewingPage(page)}
        />
      ) : viewingPage === 'update-password' ? (
        <UpdatePassword />
      ) : viewingProfile ? (
        <PublicProfile
          username={viewingProfile}
          onBack={() => setViewingProfile(null)}
          onNavigate={(page) => {
            setViewingProfile(null);
            setViewingPage(page);
          }}
        />
      ) : !showEditor ? (
        <>
          <Hero
            onLogin={() => setShowLogin(true)}
            onSignup={() => user ? setShowEditor(true) : setShowSignup(true)}
            isLoggedIn={!!user}
            user={user}
            onShowSetup={() => setShowSetup(true)}
          />
          <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl mb-4">
                  Plantillas populares
                </h2>
                <p className="text-xl text-gray-600">
                  Explora nuestras plantillas más usadas
                </p>
              </div>
              <TemplatesCarousel onSelectTemplate={handleSelectTemplate} />
            </div>
          </div>
          <Features />
          <TemplatesSection onSelectTemplate={handleSelectTemplate} />
          <TestimonialsSection />
          <PricingSection />
          <ProfilePreview onViewProfile={(username) => setViewingProfile(username)} />
          <Footer onNavigate={(page) => setViewingPage(page)} />
        </>
      ) : (
        <ProfileEditor
          onClose={() => {
            setShowEditor(false);
            setSelectedTemplate(null);
          }}
          user={user}
          onLogout={handleLogout}
          onNavigate={(page) => setViewingPage(page)}
          selectedTemplate={selectedTemplate}
        />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {showSignup && (
        <LoginModal
          onClose={() => setShowSignup(false)}
          onLogin={handleSignup}
          onSwitchToSignup={() => { }}
          isSignup={true}
        />
      )}

      {showSetup && (
        <SetupInstructions />
      )}



    </div>
  );
}