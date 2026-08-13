'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WHATSAPP_NUMBER = '919199272836';
export const WHATSAPP_DISPLAY = '+91 9199272836';

export function getWhatsAppUrl(customText?: string) {
  const defaultText = 'Hello Anita Gift House! I would like to inquire about your gifts and products.';
  const text = encodeURIComponent(customText || defaultText);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export const FloatingWhatsAppButton: React.FC = () => {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-full shadow-2xl hover:scale-108 active:scale-95 transition-all duration-300 border-2 border-white group font-sans"
      title={`Direct WhatsApp Chat with Anita Gift House (${WHATSAPP_DISPLAY})`}
      aria-label="Direct WhatsApp Chat"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping" />
      </div>
      <span className="hidden sm:inline font-semibold">Need Help? Chat on WhatsApp</span>
    </a>
  );
};
