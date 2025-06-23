"use client";
import { createContext, useContext } from "react";
import { AppAbility } from "@/lib/ability";

export const AbilityContext = createContext<AppAbility | null>(null);

export const useAbility = () => {
  const context = useContext(AbilityContext);
  if (!context) throw new Error("useAbility must be inside AbilityProvider");
  return context;
};
