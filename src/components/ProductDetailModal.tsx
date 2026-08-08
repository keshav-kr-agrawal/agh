'use client';

import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Flame, 
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { useCartStore } from '@/store/useCartStore';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { SvgProductPlaceholder } from './SvgProductPlaceholder';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useStorefrontStore();
  const { addToCart, toggleWishlist, isInWishlist } = useCartStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    available?: boolean;
    estimatedDays?: number;
    rate?: number;
    message?: string;
  }>({ checked: false });

  if (!selectedProduct) return null;

  const isWishlisted = isInWishlist(selectedProduct.id);
  const isOutOfStock = selectedProduct.stock <= 0;

  const images = selectedProduct.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'];

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus({ checked: true, available: false, message: 'Please enter a valid 6-digit Pincode' });
      return;
    }

    try {
      const res = await fetch('/api/shipping/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode })
      });
      const json = await res.json();
      if (json.success) {
        setPincodeStatus({
          checked: true,
          available: json.data.available,
          estimatedDays: json.data.estimatedDays,
          rate: json.data.rate,
          message: `Delivery available in ${json.data.estimatedDays} business days via Delhivery Express (₹${json.data.rate}).`
        });
      }
    } catch {
      setPincodeStatus({ checked: true, available: true, estimatedDays: 3, rate: 60, message: 'Express shipping available to your location!' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-cream border border-cream-border rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-cream-muted text-espresso/70 hover:text-espresso hover:bg-cream-border transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Multi-Photo Carousel */}
          <div className="p-6 bg-cream-muted border-b md:border-b-0 md:border-r border-cream-border flex flex-col justify-between">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-cream-border shadow-inner group">
              {images.length > 0 && getOptimizedImageUrl(images[activeImageIndex]) ? (
                <img
                  src={getOptimizedImageUrl(images[activeImageIndex], { width: 800, height: 800 })}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <SvgProductPlaceholder category={selectedProduct.category} title={selectedProduct.title} />
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cream/80 text-espresso hover:bg-cream transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cream/80 text-espresso hover:bg-cream transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      idx === activeImageIndex ? 'border-terracotta scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Lookup Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6 max-h-[80vh] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-terracotta/10 text-terracotta text-xs font-extrabold rounded-full uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
                {selectedProduct.urgencyFlag && (
                  <span className="px-3 py-1 bg-crimson text-cream text-xs font-bold rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3 text-gold" /> High Demand
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-serif font-bold text-espresso mb-2">
                {selectedProduct.title}
              </h2>

              <div className="flex items-center gap-4 text-xs mb-4">
                <span className={`font-semibold ${selectedProduct.stock <= 5 ? 'text-crimson' : 'text-emerald-700'}`}>
                  {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock} left)` : 'Out of Stock'}
                </span>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mb-4 p-3 bg-cream-muted rounded-2xl border border-cream-border">
                <span className="text-2xl font-bold font-mono text-crimson">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.mrp > selectedProduct.price && (
                  <span className="text-sm text-espresso/40 line-through font-mono">
                    MRP: ₹{selectedProduct.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Inclusive of All Charges
                </span>
              </div>

              <p className="text-xs text-espresso/80 leading-relaxed mb-4">
                {selectedProduct.description}
              </p>

              {/* Key Specs Table */}
              {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                <div className="mb-6 border border-cream-border rounded-xl p-3 bg-cream-muted/50 text-xs">
                  <p className="font-bold text-espresso mb-2 uppercase text-[11px] tracking-wide">Key Specifications</p>
                  <div className="space-y-1.5">
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-cream-border/40 pb-1">
                        <span className="text-espresso/60">{key}:</span>
                        <span className="font-semibold text-espresso">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pincode Lookup Placeholder */}
              <div className="border border-cream-border rounded-2xl p-4 bg-cream-muted mb-6">
                <label className="block text-xs font-bold text-espresso mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-terracotta" /> Delivery Pincode Lookup
                </label>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 px-3 py-1.5 bg-cream border border-cream-border rounded-lg text-xs font-mono text-espresso"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-terracotta text-cream text-xs font-bold rounded-lg hover:bg-crimson transition"
                  >
                    Check
                  </button>
                </form>

                {pincodeStatus.checked && (
                  <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${pincodeStatus.available ? 'text-emerald-700' : 'text-crimson'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {pincodeStatus.message}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-cream-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-cream-border rounded-xl bg-cream-muted px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 text-sm font-bold text-espresso hover:text-terracotta"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    className="px-2 text-sm font-bold text-espresso hover:text-terracotta"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    const added = addToCart(selectedProduct, quantity);
                    if (added) {
                      setSelectedProduct(null);
                    }
                  }}
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-terracotta to-crimson text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 transition disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-gold" />
                  Add to Cart • ₹{(selectedProduct.price * quantity).toLocaleString('en-IN')}
                </button>

                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className={`p-3 rounded-xl border border-cream-border transition ${
                    isWishlisted ? 'bg-crimson text-cream' : 'bg-cream text-espresso hover:bg-cream-muted'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] text-espresso/60 font-medium pt-1">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-gold-dark" /> 100% Authentic Quality</span>
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-terracotta" /> Fast Delhivery Express</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
