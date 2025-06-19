import { create } from "zustand";

interface BranchState {
  branchId: string | null;
  setBranchId: (id: string | null) => void;
  syncWithLocalStorage: () => void;
}

export const useBranchStore = create<BranchState>((set) => ({
  branchId: (() => {
    const storedBranch = localStorage.getItem("current-branch-obj");
    const branchObj = storedBranch ? JSON.parse(storedBranch) : null;
    return branchObj?.id || null;
  })(),
  setBranchId: (id) => {
    set({ branchId: id });
    if (id) {
      localStorage.setItem("current-branch-obj", JSON.stringify({ id }));
      console.log("Branch ID set to:", id);
    } else {
      localStorage.removeItem("current-branch-obj");
      console.log("Branch ID cleared from localStorage");
    }
  },
  syncWithLocalStorage: () => {
    const storedBranch = localStorage.getItem("current-branch-obj");
    const branchObj = storedBranch ? JSON.parse(storedBranch) : null;
    set({ branchId: branchObj?.id || null });
    console.log("Branch ID synced with localStorage:", branchObj?.id || null);
  },
}));
