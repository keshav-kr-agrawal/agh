import { create } from 'zustand';
import { Category, Product } from '@/types';

interface StorefrontState {
  selectedCategory: Category | 'All' | 'Special Offers';
  setSelectedCategory: (category: Category | 'All' | 'Special Offers') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  resetFilters: () => void;
}

export const useStorefrontStore = create<StorefrontState>((set) => ({
  // Default landing category opens on ALL items per requirement
  selectedCategory: 'All',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  priceRange: [0, 5000],
  setPriceRange: (range) => set({ priceRange: range, minPrice: range[0], maxPrice: range[1] }),
  minPrice: 0,
  maxPrice: 5000,
  setMinPrice: (price) => set((state) => ({ minPrice: price, priceRange: [price, state.maxPrice] })),
  setMaxPrice: (price) => set((state) => ({ maxPrice: price, priceRange: [state.minPrice, price] })),
  inStockOnly: false,
  setInStockOnly: (val) => set({ inStockOnly: val }),
  resetFilters: () => set({
    selectedCategory: 'All',
    searchQuery: '',
    selectedProduct: null,
    priceRange: [0, 5000],
    minPrice: 0,
    maxPrice: 5000,
    inStockOnly: false
  })
}));
