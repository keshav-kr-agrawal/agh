'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Phone, Lock, User, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');

  const { loginWithPassword, registerCustomer } = useAuthStore();
  const { openCart } = useCartStore();

  const [authMode, setAuthMode] = useState<'password' | 'signup'>('password');

  // Password Login State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginPhone) {
      setError('Please enter your mobile phone number or email.');
      return;
    }

    const res = loginWithPassword(loginPhone, loginPassword);
    if (res.success) {
      setSuccess('🎉 Logged in successfully!');
      const pending = useCartStore.getState().pendingProduct;
      if (pending) {
        useCartStore.getState().addToCart(pending, 1);
        useCartStore.getState().setPendingProduct(null);
      }
      setTimeout(() => {
        if (redirect === 'cart' || pending) {
          router.push('/');
          setTimeout(() => openCart(), 300);
        } else {
          router.push('/account');
        }
      }, 300);
    } else {
      setError(res.message);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signupName || !signupPhone) {
      setError('Please fill in your name and mobile phone number.');
      return;
    }

    registerCustomer({
      phone: signupPhone,
      name: signupName,
      email: signupEmail,
      password: signupPassword
    });

    const pending = useCartStore.getState().pendingProduct;
    if (pending) {
      useCartStore.getState().addToCart(pending, 1);
      useCartStore.getState().setPendingProduct(null);
    }

    setSuccess('🎉 Account created successfully! Logging you in...');
    setTimeout(() => {
      if (redirect === 'cart' || pending) {
        router.push('/');
        setTimeout(() => openCart(), 300);
      } else {
        router.push('/account');
      }
    }, 400);
  };

  return (
    <div className="w-full max-w-md bg-cream border border-cream-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
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
          Anita Gift House Customer Portal
        </h1>
        <p className="text-xs text-espresso/60">
          Access your cart, order tracking, and handpicked store pickup details
        </p>
      </div>

      {/* Interactive Authentication Mode Selector */}
      <div className="flex bg-cream-muted border border-cream-border rounded-2xl p-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setAuthMode('password');
            setError('');
            setSuccess('');
          }}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            authMode === 'password'
              ? 'bg-terracotta text-cream shadow-sm'
              : 'text-espresso/70 hover:text-espresso'
          }`}
        >
          <LogIn className="w-4 h-4" /> Customer Log In
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode('signup');
            setError('');
            setSuccess('');
          }}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            authMode === 'signup'
              ? 'bg-terracotta text-cream shadow-sm'
              : 'text-espresso/70 hover:text-espresso'
          }`}
        >
          <UserPlus className="w-4 h-4" /> Register New Account
        </button>
      </div>

      {error && (
        <div className="p-3 bg-crimson/10 border border-crimson/20 rounded-2xl text-crimson text-xs font-semibold text-center animate-fadeIn">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold text-center animate-fadeIn">
          {success}
        </div>
      )}

      {/* MODE 1: Normal Password / Phone Login */}
      {authMode === 'password' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-terracotta" /> Mobile Phone Number or Email *
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={loginPhone}
              onChange={e => setLoginPhone(e.target.value)}
              placeholder="+91 98765 43210 or customer@example.com"
              className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl text-sm focus:ring-2 focus:ring-terracotta"
            />
          </div>

          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gold-dark" /> Password
              </span>
              <span className="text-[10px] text-espresso/50 font-normal">Optional if registered without password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Enter password (optional)"
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
            Log In to Account <ArrowRight className="w-4 h-4 text-gold" />
          </button>

          <p className="text-[11px] text-espresso/60 text-center">
            New customer? Click <strong>Register New Account</strong> above to sign up in seconds.
          </p>
        </form>
      )}

      {/* MODE 2: Register New Account */}
      {authMode === 'signup' && (
        <form onSubmit={handleSignupSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-terracotta" /> Full Name *
            </label>
            <input
              type="text"
              required
              value={signupName}
              onChange={e => setSignupName(e.target.value)}
              placeholder="Priya Sharma"
              className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl text-sm focus:ring-2 focus:ring-terracotta"
            />
          </div>

          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gold-dark" /> Mobile Phone Number *
            </label>
            <input
              type="tel"
              required
              value={signupPhone}
              onChange={e => setSignupPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-terracotta"
            />
          </div>

          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-terracotta" /> Email Address (Optional)
            </label>
            <input
              type="email"
              value={signupEmail}
              onChange={e => setSignupEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl text-sm focus:ring-2 focus:ring-terracotta"
            />
          </div>

          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-terracotta" /> Password (Optional)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                placeholder="Set account password"
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
            Create Customer Account <ArrowRight className="w-4 h-4 text-gold" />
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-cream-border text-center text-xs text-espresso/60 space-y-2">
        <Link href="/" className="block hover:text-terracotta transition font-semibold">
          ← Return to Storefront
        </Link>
        <div className="flex items-center justify-center gap-1 text-[11px] text-espresso/50">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
          <span>Anita Gift House Customer Login</span>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="min-h-screen bg-cream text-espresso flex items-center justify-center p-4 font-sans">
      <Suspense fallback={<div className="text-xs text-espresso/60">Loading Portal...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
