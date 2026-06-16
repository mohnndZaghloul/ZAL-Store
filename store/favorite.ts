import { create } from "zustand";

type FavoriteStore_TP = {
  count: number;
  setFavCount: (count: number) => void;
  incrementFav: () => void;
  decrementFav: () => void;
};

export const useFavStore = create<FavoriteStore_TP>((set) => ({
  count: 0,
  setFavCount: (count) => set({ count }),
  incrementFav: () => set((state) => ({ count: state.count + 1 })),
  decrementFav: () =>
    set((state) => ({
      count: Math.max(0, state.count - 1),
    })),
}));
