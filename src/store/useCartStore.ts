import { create } from 'zustand';
import { Product, CartItem, FulfillmentType } from '@/types';
import { useAuthStore } from './useAuthStore';

interface CartState {
  cart: CartItem[];
  wishlist: Product[];
  fulfillmentType: FulfillmentType;
  isCartOpen: boolean;
  isAuthRequiredModalOpen: boolean;
  
  // Actions
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setFulfillmentType: (type: FulfillmentType) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openAuthRequiredModal: () => void;
  closeAuthRequiredModal: () => void;

  // Calculators
  getSubtotal: () => number;
  getShippingFee: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  wishlist: [],
  fulfillmentType: 'handpicked',
  isCartOpen: false,
  isAuthRequiredModalOpen: false,

  openAuthRequiredModal: () => set({ isAuthRequiredModalOpen: true }),
  closeAuthRequiredModal: () => set({ isAuthRequiredModalOpen: false }),

  addToCart: (product, quantity = 1) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isAuthRequiredModalOpen: true });
      return false;
    }

    set(state => {
      const existingIndex = state.cart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const newCart = [...state.cart];
        const newQty = Math.min(product.stock, newCart[existingIndex].quantity + quantity);
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newQty
        };
        return { cart: newCart, isCartOpen: true };
      } else {
        return {
          cart: [...state.cart, { product, quantity: Math.min(product.stock, quantity) }],
          isCartOpen: true
        };
      }
    });

    return true;
  },

  removeFromCart: productId => {
    set(state => ({
      cart: state.cart.filter(item => item.product.id !== productId)
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set(state => ({
      cart: state.cart.map(item => {
        if (item.product.id === productId) {
          const validQty = Math.min(item.product.stock, quantity);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    }));
  },

  setFulfillmentType: type => set({ fulfillmentType: type }),

  toggleWishlist: product => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ isAuthRequiredModalOpen: true });
      return;
    }

    set(state => {
      const exists = state.wishlist.some(item => item.id === product.id);
      if (exists) {
        return { wishlist: state.wishlist.filter(item => item.id !== product.id) };
      } else {
        return { wishlist: [...state.wishlist, product] };
      }
    });
  },

  isInWishlist: productId => {
    return get().wishlist.some(item => item.id === productId);
  },

  clearCart: () => set({ cart: [] }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set(state => ({ isCartOpen: !state.isCartOpen })),

  getSubtotal: () => {
    return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    if (get().fulfillmentType === 'handpicked') return 0;
    return subtotal >= 1499 ? 0 : 60;
  },

  getDiscount: () => 0,

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const shipping = get().getShippingFee();
    const discount = get().getDiscount();
    return Math.max(0, subtotal + shipping - discount);
  },

  getItemCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  }
}));
