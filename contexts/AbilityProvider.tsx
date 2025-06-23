"use client";
import { AbilityContext } from "./AbilityContext";
import { defineAbilityFor } from "@/lib/ability";
import { useMemo } from "react";

export const AbilityProvider = ({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) => {
  const ability = useMemo(() => defineAbilityFor(role), [role]);
  return (
    <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  );
};
