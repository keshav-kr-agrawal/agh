'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Product, Category } from '@/types';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { useCartStore } from '@/store/useCartStore';
import { 
  SlidersHorizontal, 
  Sparkles, 
  Store, 
  Truck, 
  RotateCcw, 
  Search, 
  Layers,
  ArrowUpDown
} from 'lucide-react';

export const MerchandisingGrid: React.FC = () => {
  const { 
    selectedCategory, 
    searchQuery, 
    priceRange, 
    setPriceRange, 
    inStockOnly, 
    setInStockOnly,
    resetFilters 
  } = useStorefrontStore();
  const { fulfillmentType, setFulfillmentType } = useCartStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCatalog() {
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') queryParams.set('category', selectedCategory);
        if (searchQuery) queryParams.set('search', searchQuery);
        if (fulfillmentType) queryParams.set('fulfillmentType', fulfillmentType);
        if (inStockOnly) queryParams.set('inStockOnly', 'true');
        queryParams.set('maxPrice', priceRange[1].toString());

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalog();

    // Real-Time Stock Polling & Window Focus Refetch
    const interval = setInterval(fetchCatalog, 4000);
    const handleFocus = () => fetchCatalog();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [selectedCategory, searchQuery, fulfillmentType, inStockOnly, priceRange]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Banner Header */}
      <div className="relative mb-10 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-crimson via-terracotta to-espresso text-cream shadow-xl overflow-hidden border border-gold/30">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 text-gold text-xs font-extrabold rounded-full uppercase tracking-wider border border-gold/30">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Festival & Celebration Catalogue
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-cream">
            Handpicked Gifts <br />
            <span className="text-gold">Crafted with Love</span>
          </h2>
          <p className="text-xs sm:text-sm text-cream/80 leading-relaxed max-w-xl">
            Explore authentic Kundan Rakhis, solid brass pooja thalis, organic sweet towers, and educational STEM toys. Delivered straight to your doorstep or ready for 2-hour store pickup.
          </p>

          {/* Fulfillment Toggle Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFulfillmentType('parcel')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shadow-md ${
                fulfillmentType === 'parcel'
                  ? 'bg-gold text-espresso ring-2 ring-gold-light'
                  : 'bg-cream/10 text-cream hover:bg-cream/20'
              }`}
            >
              <Truck className="w-4 h-4" />
              Parcel Express Shipping
            </button>
            <button
              onClick={() => setFulfillmentType('handpicked')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shadow-md ${
                fulfillmentType === 'handpicked'
                  ? 'bg-amberGold text-espresso ring-2 ring-gold-light'
                  : 'bg-cream/10 text-cream hover:bg-cream/20'
              }`}
            >
              <Store className="w-4 h-4" />
              Handpicked Store Pickup (₹0 Fee)
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="bg-cream-muted border border-cream-border rounded-2xl p-4 mb-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-espresso">
            <SlidersHorizontal className="w-4 h-4 text-terracotta" />
            <span>Merchandising & Catalog Controls</span>
            <span className="text-espresso/40 font-normal">({products.length} products found)</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Price Slider */}
            <div className="flex items-center gap-2">
              <span className="text-espresso/70 font-medium">Max Price:</span>
              <input
                type="range"
                min="300"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={e => setPriceRange([0, Number(e.target.value)])}
                className="accent-terracotta cursor-pointer w-28 sm:w-36"
              />
              <span className="font-mono font-bold text-crimson">₹{priceRange[1]}</span>
            </div>

            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer font-medium text-espresso/80">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="rounded text-terracotta focus:ring-terracotta"
              />
              In-Stock Only
            </label>

            {/* Reset Filters */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-espresso/60 hover:text-crimson hover:bg-cream rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid Layout */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-cream-muted border border-cream-border rounded-3xl h-80 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-cream-muted border border-cream-border rounded-3xl space-y-3">
          <Search className="w-12 h-12 text-espresso/30 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-espresso">No items found matching criteria</h3>
          <p className="text-xs text-espresso/60 max-w-sm mx-auto">Try resetting filters or adjusting search keyword terms.</p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-terracotta text-cream text-xs font-bold rounded-full shadow hover:bg-crimson transition"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
