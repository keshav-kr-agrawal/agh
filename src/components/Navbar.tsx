'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Search, 
  Store, 
  Truck, 
  Sparkles, 
  Tag,
  Menu,
  X,
  ShieldCheck,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Category, StoreBanner } from '@/types';
import { supabaseRealtime } from '@/lib/supabase';
import { AuthRequiredModal } from './AuthRequiredModal';

const categories: (Category | 'All' | 'Special Offers')[] = [
  'All',
  'Gifts',
  'Rakhi',
  'Toys',
  'Handpicked',
  'Hampers',
  'Special Offers'
];

const popularKeywords = ['Kundan Rakhi', 'Brass Diya', 'Saffron Trunk', 'Teddy Bear', 'Pashmina', 'Stunt Car'];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount, openCart, fulfillmentType, setFulfillmentType } = useCartStore();
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery 
  } = useStorefrontStore();
  const { user, isAdmin, logout, logoutAdmin, initializeAuth } = useAuthStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [banner, setBanner] = useState<StoreBanner | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchBanner = async () => {
    try {
      const res = await fetch(`/api/promotions?t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.banner) {
        setBanner(json.banner);
      }
    } catch {}
  };

  useEffect(() => {
    setMounted(true);
    initializeAuth();
    fetchBanner();

    const bannerTimer = setInterval(() => {
      fetchBanner();
    }, 3000);

    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('agh_banner_channel');
      broadcastChannel.onmessage = (event) => {
        if (event.data?.type === 'BANNER_UPDATED' && event.data?.banner) {
          setBanner(event.data.banner);
        } else {
          fetchBanner();
        }
      };
    } catch (e) {}

    const handleBannerEvent = (e: any) => {
      if (e.detail) {
        setBanner(e.detail);
      } else {
        fetchBanner();
      }
    };
    window.addEventListener('agh_banner_updated', handleBannerEvent);

    const unsubscribe = supabaseRealtime.subscribe(event => {
      if (event.table === 'banner') {
        fetchBanner();
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(bannerTimer);
      if (broadcastChannel) broadcastChannel.close();
      window.removeEventListener('agh_banner_updated', handleBannerEvent);
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const itemCount = mounted ? getItemCount() : 0;
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return (
      <header className="bg-espresso text-cream border-b border-gold/20 sticky top-0 z-40 shadow-lg font-sans">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0 group">
            <img
              src="/agh.png"
              alt="Anita Gift House"
              className="h-10 w-auto object-contain rounded-xl bg-cream p-1 border border-gold/40 shadow-md group-hover:scale-105 transition"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <Link href="/admin/products" className="px-3 py-1.5 rounded-lg bg-cream/10 text-cream hover:bg-gold hover:text-espresso transition font-semibold hidden sm:inline-block">
              📦 Batch Products & Priorities
            </Link>
            <Link href="/admin/promotions" className="px-3 py-1.5 rounded-lg bg-cream/10 text-cream hover:bg-gold hover:text-espresso transition font-semibold hidden sm:inline-block">
              🏷️ Edit Top Offer & Coupons
            </Link>
            <Link href="/admin/reports" className="px-3 py-1.5 rounded-lg bg-cream/10 text-cream hover:bg-gold hover:text-espresso transition font-semibold hidden sm:inline-block">
              📊 Data Purge
            </Link>
            <Link href="/" className="px-3 py-1.5 rounded-full bg-terracotta text-cream font-bold hover:bg-crimson transition shadow-sm">
              Storefront
            </Link>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="px-3 py-1.5 rounded-full bg-crimson text-cream font-bold hover:bg-crimson-dark transition shadow-sm flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-cream-border shadow-sm font-sans">
        {/* Top Announcement Banner (Editable by Admin in /admin/promotions) */}
        {banner && banner.active && (
          <div className={`bg-gradient-to-r ${banner.bgGradient || 'from-crimson via-terracotta to-crimson'} text-cream text-xs font-medium py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-xs`}>
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse shrink-0" />
            <span className="font-semibold">{banner.text}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-gold hidden sm:inline shrink-0" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Brand Logo Section */}
            <Link href="/" className="flex items-center shrink-0 group">
              <img
                src="/agh.png"
                alt="Anita Gift House"
                className="h-10 sm:h-14 w-auto object-contain rounded-xl p-0.5 group-hover:scale-105 transition duration-300"
              />
            </Link>

            {/* Dynamic Search Bar */}
            <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search Rakhis, Hampers, Brass Diyas, Toys..."
                  className="w-full pl-10 pr-10 py-2.5 bg-cream-muted border border-cream-border rounded-full text-sm text-espresso placeholder-espresso/40 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition shadow-inner"
                />
                <Search className="w-4 h-4 text-espresso/50 absolute left-3.5 top-3" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 text-espresso/40 hover:text-espresso"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Live Search Suggestions Dropdown */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-cream border border-cream-border rounded-2xl shadow-xl p-4 z-50 animate-fadeIn">
                  <p className="text-[11px] font-bold text-espresso/50 uppercase tracking-wider mb-2">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {popularKeywords.map(kw => (
                      <button
                        key={kw}
                        onClick={() => {
                          setSearchQuery(kw);
                          setIsSearchFocused(false);
                        }}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-cream-muted border border-cream-border text-espresso/80 hover:bg-terracotta hover:text-cream hover:border-terracotta transition"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Fulfillment Toggle */}
              <div className="hidden lg:flex items-center bg-cream-muted border border-cream-border rounded-full p-1 text-xs">
                <button
                  onClick={() => setFulfillmentType('parcel')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition ${
                    fulfillmentType === 'parcel'
                      ? 'bg-terracotta text-cream shadow-sm font-semibold'
                      : 'text-espresso/70 hover:text-espresso'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  Parcel Shipping
                </button>
                <button
                  onClick={() => setFulfillmentType('handpicked')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition ${
                    fulfillmentType === 'handpicked'
                      ? 'bg-crimson text-cream shadow-sm font-semibold'
                      : 'text-espresso/70 hover:text-espresso'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  Store Pickup
                </button>
              </div>

              {/* Customer / Admin Auth Controls */}
              {!mounted ? (
                <div className="w-20 h-8" />
              ) : user && !isAdmin ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold bg-cream-muted border border-cream-border text-espresso hover:bg-cream-border transition shadow-xs"
                    title="View Account & Order History"
                  >
                    <User className="w-4 h-4 text-terracotta" />
                    <span className="text-[11px] sm:text-xs">Account ({user.name.split(' ')[0]})</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push('/login');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold bg-crimson/10 text-crimson border border-crimson/20 hover:bg-crimson hover:text-cream transition shadow-xs"
                    title="Log Out Customer Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : isAdmin ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold bg-espresso text-cream hover:bg-espresso/90 transition shadow-xs"
                    title="Admin Control Center"
                  >
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    <span className="text-[11px] sm:text-xs">Admin Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logoutAdmin();
                      router.push('/admin/login');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold bg-crimson/10 text-crimson border border-crimson/20 hover:bg-crimson hover:text-cream transition shadow-xs"
                    title="Log Out Admin Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold bg-terracotta text-cream hover:bg-crimson transition shadow-sm shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0" />
                  <span>Log In</span>
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-terracotta to-crimson text-cream font-medium text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg hover:brightness-110 transition active:scale-95 shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0" />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="bg-gold text-espresso text-[10px] sm:text-xs font-extrabold px-1.5 py-0.2 rounded-full shadow-inner">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 text-espresso hover:text-terracotta shrink-0"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>

          {/* Category Pills Navigation - Edge to Edge Scroll on Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 py-2.5 overflow-x-auto scrollbar-none border-t border-cream-border/60 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-terracotta text-cream shadow-sm font-semibold'
                      : 'bg-cream-muted text-espresso/80 border border-cream-border hover:border-terracotta/40 hover:text-terracotta'
                  }`}
                >
                  {cat === 'Special Offers' ? '🔥 Special Offers' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-cream-border bg-cream p-4 space-y-4 shadow-lg animate-fadeIn">
            {/* Search Input for Mobile */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 bg-cream-muted border border-cream-border rounded-full text-xs text-espresso"
              />
              <Search className="w-3.5 h-3.5 text-espresso/50 absolute left-3 top-2.5" />
            </div>

            {/* Mobile Fulfillment Selector */}
            <div className="flex bg-cream-muted border border-cream-border rounded-xl p-1 text-xs">
              <button
                onClick={() => setFulfillmentType('parcel')}
                className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1 ${
                  fulfillmentType === 'parcel' ? 'bg-terracotta text-cream' : 'text-espresso/70'
                }`}
              >
                <Truck className="w-3.5 h-3.5" /> Express Shipping
              </button>
              <button
                onClick={() => setFulfillmentType('handpicked')}
                className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1 ${
                  fulfillmentType === 'handpicked' ? 'bg-crimson text-cream' : 'text-espresso/70'
                }`}
              >
                <Store className="w-3.5 h-3.5" /> Store Pickup
              </button>
            </div>

            <div className="pt-2 border-t border-cream-border flex items-center justify-between text-xs font-bold">
              {user && !isAdmin ? (
                <>
                  <Link href="/account" className="text-terracotta flex items-center gap-1">
                    <User className="w-4 h-4" /> My Account ({user.name.split(' ')[0]})
                  </Link>
                  <button onClick={() => { logout(); router.push('/login'); }} className="text-crimson flex items-center gap-1">
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </>
              ) : isAdmin ? (
                <>
                  <Link href="/admin" className="text-espresso flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-4 h-4 text-gold" /> Admin Dashboard
                  </Link>
                  <button onClick={() => { logoutAdmin(); router.push('/admin/login'); }} className="text-crimson flex items-center gap-1 font-bold">
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-terracotta font-bold flex items-center gap-1">
                  <LogIn className="w-4 h-4" /> Customer Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
