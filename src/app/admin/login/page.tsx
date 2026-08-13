'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, Key, ArrowRight, Store, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, pin })
      });
      const json = await res.json();
      if (json.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('agh_admin_token', json.token);
          localStorage.setItem('agh_admin_session', JSON.stringify(json.user));
          localStorage.setItem('agh_user_session', JSON.stringify(json.user));
        }
        useAuthStore.setState({ isAdmin: true });
        router.push('/admin');
      } else {
        const fallbackSuccess = loginAdmin(identifier, pin);
        if (fallbackSuccess) {
          router.push('/admin');
        } else {
          setError(json.message || 'Invalid Admin Credentials or PIN.');
        }
      }
    } catch {
      const fallbackSuccess = loginAdmin(identifier, pin);
      if (fallbackSuccess) {
        router.push('/admin');
      } else {
        setError('Connection error authenticating admin credentials.');
      }
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
              placeholder="Enter Admin ID"
              className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-terracotta"
            />
          </div>

          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-gold-dark" /> Password / PIN *
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter Admin Password"
                className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-terracotta pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/60 hover:text-espresso"
                title={showPin ? 'Hide password' : 'Show password'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
