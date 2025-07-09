import { create } from "zustand";
import { persist } from "zustand/middleware";

// Zustand store with hydration
interface PermissionsState {
  permissions: string[];
  setPermissions: (perms: string[]) => void;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  clearPermissions: () => void;
}

export const usePermissionsStore = create<PermissionsState>()(
  persist(
    (set) => ({
      permissions: [],
      setPermissions: (perms) => set({ permissions: perms }),
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      clearPermissions: () => set({ permissions: []}),
    }),
    {
      name: "permissions-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);