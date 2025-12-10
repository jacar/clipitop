-- Script para arreglar el Trigger de Nuevos Usuarios
-- ERROR: Database error saving new user
-- CAUSA: El trigger intenta insertar datos en biolink_profiles y falla (probablemente por columnas que faltan o sobran)

-- 1. Reemplazar la función del trigger con una versión segura
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.biolink_profiles (user_id, username, display_name, bio)
  VALUES (
    new.id,
    split_part(new.email, '@', 1), -- Usar parte del email como username inicial
    split_part(new.email, '@', 1), -- Display name igual
    '¡Hola! Este es mi Biolink.' -- Bio por defecto
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Asegurarse de que el trigger exista
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Confirmación
SELECT 'Trigger reparado exitosamente' as status;
