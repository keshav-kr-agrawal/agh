'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, LogIn, UserPlus, X, ShieldCheck, User, Phone } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export const AuthRequiredModal: React.FC = () => {
  const { isAuthRequiredModalOpen, closeAuthRequiredModal } = useCartStore();
  const { registerCustomer, loginWithGoogle } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  if (!isAuthRequiredModalOpen) return null;

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    const fullName = name.trim() || `Customer (${phone.slice(-4)})`;
    registerCustomer({
      phone,
      name: fullName
    });

    const pending = useCartStore.getState().pendingProduct;
    closeAuthRequiredModal();

    if (pending) {
      useCartStore.getState().addToCart(pending, 1);
      useCartStore.getState().setPendingProduct(null);
    } else {
      useCartStore.getState().openCart();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-espresso/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans animate-fadeIn">
      <div className="relative w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md bg-cream border border-cream-border rounded-3xl p-5 sm:p-8 shadow-2xl space-y-4 text-center animate-scaleUp max-h-[92vh] overflow-y-auto">
        <button
          onClick={closeAuthRequiredModal}
          className="absolute top-4 right-4 p-2 rounded-full text-espresso/60 hover:text-espresso hover:bg-cream-muted transition"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-terracotta to-crimson text-gold flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-serif font-bold text-espresso">
            Customer Account Required
          </h3>
          <p className="text-xs text-espresso/70 leading-relaxed max-w-xs mx-auto">
            Please log in or enter your mobile number to add items to your cart & place orders.
          </p>
        </div>

        {/* Quick Instant Login Form */}
        <form onSubmit={handleQuickLogin} className="space-y-3 text-xs pt-1">
          <div>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-terracotta absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Mobile Phone Number (+91 98765 43210)"
                className="w-full pl-9 pr-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl font-mono text-xs focus:ring-2 focus:ring-terracotta"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-terracotta absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your Full Name (Optional)"
                className="w-full pl-9 pr-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl text-xs focus:ring-2 focus:ring-terracotta"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-terracotta text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-crimson transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-gold" />
            Quick Login & Continue Shopping
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            closeAuthRequiredModal();
            loginWithGoogle();
          }}
          className="w-full py-2.5 bg-white border border-cream-border text-espresso font-bold text-xs rounded-xl shadow-xs hover:bg-cream-muted transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-cream-border/60"></div>
          <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-espresso/40">Or Use Portal</span>
          <div className="flex-grow border-t border-cream-border/60"></div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Link
            href="/login?redirect=cart"
            onClick={closeAuthRequiredModal}
            className="py-2.5 px-2 bg-cream-muted border border-cream-border text-espresso font-bold rounded-xl hover:bg-cream-border transition text-center line-clamp-1"
          >
            Full Login Page
          </Link>

          <Link
            href="/signup?redirect=cart"
            onClick={closeAuthRequiredModal}
            className="py-2.5 px-2 bg-cream-muted border border-cream-border text-terracotta font-bold rounded-xl hover:bg-cream-border transition text-center line-clamp-1"
          >
            Register Account
          </Link>
        </div>

        <div className="pt-2 border-t border-cream-border/60 flex items-center justify-center gap-2 text-[11px] text-espresso/60">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
          <span>Safe & Instant Customer Access</span>
        </div>
      </div>
    </div>
  );
};
