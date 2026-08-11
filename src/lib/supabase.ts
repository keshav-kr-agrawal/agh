import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhdxtpbyawubsvzacffz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZHh0cGJ5YXd1YnN2emFjZmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNTYwNzcsImV4cCI6MjEwMTczMjA3N30._FYWIe1dOYIdsoYKxuJlLDa2uTsY9fX4YYVpxcvM4AE';

// Official Supabase Client Instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
 * Trigger Real Supabase Google OAuth Flow
 */
export async function signInWithGoogle() {
  if (typeof window === 'undefined') return;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/account`
    }
  });

  if (error) {
    let friendlyMessage = error.message;
    if (error.message.includes('provider is not enabled') || error.message.includes('validation_failed')) {
      friendlyMessage = 'Google Auth provider is not enabled in your Supabase Dashboard yet. Please go to Supabase Dashboard -> Authentication -> Providers -> Google and toggle Enabled to ON.';
    }
    console.error('Google Sign In Error:', friendlyMessage);
    return { success: false, error: friendlyMessage };
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
