'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Phone, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');

  const { registerCustomer, loginWithPassword, sendEmailOtp, verifyEmailOtp } = useAuthStore();
  const { openCart } = useCartStore();

  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  // Signup form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !phone || !password) {
      setError('Please fill in your name, mobile phone number, and password.');
      return;
    }

    registerCustomer({
      phone,
      name,
      email,
      password
    });

    setSuccess('🎉 Customer account created! Logging you in...');
    setTimeout(() => {
      if (redirect === 'cart') {
        router.push('/');
        setTimeout(() => openCart(), 300);
      } else {
        router.push('/account');
      }
    }, 500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginPhone) {
      setError('Please enter your mobile phone number.');
      return;
    }

    const res = loginWithPassword(loginPhone, loginPassword);
    if (res.success) {
      setSuccess('Log in successful!');
      setTimeout(() => {
        if (redirect === 'cart') {
          router.push('/');
          setTimeout(() => openCart(), 300);
        } else {
          router.push('/account');
        }
      }, 400);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-cream border border-cream-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block group">
          <img
            src="/agh.png"
            alt="Anita Gift House"
            className="h-16 w-auto object-contain mx-auto group-hover:scale-105 transition"
          />
        </Link>
        <h1 className="text-2xl font-serif font-extrabold text-espresso">
          Create Customer Account
        </h1>
        <p className="text-xs text-espresso/60">
          Register with your Mobile Phone & Password to track orders & shopping cart
        </p>
      </div>

      {/* Interactive Tab Selector */}
      <div className="flex bg-cream-muted border border-cream-border rounded-2xl p-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setActiveTab('signup');
            setError('');
            setSuccess('');
          }}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'signup'
              ? 'bg-terracotta text-cream shadow-sm'
              : 'text-espresso/70 hover:text-espresso'
          }`}
        >
          <UserPlus className="w-4 h-4" /> Create Account
        </button>
        <Link
          href="/login"
          className="flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 text-espresso/70 hover:text-espresso"
        >
          <LogIn className="w-4 h-4" /> Log In
        </Link>
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

      {activeTab === 'signup' ? (
        <form onSubmit={handleSignupSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-terracotta" /> Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
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
              value={phone}
              onChange={e => setPhone(e.target.value)}
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
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl text-sm focus:ring-2 focus:ring-terracotta"
            />
          </div>

          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-terracotta" /> Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={4}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Set your account password"
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
      ) : (
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-terracotta" /> Mobile Phone Number *
            </label>
            <input
              type="tel"
              required
              value={loginPhone}
              onChange={e => setLoginPhone(e.target.value)}
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
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Enter your account password"
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
        </form>
      )}

      <div className="pt-4 border-t border-cream-border text-center text-xs text-espresso/60 space-y-2">
        <Link href="/" className="block hover:text-terracotta transition font-semibold">
          ← Return to Storefront
        </Link>
        <div className="flex items-center justify-center gap-1 text-[11px] text-espresso/50">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
          <span>Anita Gift House Official Registration</span>
        </div>
      </div>
    </div>
  );
}

export default function CustomerSignUpPage() {
  return (
    <div className="min-h-screen bg-cream text-espresso flex items-center justify-center p-4 font-sans">
      <Suspense fallback={<div className="text-xs text-espresso/60">Loading Registration...</div>}>
        <SignupContent />
      </Suspense>
    </div>
  );
}
