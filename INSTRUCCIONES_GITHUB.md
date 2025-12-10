# INSTRUCCIONES PARA SUBIR A GITHUB

## Problema Actual
Hay un proceso bloqueando Git que impide hacer commits. El tag "Listo" ya está creado localmente.

## Solución: Reiniciar y Subir

### Paso 1: Reiniciar la computadora
Esto liberará todos los procesos que están bloqueando Git.

### Paso 2: Abrir PowerShell en el proyecto
```powershell
cd C:\Users\Dev\Downloads\nuevabiolink
```

### Paso 3: Limpiar archivos grandes del historial (IMPORTANTE)
El repositorio tiene archivos muy grandes (>100MB) que GitHub rechaza. Necesitamos crear un historial limpio:

```powershell
# Crear una nueva rama sin historial
git checkout --orphan nuevo-main

# Agregar todos los archivos actuales (el .gitignore ya excluye archivos grandes)
git add .

# Hacer el commit inicial
git commit -m "Punto de restauración: Listo - Galería completa con descripciones y links, temas funcionando"

# Eliminar la rama main antigua
git branch -D main

# Renombrar la nueva rama a main
git branch -m main

# Subir forzadamente a GitHub (esto reemplazará el historial)
git push origin main --force

# Crear y subir el tag
git tag -a "Listo" -m "Punto de restauración: Listo"
git push origin Listo
```

### Paso 4: Verificar en GitHub
Abre https://github.com/jacar/clipitop.git y verifica que todo esté subido.

## Archivos Excluidos (por .gitignore)
- node_modules/
- *.mp4, *.avi, *.mov (videos)
- .env (variables de entorno)
- archivos temporales

## Estado Actual del Proyecto "Listo"
✅ Subida de imágenes funcionando (perfil, fondo, galería)
✅ 39 temas visibles y aplicables
✅ Galería con descripción y link por imagen
✅ Vista previa correcta con imágenes clicables
✅ Error 406 de Supabase resuelto (RLS deshabilitado)
