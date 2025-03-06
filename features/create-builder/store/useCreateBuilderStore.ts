"use client";
import { create } from "zustand";
import { CreateBuilderModuleT } from "../types/CreateBuilderModule";
import { MODULES_LIST } from "../constants/modules-list";

type CreateBuilderState = {
  btnLabel: string;
  modules: CreateBuilderModuleT[];
  selectedModule: CreateBuilderModuleT | undefined;
  moduleId: string | undefined;
  originalModuleId: string | undefined;
  setModuleId: (id: string) => void;
  setBtnLabel: (label: string) => void;
};

// Zustand store
export const useCreateBuilderStore = create<CreateBuilderState>((set, get) => ({
  // Initial state
  btnLabel: "",
  modules: MODULES_LIST,
  selectedModule: undefined,
  moduleId: undefined,
  originalModuleId: undefined,

  // set btnLabel
  setBtnLabel: (label: string) => {
    set({ btnLabel: label });
  },

  // Set module ID and update selectedModule
  setModuleId: (id: string) => {
    const selected = get().modules.find((ele) => ele.id === id);
    set({ moduleId: id, selectedModule: selected });
  },
}));
