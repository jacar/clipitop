"use client";

import React from 'react';
import { useQRCode } from 'next-qrcode';

interface QRCodeGeneratorProps {
  text: string;
  size?: number;
  darkColor?: string;
  lightColor?: string;
}

export function QRCodeGenerator({ text, size = 256, darkColor = '#000000', lightColor = '#FFFFFF' }: QRCodeGeneratorProps) {
  const { SVG } = useQRCode();

  return (
    <SVG
      text={text}
      options={{
        margin: 2,
        width: size,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      }}
    />
  );
}
