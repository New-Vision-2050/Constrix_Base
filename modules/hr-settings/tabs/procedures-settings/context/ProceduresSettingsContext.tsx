"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_HR_PROCEDURES_CONFIG } from "../constants/defaultConfig";
import type { ProceduresSettingsConfig } from "../types";

const ProceduresSettingsContext = createContext<ProceduresSettingsConfig>(
  DEFAULT_HR_PROCEDURES_CONFIG,
);

interface ProceduresSettingsProviderProps {
  config: ProceduresSettingsConfig;
  children: ReactNode;
}

export function ProceduresSettingsProvider({
  config,
  children,
}: ProceduresSettingsProviderProps) {
  const value = useMemo(() => config, [config]);

  return (
    <ProceduresSettingsContext.Provider value={value}>
      {children}
    </ProceduresSettingsContext.Provider>
  );
}

export function useProceduresSettings() {
  return useContext(ProceduresSettingsContext);
}
