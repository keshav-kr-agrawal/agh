'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Share2,
  Copy,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { useCartStore } from '@/store/useCartStore';
import { ProductImageGallery } from './ProductImageGallery';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useStorefrontStore();
  const { addToCart, toggleWishlist, isInWishlist } = useCartStore();

  const [copiedLink, setCopiedLink] = useState(false);
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
  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/product/${selectedProduct.id}`
    : `/product/${selectedProduct.id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedProduct.title,
          text: `Check out ${selectedProduct.title} on Anita Gift House for ₹${selectedProduct.price}!`,
          url: productUrl
        });
        return;
      } catch (e) {}
    }
    // Fallback to copy link
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      alert(`Product link: ${productUrl}`);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`*${selectedProduct.title}*\nPrice: ₹${selectedProduct.price}\nCheck it out here: ${productUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

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
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedProduct(null);
      }}
      className="fixed inset-0 z-50 bg-espresso/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 font-sans animate-fadeIn"
    >
      <div className="relative w-full max-w-[calc(100vw-1rem)] sm:max-w-4xl max-h-[94vh] sm:max-h-[90vh] bg-cream border border-cream-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto animate-slideUp flex flex-col">
        {/* Sticky Mobile & Desktop Close Header Bar */}
        <div className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md px-4 py-3 border-b border-cream-border/60 flex items-center justify-between shrink-0">
          <span className="font-serif font-bold text-xs sm:text-sm text-espresso line-clamp-1">
            {selectedProduct.title}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/product/${selectedProduct.id}`}
              onClick={() => setSelectedProduct(null)}
              className="px-2.5 py-1 rounded-xl bg-terracotta/10 text-terracotta hover:bg-terracotta hover:text-cream text-xs font-bold transition flex items-center gap-1"
              title="Open full product page"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Full Page
            </Link>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-1.5 rounded-full bg-cream-muted text-espresso hover:bg-crimson hover:text-cream transition border border-cream-border shrink-0"
              title="Close Product Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* E-Commerce Multi-Photo Gallery Preview */}
          <div className="p-4 sm:p-6 bg-cream-muted border-b md:border-b-0 md:border-r border-cream-border flex flex-col justify-between">
            <ProductImageGallery
              images={selectedProduct.images}
              title={selectedProduct.title}
              category={selectedProduct.category}
              compact
            />

            {/* Quick Share Buttons beneath Gallery */}
            <div className="mt-4 pt-3 border-t border-cream-border flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-espresso/60 uppercase tracking-wider">
                Share Item:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-cream text-[11px] font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </button>
                <button
                  onClick={handleShare}
                  className="px-2.5 py-1.5 bg-cream border border-cream-border hover:bg-terracotta hover:text-cream text-espresso text-[11px] font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-terracotta" /> Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Details & Lookup Column */}
          <div className="p-4 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-3 py-1 bg-terracotta/10 text-terracotta text-[11px] font-extrabold rounded-full uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
                {selectedProduct.urgencyFlag && (
                  <span className="px-3 py-1 bg-crimson text-cream text-[11px] font-bold rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3 text-gold" /> High Demand
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-espresso mb-2">
                {selectedProduct.title}
              </h2>

              <div className="flex items-center gap-4 text-xs mb-3">
                <span className={`font-semibold ${selectedProduct.stock <= 5 ? 'text-crimson' : 'text-emerald-700'}`}>
                  {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock} left)` : 'Out of Stock'}
                </span>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mb-4 p-3 bg-cream-muted rounded-2xl border border-cream-border flex-wrap">
                <span className="text-xl sm:text-2xl font-bold font-mono text-crimson">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.mrp > selectedProduct.price && (
                  <span className="text-xs text-espresso/40 line-through font-mono">
                    MRP: ₹{selectedProduct.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Inclusive of All Charges
                </span>
              </div>

              <p className="text-xs text-espresso/80 leading-relaxed mb-4">
                {selectedProduct.description}
              </p>

              {/* Key Specs Table */}
              {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                <div className="mb-4 border border-cream-border rounded-xl p-3 bg-cream-muted/50 text-xs">
                  <p className="font-bold text-espresso mb-2 uppercase text-[11px] tracking-wide">Key Specifications</p>
                  <div className="space-y-1.5">
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-cream-border/40 pb-1 text-[11px]">
                        <span className="text-espresso/60">{key}:</span>
                        <span className="font-semibold text-espresso">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pincode Lookup Placeholder */}
              <div className="border border-cream-border rounded-2xl p-3 sm:p-4 bg-cream-muted mb-4">
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
                    className="px-3.5 py-1.5 bg-terracotta text-cream text-xs font-bold rounded-lg hover:bg-crimson transition"
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

            {/* Bottom Actions & Mobile Exit Button */}
            <div className="space-y-3 pt-3 border-t border-cream-border">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center border border-cream-border rounded-xl bg-cream-muted px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 text-sm font-bold text-espresso hover:text-terracotta"
                  >
                    -
                  </button>
                  <span className="px-2.5 text-xs font-bold font-mono">{quantity}</span>
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
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 bg-gradient-to-r from-terracotta to-crimson text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 transition disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-gold" />
                  {isOutOfStock ? 'Sold Out' : `Add to Cart • ₹${(selectedProduct.price * quantity).toLocaleString('en-IN')}`}
                </button>

                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className={`p-3 rounded-xl border border-cream-border transition ${
                    isWishlisted ? 'bg-crimson text-cream' : 'bg-cream text-espresso hover:bg-cream-muted'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Explicit Mobile Bottom Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full py-2 bg-cream-muted border border-cream-border text-espresso/70 font-semibold text-xs rounded-xl hover:bg-cream-border transition block sm:hidden"
              >
                Close Preview
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-espresso/60 font-medium pt-1">
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
