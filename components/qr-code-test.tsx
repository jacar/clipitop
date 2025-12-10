import React from 'react';
import { QRCodeGenerator } from '@/lib/qr-code-generator';

export function QRCodeTest() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-bold mb-4">Generador de Código QR de Prueba</h2>
      <QRCodeGenerator text="https://www.google.com" size={200} darkColor="#00008B" lightColor="#ADD8E6" />
      <p className="mt-4 text-sm text-gray-600">Escanea este código QR para ir a Google.</p>
    </div>
  );
}
