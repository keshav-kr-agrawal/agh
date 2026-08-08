'use client';

import React from 'react';
import { Category } from '@/types';

interface SvgProductPlaceholderProps {
  category: Category;
  title: string;
  className?: string;
}

export const SvgProductPlaceholder: React.FC<SvgProductPlaceholderProps> = ({
  category,
  title,
  className = 'w-full h-full'
}) => {
  const getCategoryColor = () => {
    switch (category) {
      case 'Rakhi':
        return { from: '#7A1C1C', to: '#8B3A2B', accent: '#D4AF37' };
      case 'Handpicked':
        return { from: '#8B3A2B', to: '#5C1414', accent: '#E5A93C' };
      case 'Hampers':
        return { from: '#221C1B', to: '#8B3A2B', accent: '#D4AF37' };
      case 'Toys':
        return { from: '#E5A93C', to: '#8B3A2B', accent: '#FFFDF9' };
      default:
        return { from: '#8B3A2B', to: '#7A1C1C', accent: '#D4AF37' };
    }
  };

  const colors = getCategoryColor();

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`
      }}
    >
      {/* Background Subtle Mandala / Geometric Rings */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="30" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="15" stroke="#D4AF37" strokeWidth="0.5" fill="none" strokeDasharray="1 1" />
      </svg>

      {/* Category Specific SVG Vectors */}
      <div className="relative z-10 text-gold mb-3 transform hover:scale-110 transition-transform duration-300">
        {category === 'Rakhi' && (
          <svg className="w-16 h-16 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="32" cy="32" r="12" fill="#D4AF37" fillOpacity="0.2" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="32" cy="32" r="6" fill="#D4AF37" />
            <path d="M4 32H20M44 32H60" stroke="#E5A93C" strokeWidth="3" strokeLinecap="round" />
            <path d="M12 28L20 32L12 36M52 28L44 32L52 36" stroke="#D4AF37" strokeWidth="1.5" />
          </svg>
        )}

        {category === 'Handpicked' && (
          <svg className="w-16 h-16 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M32 8L40 24H24L32 8Z" fill="#D4AF37" fillOpacity="0.3" stroke="#D4AF37" />
            <path d="M16 28C16 28 20 48 32 48C44 48 48 28 48 28" stroke="#E5A93C" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M32 48V56M20 56H44" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="20" r="3" fill="#D4AF37" />
          </svg>
        )}

        {category === 'Hampers' && (
          <svg className="w-16 h-16 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="12" y="24" width="40" height="32" rx="4" fill="#D4AF37" fillOpacity="0.15" stroke="#D4AF37" strokeWidth="2" />
            <path d="M8 24H56V18C56 15.7909 54.2091 14 52 14H12C9.79086 14 8 15.7909 8 18V24Z" fill="#E5A93C" fillOpacity="0.3" stroke="#E5A93C" />
            <path d="M32 14V56" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 2" />
            <path d="M24 14C24 10 28 8 32 11C36 8 40 10 40 14" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {category === 'Toys' && (
          <svg className="w-16 h-16 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="16" y="20" width="32" height="24" rx="4" fill="#E5A93C" fillOpacity="0.2" stroke="#E5A93C" strokeWidth="2" />
            <circle cx="24" cy="48" r="5" stroke="#D4AF37" strokeWidth="2" fill="#221C1B" />
            <circle cx="40" cy="48" r="5" stroke="#D4AF37" strokeWidth="2" fill="#221C1B" />
            <path d="M24 20V12H36V20" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {(category as string === 'Gifts' || category as string === 'Special Offers') && (
          <svg className="w-16 h-16 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="12" y="28" width="40" height="28" rx="3" fill="#D4AF37" fillOpacity="0.2" stroke="#D4AF37" strokeWidth="2" />
            <rect x="8" y="20" width="48" height="8" rx="2" fill="#E5A93C" fillOpacity="0.4" stroke="#E5A93C" strokeWidth="2" />
            <path d="M32 20V56" stroke="#D4AF37" strokeWidth="2.5" />
            <path d="M32 20C26 14 18 16 22 20Z" fill="#D4AF37" />
            <path d="M32 20C38 14 46 16 42 20Z" fill="#D4AF37" />
          </svg>
        )}
      </div>

      {/* Title Badge */}
      <span className="relative z-10 font-serif font-bold text-cream text-xs line-clamp-1 px-3 py-1 bg-espresso/40 backdrop-blur-xs rounded-full border border-gold/30">
        {title}
      </span>
    </div>
  );
};
