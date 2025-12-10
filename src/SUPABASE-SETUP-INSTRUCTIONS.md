# 🚀 INSTRUCCIONES DE CONFIGURACIÓN DE SUPABASE PARA CLIPLI.TOP

## 📋 DIAGNÓSTICO RÁPIDO

**¿Por qué no funciona automáticamente?**

Supabase tiene una limitación técnica: **NO se pueden ejecutar comandos DDL (CREATE TABLE, CREATE FUNCTION) desde JavaScript**. Solo se pueden ejecutar desde:
- ✅ SQL Editor (Dashboard de Supabase)
- ✅ CLI de Supabase
- ✅ Scripts con service_role_key desde servidor

**Desde el cliente JavaScript SOLO puedes:**
- ✅ `supabase.from('tabla').select()` - Consultas
- ✅ `supabase.from('tabla').insert()` - Inserciones
- ✅ `supabase.rpc('funcion')` - Llamar funciones que YA existen
- ❌ `CREATE TABLE` - NO FUNCIONA
- ❌ `CREATE FUNCTION` - NO FUNCIONA

---

## 🎯 SOLUCIÓN: 3 OPCIONES DISPONIBLES

### **OPCIÓN 1: Configuración Avanzada (RECOMENDADA) 🌟**

La opción más completa con diagnóstico automático en tiempo real.

**Pasos:**
1. En Clipli.top, ve al panel de estado (esquina inferior derecha)
2. Click en **"🔧 Configuración Avanzada"** (botón gris)
3. El sistema verificará automáticamente qué falta
4. Sigue las instrucciones visuales paso a paso
5. El sistema te guiará exactamente qué hacer

**Ventajas:**
- ✅ Diagnóstico en tiempo real
- ✅ Muestra exactamente qué falta
- ✅ Detección avanzada de Storage
- ✅ Interfaz visual clara

---

### **OPCIÓN 2: Configuración Automática (RÁPIDA) ⚡**

Todo el SQL en un solo script.

**Pasos:**
1. En Clipli.top, click en **"🔧 Configuración Automática"** (botón azul)
2. Click en "Copiar SQL Completo"
3. Abre [SQL Editor de Supabase](https://supabase.com/dashboard/project/_/sql/new)
4. Pega el SQL completo
5. Click en "RUN"
6. Crea el bucket manualmente (paso 2 del asistente)

**Ventajas:**
- ✅ Un solo script SQL
- ✅ Rápido (2 pasos)
- ✅ Todo de una vez

---

### **OPCIÓN 3: Asistente Paso a Paso (DETALLADA) 📝**

Cada componente por separado.

**Pasos:**
1. En Clipli.top, click en **"🔧 Abrir Asistente de Reparación"** (botón morado)
2. Sigue los 6 pasos uno por uno
3. Cada paso tiene su propio botón "Copiar SQL"
4. Verifica cada paso antes de continuar

**Ventajas:**
- ✅ Control total
- ✅ Verifica cada paso
- ✅ Bueno para debugging

---

## 📦 STORAGE BUCKET (IMPORTANTE)

**⚠️ EL BUCKET NO SE PUEDE CREAR CON SQL**

Debe crearse manualmente en el Dashboard de Supabase.

### **Pasos para crear el bucket:**

1. **Abre Supabase Dashboard** → [Storage](https://supabase.com/dashboard/project/_/storage/buckets)

2. **Click en "New bucket"** (botón verde)

3. **Configuración:**
   ```
   Name: profile-images
   Public: ✅ YES (MARCAR ESTA OPCIÓN)
   File size limit: 50MB (opcional)
   ```

4. **Click en "Create bucket"**

5. **Verificar:**
   - El bucket debe aparecer en la lista
   - Debe tener el icono de "público"
   - Debe llamarse exactamente `profile-images`

### **⚠️ ERROR COMÚN:**

Si el bucket existe pero NO está marcado como público:
- Las imágenes NO se verán en la app
- Los usuarios NO podrán subir fotos de perfil

**Solución:**
1. Ve a Storage → profile-images → Settings
2. Activa "Public bucket"
3. Save

---

## 🔍 VERIFICACIÓN FINAL

Después de ejecutar el SQL y crear el bucket:

1. **Recarga la página de Clipli.top**
2. **Revisa el panel de estado** (esquina inferior derecha)
3. **Debe mostrar:**
   ```
   ✅ Conexión a Supabase
   ✅ Sistema de Auth
   ✅ profiles
   ✅ links
   ✅ social_links
   ✅ profile_views
   ✅ link_clicks
   ✅ increment_profile_views
   ✅ increment_link_clicks
   ✅ increment_social_clicks
   ✅ Storage (imágenes)
   ```

4. **Si todo está en ✅:**
   - El mensaje debe decir: "✅ Todo configurado correctamente"
   - Ya puedes usar la aplicación normalmente

5. **Si hay algún ❌:**
   - Click en el botón 🐛 para ver detalles en la consola
   - Revisa qué componente falta
   - Vuelve a ejecutar el SQL o crea el bucket

---

## 🆘 TROUBLESHOOTING

### **Problema 1: "Tabla no existe (404)"**

**Síntoma:** Error 404 al intentar acceder a biolink_profiles, biolink_links, etc.

**Causa:** No se ejecutó el SQL de creación de tablas

**Solución:**
1. Abre el archivo `/supabase-setup.sql` en este proyecto
2. Copia TODO el contenido
3. Pega en SQL Editor de Supabase
4. Click en RUN
5. Espera "Success. No rows returned"

---

### **Problema 2: "Función RPC no existe (404)"**

**Síntoma:** Error al llamar `increment_profile_views`, `increment_link_clicks`, etc.

**Causa:** No se crearon las funciones RPC

**Solución:**
- Las funciones están incluidas en el mismo script SQL
- Si ejecutaste el script completo, deberían existir
- Verifica en Supabase Dashboard → Database → Functions

---

### **Problema 3: "Bucket no encontrado"**

**Síntoma:** "❌ Bucket profile-images no encontrado"

**Causa:** El bucket no se creó manualmente

**Solución:**
1. Ve a Storage en Supabase Dashboard
2. Crea el bucket `profile-images`
3. ✅ Marca "Public bucket"
4. Recarga Clipli.top

---

### **Problema 4: "Bucket existe pero no es público"**

**Síntoma:** Bucket aparece pero imágenes no se ven

**Causa:** El bucket no está marcado como público

**Solución:**
1. Storage → profile-images → Settings
2. Activa "Public bucket"
3. Save
4. Recarga la app

---

### **Problema 5: "Permission denied para auth.users"**

**Síntoma:** Error al crear la tabla biolink_profiles con REFERENCES auth.users

**Causa:** No tienes permisos para referenciar auth.users

**Solución:**
- **Opción A:** Ejecuta el script como "postgres" user
- **Opción B:** El script ya usa `REFERENCES auth.users` que debería funcionar
- **Opción C:** Si aún falla, contacta soporte de Supabase

---

## 📊 ESTRUCTURA DE LA BASE DE DATOS

### **Tablas creadas:**

1. **biolink_profiles**
   - Perfiles de usuarios
   - Vinculada a `auth.users`
   - Contiene username, bio, imagen, tema, etc.

2. **biolink_links**
   - Enlaces personalizados
   - Vinculada a profiles
   - Drag & drop order con `position`

3. **biolink_social_links**
   - Enlaces de redes sociales
   - Vinculada a profiles
   - Plataformas: Instagram, TikTok, YouTube, etc.

4. **biolink_profile_views**
   - Analytics de vistas de perfil
   - Registra cada visita
   - Usado para estadísticas

5. **biolink_link_clicks**
   - Analytics de clicks en enlaces
   - Registra cada click
   - Usado para estadísticas

### **Funciones RPC:**

1. **increment_profile_views(profile_uuid)**
   - Incrementa contador de vistas
   - Se llama cada vez que alguien visita un perfil

2. **increment_link_clicks(link_uuid)**
   - Incrementa contador de clicks en enlaces
   - Se llama cada vez que alguien hace click en un link

3. **increment_social_clicks(social_uuid)**
   - Incrementa contador de clicks en redes sociales
   - Se llama cada vez que alguien hace click en un social link

### **Políticas de seguridad (RLS):**

Todas las tablas tienen Row Level Security habilitado:

- **Lectura:** Pública (cualquiera puede ver perfiles)
- **Escritura:** Solo el dueño del perfil
- **Analytics:** Solo el dueño puede ver sus propias estadísticas

---

## 🔐 SEGURIDAD

El sistema usa políticas RLS para asegurar que:
- ✅ Los usuarios solo pueden editar su propio perfil
- ✅ Los usuarios solo pueden ver sus propias analytics
- ✅ Cualquiera puede ver perfiles públicos
- ✅ Las funciones RPC usan SECURITY DEFINER para bypass RLS cuando es necesario

---

## 📝 NOTAS ADICIONALES

1. **El script es seguro ejecutarlo múltiples veces**
   - Usa `IF NOT EXISTS`
   - Usa `DROP POLICY IF EXISTS` antes de crear
   - No borrará datos existentes

2. **Todas las claves UUID se generan automáticamente**
   - No necesitas especificar IDs manualmente

3. **Los contadores usan COALESCE**
   - Evita problemas con valores NULL
   - Inicia en 0 automáticamente

4. **Trigger automático**
   - El campo `updated_at` se actualiza solo
   - No necesitas actualizarlo manualmente

---

## ✅ CHECKLIST FINAL

Marca cuando completes cada paso:

- [ ] Script SQL ejecutado en Supabase
- [ ] Todas las 5 tablas creadas
- [ ] Las 3 funciones RPC creadas
- [ ] Bucket `profile-images` creado
- [ ] Bucket marcado como público
- [ ] Panel de estado muestra todo en ✅
- [ ] App Clipli.top funcionando sin errores

---

## 🎉 ¡LISTO!

Una vez completado todo, tu aplicación Clipli.top estará 100% funcional con:
- ✅ Autenticación con Google OAuth
- ✅ Perfiles personalizados
- ✅ Enlaces drag & drop
- ✅ Redes sociales
- ✅ Analytics en tiempo real
- ✅ Upload de imágenes
- ✅ 50 temas/plantillas

---

**Creado por:** Sistema de Configuración Avanzada de Clipli.top
**Fecha:** Diciembre 2024
**Versión:** 1.0
