'use client';

import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Flame, Sparkles, Award } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { SvgProductPlaceholder } from './SvgProductPlaceholder';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCartStore();
  const { setSelectedProduct } = useStorefrontStore();
  const [imgError, setImgError] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock <= 0;
  const isUrgent = product.urgencyFlag || isLowStock;

  const marginPercent = Math.round(((product.price - product.costPrice) / product.price) * 100);
  const isHighMargin = marginPercent >= 50;

  const discountPercent = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const imageUrl = product.images && product.images.length > 0 && !imgError
    ? getOptimizedImageUrl(product.images[0], { width: 600, height: 600 })
    : null;

  return (
    <div className="group relative bg-cream border border-cream-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Visual Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {isUrgent && !isOutOfStock && (
          <span className="inline-flex items-center gap-1 bg-crimson text-cream text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
            <Flame className="w-3 h-3 text-gold" />
            {product.stock <= 5 ? `Only ${product.stock} Left!` : 'High Demand!'}
          </span>
        )}

        {isHighMargin && (
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-gold to-amberGold text-espresso text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
            <Award className="w-3 h-3" />
            Editor's Choice
          </span>
        )}

        {product.isHandpickedFeatured && (
          <span className="inline-flex items-center gap-1 bg-terracotta text-cream text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Sparkles className="w-3 h-3 text-gold" />
            Handpicked
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={e => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition ${
          isWishlisted
            ? 'bg-crimson text-cream shadow-md'
            : 'bg-cream/80 text-espresso hover:bg-cream hover:scale-110'
        }`}
        aria-label="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container with SVG Vector Fallback */}
      <div 
        onClick={() => setSelectedProduct(product)}
        className="relative w-full aspect-square bg-cream-muted overflow-hidden cursor-pointer"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          />
        ) : (
          <SvgProductPlaceholder category={product.category} title={product.title} />
        )}

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-espresso/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={e => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cream text-espresso text-xs font-bold rounded-full shadow-lg hover:bg-gold transition transform scale-95 group-hover:scale-100"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-espresso/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-crimson text-cream font-bold text-xs uppercase px-4 py-1.5 rounded-full tracking-wider shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs text-espresso/60 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-terracotta">
              {product.category}
            </span>
          </div>

          <h3 
            onClick={() => setSelectedProduct(product)}
            className="font-serif font-bold text-espresso text-base line-clamp-1 hover:text-terracotta transition cursor-pointer mb-1"
          >
            {product.title}
          </h3>

          <p className="text-xs text-espresso/70 line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price Breakdown */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-crimson font-mono">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-xs text-espresso/40 line-through font-mono">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-bold text-amberGold-dark bg-amberGold/15 px-1.5 py-0.5 rounded">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Action Button */}
          <button
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-sm ${
              isOutOfStock
                ? 'bg-cream-border text-espresso/40 cursor-not-allowed'
                : 'bg-terracotta text-cream hover:bg-crimson hover:shadow-md active:scale-98'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
