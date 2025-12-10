# 📦 CÓMO CREAR EL BUCKET DE STORAGE EN SUPABASE

## ⚠️ ERROR DETECTADO

```
❌ Bucket profile-images no encontrado
```

**El bucket NO existe** en tu proyecto de Supabase. Los buckets de Storage **NO SE PUEDEN CREAR CON SQL**, debes crearlos manualmente en la interfaz.

---

## 🎯 PASOS PARA CREAR EL BUCKET

### 1️⃣ **Abre tu Dashboard de Supabase**

Ve a: `https://supabase.com/dashboard`

### 2️⃣ **Navega a Storage**

En el menú lateral izquierdo, busca y click en:

```
📦 Storage
```

### 3️⃣ **Click en "New bucket"**

Verás un botón verde en la parte superior que dice:

```
+ New bucket
```

Click ahí.

### 4️⃣ **Completa el Formulario**

Se abrirá un modal. Completa los campos **EXACTAMENTE** así:

**Name:**
```
profile-images
```
⚠️ **IMPORTANTE:** Sin mayúsculas, sin espacios, exactamente como se muestra.

**Public bucket:**
```
✅ ACTIVADO (muy importante marcar esta casilla)
```
⚠️ **CRÍTICO:** Si no activas "Public bucket", las imágenes NO se podrán ver.

**Allowed MIME types:**
```
Dejar vacío (permitir todos los tipos)
```

**File size limit:**
```
Dejar el default (50MB está bien)
```

### 5️⃣ **Click en "Create bucket"**

Click en el botón verde "Create bucket" en la parte inferior del modal.

### 6️⃣ **Verificar que se creó correctamente**

Deberías ver el bucket "profile-images" en la lista de buckets.

---

## ✅ VERIFICAR EN CLIPLI.TOP

Una vez creado el bucket:

1. **Vuelve a tu aplicación Clipli.top**
2. Mira el **panel de estado** en la esquina inferior derecha
3. Click en el icono de **actualizar** (🔄)
4. Ahora "Storage (imágenes)" debería mostrar ✅

**O si usas el Asistente de Reparación:**

1. Ve al **Paso 6** (Storage Bucket)
2. Click en **"Verificar Ahora"**
3. Debería cambiar a ✅

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ Sigue diciendo "no encontrado"

**Verifica estos puntos:**

1. **Nombre exacto:** Debe ser `profile-images` (todo en minúsculas)
2. **Proyecto correcto:** Asegúrate de estar en el proyecto correcto de Supabase
3. **Espera 5 segundos:** A veces tarda un poco en propagarse

**Verifica manualmente:**
- Ve a Storage en Supabase
- Deberías ver "profile-images" en la lista
- Si está ahí, actualiza la página de Clipli.top

### ❌ El bucket se creó pero con otro nombre

Si accidentalmente lo creaste con otro nombre:

**Opción 1: Renombrar (no recomendado, puede causar problemas)**

**Opción 2: Eliminar y recrear (recomendado)**
1. En Supabase, ve a Storage
2. Click en el bucket incorrecto
3. Settings → Delete bucket
4. Créalo de nuevo con el nombre correcto: `profile-images`

### ❌ ¿Olvidaste marcar "Public bucket"?

Si creaste el bucket pero no lo marcaste como público:

1. Ve a Storage en Supabase
2. Click en "profile-images"
3. Click en "Settings" (icono de engranaje)
4. ✅ Activa "Public"
5. Click en "Save"

---

## 📸 CAPTURAS DE REFERENCIA

**Así se ve el formulario de creación:**

```
┌─────────────────────────────────────┐
│  Create a new bucket                │
├─────────────────────────────────────┤
│                                     │
│  Name                               │
│  ┌───────────────────────────────┐ │
│  │ profile-images                │ │
│  └───────────────────────────────┘ │
│                                     │
│  ☑ Public bucket                   │
│    Allow public access to files    │
│                                     │
│  Allowed MIME types (optional)     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  File size limit                   │
│  ┌───────────────────────────────┐ │
│  │ 50 MB                         │ │
│  └───────────────────────────────┘ │
│                                     │
│          [ Create bucket ]          │
└─────────────────────────────────────┘
```

---

## ✅ CONFIRMACIÓN FINAL

Después de crear el bucket, deberías poder:

1. **Ver el bucket** en la lista de Storage
2. **Subir imágenes** desde el editor de perfil
3. **Ver ✅ en el panel de estado** de Clipli.top

---

## 🆘 ¿SIGUES TENIENDO PROBLEMAS?

Si después de seguir estos pasos **EXACTAMENTE** sigue sin funcionar:

1. Abre la consola del navegador (F12 → Console)
2. Click en el botón **🐛** en el panel de estado
3. Copia TODO lo que aparece en la consola
4. Compártelo para investigar más a fondo

El botón 🐛 mostrará información detallada como:
- Todos los buckets disponibles en tu proyecto
- El nombre exacto de cada bucket
- Si son públicos o privados
- Cualquier error de permisos

---

**¡Una vez creado el bucket, tu aplicación estará 100% funcional!** 🎉
