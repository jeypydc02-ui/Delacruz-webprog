import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

const getToken = () => {
  try {
    const raw = localStorage.getItem('jeyp-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch { return null; }
};

const isLoggedIn = () => !!getToken();

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      synced: false,

      // Returns true if added, false if user needs to log in
      addItem: (product, size, color) => {
        // Block guests — caller should redirect to /login
        if (!isLoggedIn()) return false;

        const { items } = get();
        const key = `${product._id || product.id}-${size}-${color}`;
        const existing = items.find((i) => i.key === key);
        if (existing) {
          set({ items: items.map((i) => i.key === key ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...items, { key, product, size, color, quantity: 1, price: product.salePrice || product.price }] });
        }
        get()._syncAdd(product._id || product.id, 1, color, size);
        return true;
      },

      removeItem: (key) => {
        const item = get().items.find((i) => i.key === key);
        set({ items: get().items.filter((i) => i.key !== key) });
        if (item) get()._syncRemove(item);
      },

      updateQuantity: (key, quantity) => {
        if (quantity < 1) { get().removeItem(key); return; }
        const item = get().items.find((i) => i.key === key);
        set({ items: get().items.map((i) => i.key === key ? { ...i, quantity } : i) });
        if (item) get()._syncUpdate(item, quantity);
      },

      clearCart: () => set({ items: [], synced: false }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),

      _syncAdd: async (productId, quantity, color, size) => {
        if (!isLoggedIn()) return;
        try {
          await api.post('/cart', { productId, quantity, color, size });
        } catch (_) {}
      },

      _syncRemove: async (item) => {
        if (!isLoggedIn() || !item._backendId) return;
        try {
          await api.delete(`/cart/${item._backendId}`);
        } catch (_) {}
      },

      _syncUpdate: async (item, quantity) => {
        if (!isLoggedIn() || !item._backendId) return;
        try {
          await api.put(`/cart/${item._backendId}`, { quantity });
        } catch (_) {}
      },

      fetchCart: async () => {
        try {
          const res = await api.get('/cart');
          const backendItems = res.data?.cart?.items || [];
          const mapped = backendItems.map((item) => ({
            key: `${item.product?._id}-${item.size}-${item.color}`,
            _backendId: item._id,
            product: item.product,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.product?.salePrice || item.product?.price || 0,
          }));
          set({ items: mapped, synced: true });
        } catch (_) {}
      },
    }),
    {
      name: 'jeyp-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
