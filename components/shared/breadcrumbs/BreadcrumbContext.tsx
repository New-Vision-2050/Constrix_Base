"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface BreadcrumbContextType {
  pageTitle: string | null;
  setPageTitle: (title: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitle] = useState<string | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  }
  return context;
}

export function useBreadcrumbOptional() {
  return useContext(BreadcrumbContext);
}
