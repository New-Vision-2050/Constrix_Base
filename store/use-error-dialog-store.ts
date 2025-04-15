import { create } from "zustand";

interface ErrorDialogState {
  isOpen: boolean;
  desc: string;
  openDialog: (desc?: string) => void; // Allow optional parameter
  closeDialog: () => void;
}

export const useErrorDialogStore = create<ErrorDialogState>((set) => ({
  isOpen: false,
  desc: "",
  openDialog: (desc = "حدث خطأ غير متوقع") => set({ isOpen: true, desc }),
  closeDialog: () => set({ isOpen: false }),
}));
