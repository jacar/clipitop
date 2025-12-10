# CAMBIOS PARA HACER PROFILEEDITOR RESPONSIVE EN MÓVIL

## CAMBIO 1: Layout Principal (línea 602-605)
### Buscar:
```tsx
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
```

### Reemplazar con:
```tsx
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Editor Panel */}
          <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 order-2 lg:order-1">
```

## CAMBIO 2: Secciones de Perfil, Enlaces, etc. (padding y tamaños)
### Buscar todas las ocurrencias de:
```tsx
className="bg-white rounded-2xl p-6 shadow-sm"
```

### Reemplazar con:
```tsx
className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm"
```

## CAMBIO 3: Títulos de secciones
### Buscar:
```tsx
<h2 className="text-xl mb-4 flex items-center gap-2">
```

### Reemplazar con:
```tsx
<h2 className="text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
```

## CAMBIO 4: Inputs de texto
### Buscar todos los inputs con:
```tsx
className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3
```

### Reemplazar con:
```tsx
className="w-full border border-gray-300 rounded-md shadow-sm py-2 sm:py-2.5 px-3 text-sm sm:text-base
```

## CAMBIO 5: Grid de temas (línea ~820)
### Buscar:
```tsx
<div className="grid grid-cols-4 gap-2">
```

### Reemplazar con:
```tsx
<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
```

## CAMBIO 6: Vista Previa (hacer sticky solo en desktop y orden correcto)
### Buscar (alrededor de línea 1070):
```tsx
{/* Preview Panel */}
<div className="space-y-6">
```

### Reemplazar con:
```tsx
{/* Preview Panel */}
<div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
```

## CAMBIO 7: Galería en vista previa (línea ~1190)
### Buscar:
```tsx
<div className="grid grid-cols-2 gap-4">
```

### Reemplazar con:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
```

## CAMBIO 8: Botones de acción
### Buscar todos los botones con clases como:
```tsx
className="px-4 py-2
```

### Reemplazar con:
```tsx
className="px-3 sm:px-4 py-2 text-sm sm:text-base
```

## RESULTADO ESPERADO:
- ✅ En móvil: Vista previa arriba, editor abajo, todo en una columna
- ✅ Padding reducido en móvil para aprovechar espacio
- ✅ Textos y botones más pequeños en móvil
- ✅ Grid de temas 3 columnas en móvil, 4 en desktop
- ✅ Galería 1 columna en móvil, 2 en desktop
- ✅ En desktop: Vista previa sticky a la derecha
