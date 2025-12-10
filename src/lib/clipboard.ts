// Función para copiar texto al portapapeles con fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Intentar primero el método del fallback que es más confiable en iframes
    return fallbackCopyToClipboard(text);
  } catch (err) {
    console.error('Error al copiar:', err);
    return false;
  }
}

function fallbackCopyToClipboard(text: string): boolean {
  try {
    // Crear un elemento de texto temporal
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Hacer el textarea invisible pero accesible
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    textArea.style.zIndex = '-1';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    // Para iOS
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.focus();
      textArea.select();
    }
    
    // Intentar copiar
    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (err) {
      console.error('execCommand falló:', err);
    }
    
    // Limpiar
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Fallback copy falló:', err);
    return false;
  }
}

// Función para obtener texto del portapapeles
export async function readFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      const text = await navigator.clipboard.readText();
      return text;
    }
    return null;
  } catch (err) {
    console.warn('No se pudo leer del portapapeles:', err);
    return null;
  }
}