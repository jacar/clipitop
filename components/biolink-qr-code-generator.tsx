import React from 'react';
import { QRCodeGenerator } from '@/lib/qr-code-generator';

interface BiolinkQRCodeGeneratorProps {
  username: string;
  size?: number;
  darkColor?: string;
  lightColor?: string;
}

export function BiolinkQRCodeGenerator({ username, size = 256, darkColor = '#000000', lightColor = '#FFFFFF' }: BiolinkQRCodeGeneratorProps) {
  const biolinkUrl = `https://clipi.top/${username}`; // Asumiendo que clipi.top es el dominio base

  return (
    <QRCodeGenerator
      text={biolinkUrl}
      size={size}
      darkColor={darkColor}
      lightColor={lightColor}
    />
  );
}
