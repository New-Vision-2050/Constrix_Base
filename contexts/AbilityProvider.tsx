"use client";
import { AbilityContext } from "./AbilityContext";
import { defineAbilityFor } from "@/lib/ability";
import { useMemo } from "react";

export const AbilityProvider = ({
  permissions,
  children,
}: {
  permissions: string[];
  children: React.ReactNode;
}) => {
  const ability = useMemo(() => defineAbilityFor(permissions), [permissions]);
  return (
    <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  );
};