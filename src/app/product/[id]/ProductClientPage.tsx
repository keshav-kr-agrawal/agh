'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Share2, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Flame, 
  Sparkles, 
  ChevronRight,
  Package,
  Clock,
  Award
} from 'lucide-react';
import { Product } from '@/types';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import { useCartStore } from '@/store/useCartStore';
import { Navbar } from '@/components/Navbar';

interface ProductClientPageProps {
  initialProduct: Product;
}

export default function ProductClientPage({ initialProduct }: ProductClientPageProps) {
  const [product] = useState<Product>(initialProduct);
  const { addToCart, toggleWishlist, isInWishlist } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    available?: boolean;
    estimatedDays?: number;
    rate?: number;
    message?: string;
  }>({ checked: false });

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;

  const productUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://anitagifthouse.com/product/${product.id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on Anita Gift House for ₹${product.price}!`,
          url: productUrl
        });
        return;
      } catch (e) {}
    }

    try {
      await navigator.clipboard.writeText(productUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      alert(`Product Link: ${productUrl}`);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`*${product.title}*\nPrice: ₹${product.price}\nCheck it out here: ${productUrl}`);
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

  const discountPercent = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-cream text-espresso font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-espresso/60 overflow-x-auto pb-1">
          <Link href="/" className="hover:text-terracotta transition font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-espresso/40 shrink-0" />
          <Link href={`/?category=${product.category}`} className="hover:text-terracotta transition font-medium">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-espresso/40 shrink-0" />
          <span className="font-bold text-espresso line-clamp-1">{product.title}</span>
        </nav>

        {/* Product Main Showcase */}
        <div className="bg-cream border border-cream-border rounded-3xl p-4 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Multi-Photo E-Commerce Gallery */}
          <div className="lg:col-span-6 bg-cream-muted p-4 sm:p-6 rounded-3xl border border-cream-border">
            <ProductImageGallery
              images={product.images}
              title={product.title}
              category={product.category}
            />
          </div>

          {/* Column 2: Product Info & Purchase Form */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-3 py-1 bg-terracotta/10 text-terracotta text-xs font-extrabold rounded-full uppercase tracking-wider">
                  {product.category}
                </span>

                {(product.urgencyFlag || isLowStock) && (
                  <span className="px-3 py-1 bg-crimson text-cream text-xs font-bold rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                    <Flame className="w-3.5 h-3.5 text-gold" />
                    {isLowStock ? `Only ${product.stock} Left!` : 'High Demand'}
                  </span>
                )}

                {product.isHandpickedFeatured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-gold to-amberGold text-espresso text-xs font-extrabold rounded-full flex items-center gap-1 shadow-xs uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5" /> Featured Handpicked
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-espresso leading-snug">
                {product.title}
              </h1>

              {/* Price Tag Box */}
              <div className="mt-4 p-4 bg-cream-muted rounded-2xl border border-cream-border flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-extrabold font-mono text-crimson">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-sm text-espresso/40 line-through font-mono">
                      MRP ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-amberGold-dark bg-amberGold/15 px-2 py-0.5 rounded-md">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded block sm:inline-block">
                  Inclusive of all taxes & doorstep delivery
                </span>
              </div>
            </div>

            <p className="text-sm text-espresso/80 leading-relaxed border-b border-cream-border pb-4">
              {product.description}
            </p>

            {/* Key Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="border border-cream-border rounded-2xl p-4 bg-cream-muted/60 space-y-2">
                <h3 className="font-bold text-xs text-espresso uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-terracotta" /> Product Details & Specs
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="bg-cream p-2 rounded-xl border border-cream-border/60">
                      <span className="text-espresso/50 block text-[10px] uppercase font-bold">{key}</span>
                      <span className="font-semibold text-espresso">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pincode Lookup Widget */}
            <div className="border border-cream-border rounded-2xl p-4 bg-cream-muted">
              <label className="block text-xs font-bold text-espresso mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-terracotta" /> Delivery Availability & Shipping Time
              </label>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3.5 py-2 bg-cream border border-cream-border rounded-xl text-xs font-mono text-espresso"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-terracotta text-cream text-xs font-bold rounded-xl hover:bg-crimson transition"
                >
                  Check Speed
                </button>
              </form>

              {pincodeStatus.checked && (
                <p className={`text-xs mt-2.5 font-medium flex items-center gap-1.5 ${pincodeStatus.available ? 'text-emerald-700' : 'text-crimson'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Quantity & Cart Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-cream-border rounded-2xl bg-cream-muted px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 text-base font-bold text-espresso hover:text-terracotta"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-2 text-base font-bold text-espresso hover:text-terracotta"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-terracotta to-crimson text-cream font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:brightness-110 active:scale-98 transition disabled:opacity-50"
                >
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  {isOutOfStock ? 'Sold Out' : `Add to Cart • ₹${(product.price * quantity).toLocaleString('en-IN')}`}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-2xl border border-cream-border transition shadow-xs ${
                    isWishlisted ? 'bg-crimson text-cream' : 'bg-cream text-espresso hover:bg-cream-muted'
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Product Share Row */}
              <div className="flex items-center justify-between p-3.5 bg-cream-muted rounded-2xl border border-cream-border">
                <span className="text-xs font-bold text-espresso flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-terracotta" /> Share Product with Friends
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWhatsAppShare}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-cream text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-3 py-1.5 bg-cream border border-cream-border hover:bg-terracotta hover:text-cream text-espresso text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-terracotta" /> Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-espresso/70 font-semibold pt-2">
                <div className="p-2 bg-cream-muted/50 rounded-xl border border-cream-border/60 flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-gold-dark" />
                  100% Quality Assurance
                </div>
                <div className="p-2 bg-cream-muted/50 rounded-xl border border-cream-border/60 flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-terracotta" />
                  Express Delhivery
                </div>
                <div className="p-2 bg-cream-muted/50 rounded-xl border border-cream-border/60 flex flex-col items-center gap-1">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  Live Order Tracking
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
