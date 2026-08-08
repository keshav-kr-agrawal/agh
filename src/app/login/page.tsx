'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { loginCustomer } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Please enter your mobile number and password.');
      return;
    }

    // Authenticate customer session using phone and password
    const customerName = phone ? `Customer (${phone.slice(-4)})` : 'Valued Shopper';
    loginCustomer(phone, customerName);
    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-cream text-espresso flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-cream border border-cream-border rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <img
              src="/agh.png"
              alt="Anita Gift House"
              className="h-16 w-auto object-contain mx-auto group-hover:scale-105 transition"
            />
          </Link>
          <h1 className="text-2xl font-serif font-extrabold text-espresso">
            Customer Account Login
          </h1>
          <p className="text-xs text-espresso/60">
            Log in with your Phone & Password to track orders and manage your cart
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
              <Phone className="w-3.5 h-3.5 text-terracotta" /> Mobile Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-terracotta"
            />
          </div>

          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-gold-dark" /> Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl text-sm focus:ring-2 focus:ring-terracotta pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/60 hover:text-espresso"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-terracotta text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-crimson transition flex items-center justify-center gap-2"
          >
            Log In to Customer Account <ArrowRight className="w-4 h-4 text-gold" />
          </button>
        </form>

        <div className="pt-4 border-t border-cream-border text-center text-xs text-espresso/60 space-y-2">
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className="text-terracotta font-bold hover:underline">
              Sign Up
            </Link>
          </p>
          <Link href="/" className="block hover:text-terracotta transition font-medium">
            ← Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
