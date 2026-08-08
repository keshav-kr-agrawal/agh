'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, Key, ArrowRight, Store } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuthStore();

  const [identifier, setIdentifier] = useState('HKW1321');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(identifier, pin);
    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid Admin ID or Password. Authorized Admin ID: HKW1321');
    }
  };

  return (
    <div className="min-h-screen bg-cream text-espresso flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-cream border border-cream-border rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <img
              src="/agh.png"
              alt="Anita Gift House"
              className="h-16 w-auto object-contain mx-auto group-hover:scale-105 transition"
            />
          </Link>
          <h1 className="text-2xl font-serif font-extrabold text-espresso">
            Admin Portal Authentication
          </h1>
          <p className="text-xs text-espresso/60">
            Guarded control center for Anita Gift House merchants
          </p>
        </div>

        {error && (
          <div className="p-3 bg-crimson/10 border border-crimson/20 rounded-2xl text-crimson text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-terracotta" /> Admin ID *
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="HKW1321"
              className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-terracotta"
            />
          </div>

          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-gold-dark" /> Password / PIN *
            </label>
            <input
              type="password"
              required
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="Enter Password (Default: 9199)"
              className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-terracotta"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-terracotta to-crimson text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            Authenticate & Enter Admin Portal <ArrowRight className="w-4 h-4 text-gold" />
          </button>
        </form>

        <div className="pt-4 border-t border-cream-border text-center">
          <Link href="/" className="text-xs text-espresso/60 hover:text-terracotta font-medium flex items-center justify-center gap-1">
            <Store className="w-3.5 h-3.5" /> Return to Client Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
