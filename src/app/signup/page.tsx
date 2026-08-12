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

  const { registerCustomer, loginWithPassword, loginWithGoogle } = useAuthStore();
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
        <button
          type="button"
          onClick={() => {
            setActiveTab('login');
            setError('');
            setSuccess('');
          }}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'login'
              ? 'bg-terracotta text-cream shadow-sm'
              : 'text-espresso/70 hover:text-espresso'
          }`}
        >
          <LogIn className="w-4 h-4" /> Customer Log In
        </button>
      </div>

      {error && (
        <div className="p-3 bg-crimson/10 border border-crimson/20 rounded-2xl text-crimson text-xs font-semibold text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold text-center">
          {success}
        </div>
      )}

      {/* Google OAuth Quick Login Button */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={async () => {
            setError('');
            const res = await loginWithGoogle();
            if (res && !res.success && res.message) {
              setError(res.message);
            }
          }}
          className="w-full py-3 bg-white border border-cream-border text-espresso font-bold text-xs rounded-2xl shadow-xs hover:bg-cream-muted transition flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-cream-border w-full"></div>
          <span className="bg-cream px-3 text-[10px] uppercase font-bold text-espresso/50 tracking-wider absolute">OR</span>
        </div>
      </div>

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
