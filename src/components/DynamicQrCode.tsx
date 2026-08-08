'use client';

import React, { useEffect, useState } from 'react';

interface DynamicQrCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

export const DynamicQrCode: React.FC<DynamicQrCodeProps> = ({
  value,
  size = 180,
  level = 'H',
  includeMargin = true
}) => {
  const [QrComponent, setQrComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('qrcode.react').then(mod => {
      setQrComponent(() => mod.QRCodeSVG);
    }).catch(err => console.error('Failed to load qrcode.react', err));
  }, []);

  if (!QrComponent) {
    return (
      <div 
        className="bg-cream-muted border border-cream-border rounded-xl flex items-center justify-center text-xs text-espresso/40 font-mono mx-auto"
        style={{ width: size, height: size }}
      >
        Generating QR...
      </div>
    );
  }

  return (
    <QrComponent
      value={value}
      size={size}
      level={level}
      includeMargin={includeMargin}
    />
  );
};
