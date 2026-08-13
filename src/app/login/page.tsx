'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Phone, Lock, User, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, LogIn, UserPlus, KeyRound, RefreshCw, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');

  const { sendEmailOtp, verifyEmailOtp, loginWithPassword, registerCustomer } = useAuthStore();
  const { openCart } = useCartStore();

  const [authMode, setAuthMode] = useState<'otp' | 'password' | 'signup'>('otp');

  // OTP State
  const [otpStep, setOtpStep] = useState<'email' | 'verify'>('email');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

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

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (!otpEmail || !otpEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSendingOtp(true);
    try {
      const res = await sendEmailOtp(otpEmail);
      if (res.success) {
        setOtpStep('verify');
        setResendCooldown(60);
        setSuccess(`🎉 6-digit OTP code sent to ${otpEmail}. Please check your inbox or spam folder.`);
      } else {
        setError(res.message || 'Failed to send OTP email.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while sending OTP.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otpToken || otpToken.trim().length < 6) {
      setError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await verifyEmailOtp(otpEmail, otpToken);
      if (res.success) {
        setSuccess('🎉 OTP verified successfully! Logging you in...');
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
        setError(res.message || 'Invalid or expired OTP code.');
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

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
      setSuccess('Log in successful!');
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

    if (!signupName || !signupPhone || !signupPassword) {
      setError('Please fill in your name, mobile phone number, and password.');
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
            setAuthMode('otp');
            setError('');
            setSuccess('');
          }}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            authMode === 'otp'
              ? 'bg-terracotta text-cream shadow-sm'
              : 'text-espresso/70 hover:text-espresso'
          }`}
        >
          <Mail className="w-3.5 h-3.5" /> Email OTP
        </button>
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
          <LogIn className="w-3.5 h-3.5" /> Password
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
          <UserPlus className="w-3.5 h-3.5" /> Register
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

      {/* MODE 1: Email OTP Login */}
      {authMode === 'otp' && (
        <div className="space-y-4 text-xs">
          {otpStep === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-terracotta" /> Enter Email Address for Quick OTP *
                </label>
                <input
                  type="email"
                  required
                  value={otpEmail}
                  onChange={e => setOtpEmail(e.target.value)}
                  placeholder="your.name@example.com"
                  className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl text-sm text-espresso focus:ring-2 focus:ring-terracotta"
                />
              </div>

              <button
                type="submit"
                disabled={sendingOtp}
                className="w-full py-3 bg-terracotta text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-crimson transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sendingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-gold" /> Sending OTP Email...
                  </>
                ) : (
                  <>
                    Send 6-Digit OTP <ArrowRight className="w-4 h-4 text-gold" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-cream-muted border border-cream-border rounded-2xl flex items-center justify-between text-xs">
                <span className="font-semibold text-espresso truncate">Sent to: {otpEmail}</span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep('email');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-terracotta font-bold underline ml-2 shrink-0 hover:text-crimson"
                >
                  Edit Email
                </button>
              </div>

              <div>
                <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-gold-dark" /> Enter 6-Digit Verification OTP *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpToken}
                  onChange={e => setOtpToken(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl text-lg font-mono tracking-widest text-center text-espresso focus:ring-2 focus:ring-terracotta"
                />
              </div>

              <button
                type="submit"
                disabled={verifyingOtp}
                className="w-full py-3 bg-terracotta text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-crimson transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {verifyingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-gold" /> Verifying Code...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-gold" /> Verify OTP & Log In
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || sendingOtp}
                  onClick={() => handleSendOtp()}
                  className="text-xs text-espresso/70 hover:text-terracotta font-semibold disabled:opacity-50"
                >
                  {resendCooldown > 0
                    ? `Resend OTP in ${resendCooldown}s`
                    : 'Didn\'t receive code? Click to Resend OTP'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* MODE 2: Password Login */}
      {authMode === 'password' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-espresso mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-terracotta" /> Email Address or Mobile Phone *
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={loginPhone}
              onChange={e => setLoginPhone(e.target.value)}
              placeholder="customer@example.com or +91 98765 43210"
              className="w-full px-3.5 py-2.5 bg-cream-muted border border-cream-border rounded-xl text-sm focus:ring-2 focus:ring-terracotta"
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
                autoComplete="current-password"
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

      {/* MODE 3: Create Account */}
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
              <Lock className="w-3.5 h-3.5 text-terracotta" /> Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={4}
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
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
      )}

      <div className="pt-4 border-t border-cream-border text-center text-xs text-espresso/60 space-y-2">
        <Link href="/" className="block hover:text-terracotta transition font-semibold">
          ← Return to Storefront
        </Link>
        <div className="flex items-center justify-center gap-1 text-[11px] text-espresso/50">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
          <span>Anita Gift House Official Supabase Authentication</span>
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
