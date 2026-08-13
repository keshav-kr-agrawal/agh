'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  X, 
  Layers, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { Category } from '@/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { SvgProductPlaceholder } from './SvgProductPlaceholder';

interface ProductImageGalleryProps {
  images?: string[];
  title: string;
  category: Category;
  compact?: boolean;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images = [],
  title,
  category,
  compact = false
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>({});

  const validImages = images.filter((_, idx) => !failedIndices[idx]);
  const hasMultiple = validImages.length > 1;

  const currentImageRaw = validImages[activeIndex] || validImages[0] || images[0];
  const isFallbackNeeded = !currentImageRaw || failedIndices[activeIndex];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (validImages.length <= 1) return;
    setActiveIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (validImages.length <= 1) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
  };

  return (
    <div className="w-full flex flex-col gap-3 font-sans select-none">
      {/* Main Image Container */}
      <div 
        onClick={() => {
          if (!isFallbackNeeded) setIsLightboxOpen(true);
        }}
        className={`relative w-full rounded-2xl sm:rounded-3xl bg-cream-muted border border-cream-border overflow-hidden group cursor-pointer shadow-inner flex items-center justify-center transition-all duration-300 ${
          compact ? 'aspect-square max-h-[280px]' : 'aspect-square max-h-[380px] sm:max-h-[460px]'
        }`}
      >
        {!isFallbackNeeded ? (
          <img
            src={getOptimizedImageUrl(currentImageRaw, { width: 1000, height: 1000 })}
            alt={`${title} - Photo ${activeIndex + 1}`}
            onError={() => setFailedIndices((prev) => ({ ...prev, [activeIndex]: true }))}
            className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <SvgProductPlaceholder category={category} title={title} />
        )}

        {/* E-Commerce Image Counter Badge */}
        {validImages.length > 0 && !isFallbackNeeded && (
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-espresso/70 backdrop-blur-md text-cream text-[10px] font-bold font-mono tracking-wider flex items-center gap-1 shadow-md">
            <Layers className="w-3 h-3 text-gold" />
            {activeIndex + 1} / {validImages.length}
          </div>
        )}

        {/* Click to Zoom Hover Overlay Badge */}
        {!isFallbackNeeded && (
          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-cream/90 text-espresso text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-md flex items-center gap-1.5 border border-cream-border">
            <ZoomIn className="w-3.5 h-3.5 text-terracotta" /> Tap to Zoom
          </div>
        )}

        {/* Prev / Next Chevrons on Main Image */}
        {hasMultiple && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cream/90 text-espresso hover:bg-terracotta hover:text-cream transition shadow-lg backdrop-blur-md border border-cream-border opacity-90 hover:scale-110 active:scale-95 z-10"
              aria-label="Previous product image"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cream/90 text-espresso hover:bg-terracotta hover:text-cream transition shadow-lg backdrop-blur-md border border-cream-border opacity-90 hover:scale-110 active:scale-95 z-10"
              aria-label="Next product image"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>

      {/* Interactive Thumbnails Bar */}
      {hasMultiple && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
          {validImages.map((imgUrl, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                  isActive 
                    ? 'border-terracotta ring-2 ring-terracotta/30 scale-105 shadow-md' 
                    : 'border-cream-border opacity-70 hover:opacity-100 hover:border-terracotta/50'
                }`}
              >
                <img
                  src={getOptimizedImageUrl(imgUrl, { width: 200, height: 200 })}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <span className="absolute bottom-0 inset-x-0 bg-terracotta text-cream text-[8px] font-bold uppercase text-center py-0.5">
                    Cover
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX ZOOM MODAL */}
      {isLightboxOpen && !isFallbackNeeded && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn"
        >
          {/* Header Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-cream z-10">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm sm:text-base text-gold">
                {title}
              </span>
              <span className="text-xs text-cream/60 font-mono">
                ({activeIndex + 1} of {validImages.length})
              </span>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-crimson text-cream transition"
              title="Close Fullscreen View"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Fullscreen Image Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[75vh] flex items-center justify-center my-auto w-full"
          >
            <img
              src={getOptimizedImageUrl(currentImageRaw, { width: 1600 })}
              alt={title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl animate-scaleUp"
            />

            {hasMultiple && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-cream hover:bg-terracotta transition shadow-2xl backdrop-blur-md"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-cream hover:bg-terracotta transition shadow-2xl backdrop-blur-md"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Thumbnails Bottom Strip */}
          {hasMultiple && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 overflow-x-auto p-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 z-10"
            >
              {validImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                    idx === activeIndex ? 'border-terracotta scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={getOptimizedImageUrl(imgUrl, { width: 150 })} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
