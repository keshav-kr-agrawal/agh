'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Lock, LogIn, UserPlus, X, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export const AuthRequiredModal: React.FC = () => {
  const { isAuthRequiredModalOpen, closeAuthRequiredModal } = useCartStore();

  if (!isAuthRequiredModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="relative w-full max-w-md bg-cream border border-cream-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-scaleUp">
        <button
          onClick={closeAuthRequiredModal}
          className="absolute top-4 right-4 p-2 rounded-full text-espresso/60 hover:text-espresso hover:bg-cream-muted transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-terracotta to-crimson text-gold flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-serif font-bold text-espresso">
            Customer Login Required
          </h3>
          <p className="text-xs text-espresso/70 leading-relaxed max-w-xs mx-auto">
            Please log in or create a customer account to add items to your cart & place orders.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/login"
            onClick={closeAuthRequiredModal}
            className="w-full py-3 bg-terracotta text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-crimson transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-gold" />
            Log In to Customer Account
          </Link>

          <Link
            href="/signup"
            onClick={closeAuthRequiredModal}
            className="w-full py-3 bg-cream-muted border border-cream-border text-espresso font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-cream-border transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-terracotta" />
            Create New Account
          </Link>
        </div>

        <div className="pt-2 border-t border-cream-border/60 flex items-center justify-center gap-2 text-[11px] text-espresso/60">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
          <span>Safe & Secure Customer Access</span>
        </div>
      </div>
    </div>
  );
};
