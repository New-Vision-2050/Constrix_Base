import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarState = {
  menu: any[];
  setMenu: (menu: any[]) => void;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  clearMenu: () => void;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      menu: [],
      setMenu: (menu) => set({ menu }),
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      clearMenu: () => set({ menu: [] }),
    }),
    {
      name: "sidebar-menu",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
