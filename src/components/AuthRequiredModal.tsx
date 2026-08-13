'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, LogIn, UserPlus, X, ShieldCheck, User, Phone } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export const AuthRequiredModal: React.FC = () => {
  const { isAuthRequiredModalOpen, closeAuthRequiredModal } = useCartStore();
  const { registerCustomer } = useAuthStore();

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

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <Link
            href="/login?redirect=cart"
            onClick={closeAuthRequiredModal}
            className="py-2.5 px-2 bg-terracotta/10 border border-terracotta/20 text-terracotta font-bold rounded-xl hover:bg-terracotta hover:text-cream transition text-center line-clamp-1"
          >
            Customer Log In
          </Link>

          <Link
            href="/signup?redirect=cart"
            onClick={closeAuthRequiredModal}
            className="py-2.5 px-2 bg-cream-muted border border-cream-border text-espresso font-bold rounded-xl hover:bg-cream-border transition text-center line-clamp-1"
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
