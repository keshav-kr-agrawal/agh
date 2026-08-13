import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhdxtpbyawubsvzacffz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZHh0cGJ5YXd1YnN2emFjZmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNTYwNzcsImV4cCI6MjEwMTczMjA3N30._FYWIe1dOYIdsoYKxuJlLDa2uTsY9fX4YYVpxcvM4AE';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

// Official Supabase Client Instance (Client-side / Anon)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin Client Instance for Server API Routes (Service Role Key bypasses RLS)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : supabase;

export interface SupabaseRealtimeEvent<T = any> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  table: 'products' | 'orders' | 'coupons' | 'banner';
  newRecord?: T;
  oldRecord?: T;
}

type RealtimeCallback = (event: SupabaseRealtimeEvent) => void;

class SupabaseRealtimeManager {
  private listeners: Set<RealtimeCallback> = new Set();

  public subscribe(callback: RealtimeCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public notify(event: SupabaseRealtimeEvent) {
    this.listeners.forEach(cb => {
      try {
        cb(event);
      } catch (err) {
        console.error('Supabase Realtime Listener Error:', err);
      }
    });
  }
}

export const supabaseRealtime = new SupabaseRealtimeManager();

/**
 * Trigger Real Supabase Email OTP Send Flow
 */
export async function sendEmailOtp(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      shouldCreateUser: true
    }
  });

  if (error) {
    let msg = error.message;
    if (msg.toLowerCase().includes('rate limit')) {
      msg = 'Too many OTP requests. Please wait a minute before requesting another OTP.';
    } else if (msg.toLowerCase().includes('invalid')) {
      msg = 'Invalid email format. Please check and try again.';
    }
    return { success: false, error: msg };
  }

  return { success: true, data };
}

/**
 * Trigger Real Supabase Email OTP Verification Flow
 */
export async function verifyEmailOtp(email: string, token: string) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanToken = token.trim();

  const { data, error } = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: cleanToken,
    type: 'email'
  });

  if (error) {
    let msg = error.message;
    if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('invalid')) {
      msg = 'Invalid or expired OTP code. Please check your email or click Resend OTP.';
    }
    return { success: false, error: msg };
  }

  return { success: true, data };
}

/**
 * Trigger Real Supabase Email & Password Signup Flow
 */
export async function signUpWithEmail(email: string, password: string, name: string, phone: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        phone_number: phone
      }
    }
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Trigger Real Supabase Email & Password Login Flow
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Trigger Real Supabase Phone OTP Login Flow
 */
export async function signInWithOtp(phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
