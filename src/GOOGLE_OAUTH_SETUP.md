# 🔐 Configuración de Google OAuth para Clipli.top

## ⚠️ IMPORTANTE: Debes configurar Google OAuth en Supabase

El botón de "Continuar con Google" ya está implementado en el código, pero necesitas activarlo en tu proyecto de Supabase.

## 📋 Pasos para Configurar Google OAuth

### 1️⃣ **Ve a tu Dashboard de Supabase**
```
https://supabase.com/dashboard/project/[TU_PROJECT_ID]
```

### 2️⃣ **Navega a Authentication → Providers**
- En el menú lateral, click en **"Authentication"**
- Luego click en **"Providers"**

### 3️⃣ **Activar Google Provider**
- Busca **"Google"** en la lista de proveedores
- Click en **"Google"** para expandir las opciones
- ✅ **Activa el toggle** "Enable Sign in with Google"

### 4️⃣ **Configurar credenciales de Google** (Opción A - Supabase Maneja Todo)

**✨ RECOMENDADO PARA DESARROLLO:**

Si solo estás desarrollando/probando, Supabase puede manejar todo automáticamente:

1. **NO necesitas configurar nada en Google Cloud Console**
2. Solo activa el toggle de Google en Supabase
3. Supabase usará su propio Client ID y Secret para pruebas
4. ✅ ¡Listo! El botón de Google funcionará inmediatamente

⚠️ **Limitación:** Esta opción es para desarrollo. Para producción, configura tus propias credenciales (Opción B).

---

### 4️⃣ **Configurar credenciales de Google** (Opción B - Producción)

**Para PRODUCCIÓN, configura tus propias credenciales:**

#### Paso 1: Crear proyecto en Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Click en el selector de proyectos (arriba a la izquierda)
3. Click en **"NEW PROJECT"**
4. Nombre: `Clipli.top Auth`
5. Click en **"CREATE"**

#### Paso 2: Habilitar Google+ API

1. En el menú lateral, ve a **"APIs & Services" → "Library"**
2. Busca **"Google+ API"**
3. Click en **"ENABLE"**

#### Paso 3: Configurar OAuth Consent Screen

1. Ve a **"APIs & Services" → "OAuth consent screen"**
2. Selecciona **"External"**
3. Click en **"CREATE"**
4. Completa los campos:
   - **App name:** `Clipli.top`
   - **User support email:** tu email
   - **Developer contact:** tu email
5. Click en **"SAVE AND CONTINUE"**
6. En "Scopes", click en **"SAVE AND CONTINUE"** (usa los defaults)
7. En "Test users", agrega tu email para pruebas
8. Click en **"SAVE AND CONTINUE"**

#### Paso 4: Crear OAuth 2.0 Client ID

1. Ve a **"APIs & Services" → "Credentials"**
2. Click en **"+ CREATE CREDENTIALS"**
3. Selecciona **"OAuth client ID"**
4. Application type: **"Web application"**
5. Name: `Clipli.top Web Client`
6. **Authorized JavaScript origins:**
   ```
   https://xxxxxxxxxxx.supabase.co
   ```
   (Reemplaza con tu URL de Supabase)

7. **Authorized redirect URIs:**
   ```
   https://xxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
   (Copia esta URL desde tu dashboard de Supabase, está en la sección de Google Provider)

8. Click en **"CREATE"**
9. **COPIA:**
   - ✅ Client ID
   - ✅ Client Secret

#### Paso 5: Pegar credenciales en Supabase

1. Vuelve a tu Dashboard de Supabase
2. Ve a **Authentication → Providers → Google**
3. Pega:
   - **Client ID:** el que copiaste
   - **Client Secret:** el que copiaste
4. Click en **"SAVE"**

---

## 🎯 Verificar que funciona

1. Abre tu aplicación Clipli.top
2. Click en **"Iniciar sesión"**
3. Click en **"Continuar con Google"**
4. Deberías ser redirigido a Google para autenticarte
5. Después de autenticarte, volverás a tu app con la sesión iniciada

## 🚨 Problemas Comunes

### Error: "redirect_uri_mismatch"
- ✅ Verifica que la URL de callback en Google Cloud Console coincida EXACTAMENTE con la de Supabase
- Formato correcto: `https://tu-proyecto.supabase.co/auth/v1/callback`

### Error: "Access blocked: This app's request is invalid"
- ✅ Configura el OAuth Consent Screen en Google Cloud Console
- ✅ Agrega tu email como "Test User"

### El botón de Google no hace nada
- ✅ Verifica que activaste el provider en Supabase
- ✅ Abre la consola del navegador para ver errores

### Error: "Email already registered"
- Si ya te registraste con email/password, Google intentará usar el mismo email
- ✅ Usa un email diferente O elimina la cuenta anterior

---

## 📱 Configurar para Múltiples Dominios

Si tu app está en múltiples dominios (desarrollo, staging, producción):

1. En **Authorized JavaScript origins**, agrega todos:
   ```
   http://localhost:5173
   https://staging.clipli.top
   https://clipli.top
   https://xxxxxxxxxxx.supabase.co
   ```

2. En **Authorized redirect URIs**, agrega:
   ```
   https://xxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
   (Solo necesitas la URL de Supabase)

---

## ✅ Checklist Final

- [ ] Proyecto creado en Google Cloud Console
- [ ] Google+ API habilitada
- [ ] OAuth Consent Screen configurado
- [ ] OAuth Client ID creado
- [ ] Authorized redirect URI agregada
- [ ] Client ID y Secret copiados
- [ ] Provider de Google activado en Supabase
- [ ] Credenciales pegadas en Supabase
- [ ] Cambios guardados en Supabase
- [ ] Probado el flujo de login completo

---

## 🎉 ¡Listo!

Una vez completados estos pasos, el botón **"Continuar con Google"** funcionará perfectamente en tu aplicación Clipli.top.

El código ya está implementado y solo necesita que configures las credenciales en Supabase.
