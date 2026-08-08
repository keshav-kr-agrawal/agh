import { create } from 'zustand';
import { UserSession } from '@/types';

interface AuthState {
  user: UserSession | null;
  isAdmin: boolean;
  loginCustomer: (phone: string, name: string, email?: string) => void;
  loginAdmin: (identifier: string, pin: string) => boolean;
  updateAdminPin: (oldPin: string, newPin: string) => { success: boolean; message: string };
  logout: () => void;
}

export const ADMIN_PHONE = '+91 9199272836';
export const ADMIN_ID = 'HKW1321';
const DEFAULT_ADMIN_PIN = '9199';

export const useAuthStore = create<AuthState>((set, get) => {
  let initialUser: UserSession | null = null;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('agh_user_session');
      if (saved) {
        initialUser = JSON.parse(saved);
      }
    } catch {}
  }

  const getActiveAdminPin = (): string => {
    if (typeof window !== 'undefined') {
      const storedPin = localStorage.getItem('agh_admin_pin');
      if (storedPin) return storedPin;
    }
    return DEFAULT_ADMIN_PIN;
  };

  return {
    user: initialUser,
    isAdmin: initialUser?.role === 'admin',

    loginCustomer: (phone, name, email) => {
      const user: UserSession = {
        phone,
        name,
        email,
        role: 'customer'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('agh_user_session', JSON.stringify(user));
      }
      set({ user, isAdmin: false });
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
          localStorage.setItem('agh_user_session', JSON.stringify(adminUser));
        }
        set({ user: adminUser, isAdmin: true });
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
        localStorage.removeItem('agh_user_session');
      }
      set({ user: null, isAdmin: false });
    }
  };
});
