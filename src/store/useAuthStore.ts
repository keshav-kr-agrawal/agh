import { create } from 'zustand';
import { UserSession } from '@/types';
import { supabase } from '@/lib/supabase';

interface RegisteredCustomer {
  phone: string;
  name: string;
  email?: string;
  password?: string;
  createdAt: string;
}

interface AuthState {
  user: UserSession | null;
  isAdmin: boolean;
  initializeAuth: () => void;
  loginCustomer: (phone: string, name: string, email?: string, password?: string) => void;
  registerCustomer: (customer: { phone: string; name: string; email?: string; password?: string }) => void;
  loginWithPassword: (phone: string, password?: string) => { success: boolean; message: string; user?: UserSession };
  getRegisteredCustomer: (phone: string) => RegisteredCustomer | null;
  loginAdmin: (identifier: string, pin: string) => boolean;
  updateAdminPin: (oldPin: string, newPin: string) => { success: boolean; message: string };
  logout: () => void;
}

export const ADMIN_PHONE = '+91 9199272836';
export const ADMIN_ID = 'HKW1321';
const DEFAULT_ADMIN_PIN = '9199';

export const useAuthStore = create<AuthState>((set, get) => {
  let initialUser: UserSession | null = null;
  let initialIsAdmin = false;

  if (typeof window !== 'undefined') {
    try {
      const savedAdmin = localStorage.getItem('agh_admin_session');
      const savedCust = localStorage.getItem('agh_customer_session');
      const legacySaved = localStorage.getItem('agh_user_session');

      if (savedAdmin) {
        initialIsAdmin = true;
      }
      if (savedCust) {
        initialUser = JSON.parse(savedCust);
      } else if (legacySaved) {
        const parsed = JSON.parse(legacySaved);
        if (parsed?.role === 'admin') {
          initialIsAdmin = true;
        } else {
          initialUser = parsed;
        }
      }
    } catch {}
  }

  const getRegisteredCustomers = (): RegisteredCustomer[] => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('agh_customer_accounts');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  };

  const saveRegisteredCustomer = (cust: RegisteredCustomer) => {
    if (typeof window === 'undefined') return;
    const existing = getRegisteredCustomers();
    const cleanPhone = cust.phone.replace(/\s+/g, '');
    const index = existing.findIndex(c => c.phone.replace(/\s+/g, '') === cleanPhone);
    if (index > -1) {
      existing[index] = { ...existing[index], ...cust };
    } else {
      existing.push(cust);
    }
    localStorage.setItem('agh_customer_accounts', JSON.stringify(existing));
  };

  const getActiveAdminPin = (): string => {
    if (typeof window !== 'undefined') {
      const storedPin = localStorage.getItem('agh_admin_pin');
      if (storedPin) return storedPin;
    }
    return DEFAULT_ADMIN_PIN;
  };

  return {
    user: initialUser,
    isAdmin: initialIsAdmin,

    initializeAuth: () => {
      if (typeof window !== 'undefined') {
        try {
          const savedAdmin = localStorage.getItem('agh_admin_session');
          const savedCust = localStorage.getItem('agh_customer_session');
          const legacySaved = localStorage.getItem('agh_user_session');

          const hasAdmin = Boolean(savedAdmin) || (legacySaved ? JSON.parse(legacySaved)?.role === 'admin' : false);
          let custUser: UserSession | null = null;
          if (savedCust) {
            custUser = JSON.parse(savedCust);
          } else if (legacySaved && JSON.parse(legacySaved)?.role !== 'admin') {
            custUser = JSON.parse(legacySaved);
          }

          set({ user: custUser, isAdmin: hasAdmin });

          // Supabase Auth Sync
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              const supaUser = session.user;
              const supaCustUser: UserSession = {
                phone: supaUser.phone || supaUser.user_metadata?.phone_number || supaUser.email || '+91 9999999999',
                name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'Customer',
                email: supaUser.email || '',
                role: 'customer'
              };
              set({ user: supaCustUser });
              localStorage.setItem('agh_customer_session', JSON.stringify(supaCustUser));
            }
          });

          supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              const supaUser = session.user;
              const supaCustUser: UserSession = {
                phone: supaUser.phone || supaUser.user_metadata?.phone_number || supaUser.email || '+91 9999999999',
                name: supaUser.user_metadata?.full_name || supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'Customer',
                email: supaUser.email || '',
                role: 'customer'
              };
              set({ user: supaCustUser });
              localStorage.setItem('agh_customer_session', JSON.stringify(supaCustUser));
            }
          });
        } catch {}
      }
    },

    getRegisteredCustomer: (phone: string) => {
      const clean = phone.replace(/\s+/g, '');
      const customers = getRegisteredCustomers();
      return customers.find(c => c.phone.replace(/\s+/g, '') === clean) || null;
    },

    registerCustomer: ({ phone, name, email, password }) => {
      const newCust: RegisteredCustomer = {
        phone,
        name,
        email: email || '',
        password: password || '',
        createdAt: new Date().toISOString()
      };
      saveRegisteredCustomer(newCust);

      const userSession: UserSession = {
        phone,
        name,
        email: email || '',
        role: 'customer'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('agh_customer_session', JSON.stringify(userSession));
        localStorage.setItem('agh_user_session', JSON.stringify(userSession));
      }
      set({ user: userSession });
    },

    loginCustomer: (phone, name, email, password) => {
      saveRegisteredCustomer({
        phone,
        name,
        email: email || '',
        password: password || '',
        createdAt: new Date().toISOString()
      });

      const userSession: UserSession = {
        phone,
        name,
        email: email || '',
        role: 'customer'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('agh_customer_session', JSON.stringify(userSession));
        localStorage.setItem('agh_user_session', JSON.stringify(userSession));
      }
      set({ user: userSession });
    },

    loginWithPassword: (phone, password) => {
      const cleanPhone = phone.replace(/\s+/g, '');
      const registered = getRegisteredCustomers().find(c => c.phone.replace(/\s+/g, '') === cleanPhone);

      let userName = `Customer (${phone.slice(-4)})`;
      let userEmail = '';

      if (registered) {
        if (registered.password && password && registered.password !== password) {
          return { success: false, message: 'Incorrect password. Please try again.' };
        }
        userName = registered.name;
        userEmail = registered.email || '';
      } else {
        // Register default profile on first login
        saveRegisteredCustomer({
          phone,
          name: userName,
          password: password || '',
          createdAt: new Date().toISOString()
        });
      }

      const userSession: UserSession = {
        phone,
        name: userName,
        email: userEmail,
        role: 'customer'
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('agh_customer_session', JSON.stringify(userSession));
        localStorage.setItem('agh_user_session', JSON.stringify(userSession));
      }
      set({ user: userSession });

      return { success: true, message: 'Logged in successfully!', user: userSession };
    },

    loginAdmin: (identifier, pin) => {
      const cleaned = identifier.trim().toUpperCase();
      const validIdentifier = cleaned === 'HKW1321';
      
      const activePin = getActiveAdminPin();

      if (validIdentifier && pin.trim() === activePin) {
        const adminUser: UserSession = {
          phone: ADMIN_PHONE,
          name: 'Anita Gift House Admin',
          role: 'admin'
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('agh_admin_session', JSON.stringify(adminUser));
          localStorage.setItem('agh_user_session', JSON.stringify(adminUser));
        }
        set({ isAdmin: true });
        return true;
      }

      return false;
    },

    updateAdminPin: (oldPin, newPin) => {
      const activePin = getActiveAdminPin();
      if (oldPin.trim() !== activePin) {
        return { success: false, message: 'Current admin password is incorrect.' };
      }

      if (!newPin || newPin.trim().length < 4) {
        return { success: false, message: 'New password must be at least 4 characters.' };
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('agh_admin_pin', newPin.trim());
      }
      return { success: true, message: 'Admin password updated successfully!' };
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('agh_customer_session');
        localStorage.removeItem('agh_user_session');
      }
      try {
        supabase.auth.signOut();
      } catch (e) {}
      set({ user: null });
    }
  };
});
