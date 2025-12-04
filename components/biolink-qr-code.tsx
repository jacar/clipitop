"use client";

import React from 'react';
import { useQRCode } from 'next-qrcode';

interface BiolinkQRCodeProps {
    url: string;
    size?: number;
    darkColor?: string;
    lightColor?: string;
}

export function BiolinkQRCode({
    url,
    size = 200,
    darkColor = '#000000',
    lightColor = '#FFFFFF'
}: BiolinkQRCodeProps) {
    const { SVG } = useQRCode();

    return (
        <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg shadow-sm border">
            <SVG
                text={url}
                options={{
                    margin: 2,
                    width: size,
                    color: {
                        dark: darkColor,
                        light: lightColor,
                    },
                }}
            />
            <p className="text-xs text-muted-foreground text-center break-all max-w-[200px]">
                {url}
            </p>
        </div>
    );
}
