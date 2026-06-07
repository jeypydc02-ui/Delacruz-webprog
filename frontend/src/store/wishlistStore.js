import { create } from 'zustand';
import { api } from '../lib/api';

export const useWishlistStore = create((set, get) => ({
  items: [],
  loaded: false,

  // Load wishlist from backend (call on login / app mount)
  load: async () => {
    try {
      const r = await api.get('/auth/wishlist');
      set({ items: r.data.wishlist || [], loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  toggle: async (product) => {
    const productId = product._id || product.id;
    // Optimistic update
    const { items } = get();
    const exists = items.find((i) => (i._id || i.id) === productId);
    if (exists) {
      set({ items: items.filter((i) => (i._id || i.id) !== productId) });
    } else {
      set({ items: [...items, product] });
    }
    // Sync to backend
    try {
      const r = await api.post('/auth/wishlist/toggle', { productId });
      set({ items: r.data.wishlist || [] });
    } catch {
      // Revert on error
      set({ items });
    }
  },

  isWishlisted: (productId) => {
    return get().items.some((i) => (i._id || i.id) === productId);
  },

  clear: () => set({ items: [], loaded: false }),
}));
