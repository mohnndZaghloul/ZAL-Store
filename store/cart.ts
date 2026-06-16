import { create } from "zustand";

type CartStore_TP = {
  count: number;
  setCartCount: (count: number) => void;
  incrementCart: () => void;
  decrementCart: () => void;
};

export const useCartStore = create<CartStore_TP>((set) => ({
  count: 0,
  setCartCount: (count) => set({ count }),
  incrementCart: () => set((state) => ({ count: state.count + 1 })),
  decrementCart: () =>
    set((state) => ({
      count: Math.max(0, state.count - 1),
    })),
}));
