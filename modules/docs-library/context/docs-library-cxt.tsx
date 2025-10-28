"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";
import useDocsWidgets from "../hooks/useDocsWidgets";
import { DocsWidgetsT } from "../api/get-docs-widgets";

// Define context type
interface CxtType {
  docsWidgets: DocsWidgetsT | undefined;
  handleRefetchDocsWidgets: () => void;
  handleChangeParentId: (parentId: string) => void;
}

// Create the context
const Cxt = createContext<CxtType | undefined>(undefined);

// Provider component
interface PropsT {
  children: ReactNode;
}

export const DocsLibraryCxtProvider: React.FC<PropsT> = ({ children }) => {
  // ** declare and define helper variables
  const [parentId, setParentId] = useState("");
  const { data: docsWidgets, refetch: refetchDocsWidgets } =
    useDocsWidgets(parentId);

  const handleRefetchDocsWidgets = () => {
    refetchDocsWidgets();
  };
  const handleChangeParentId = (parentId: string) => {
    setParentId(parentId);
  };

  // ** return provider
  return (
    <Cxt.Provider
      value={{ docsWidgets, handleRefetchDocsWidgets, handleChangeParentId }}
    >
      {children}
    </Cxt.Provider>
  );
};

// Custom hook to use the context
export const useDocsLibraryCxt = () => {
  const context = useContext(Cxt);
  if (context === undefined) {
    throw new Error(
      "useDocsLibraryCxt must be used within a DocsLibraryCxtProvider"
    );
  }
  return context;
};
