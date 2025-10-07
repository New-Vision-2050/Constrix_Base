"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";
import useDocsData from "../hooks/useDocsData";
import { GetDocsResT } from "../apis/get-docs";

// Define context type
interface CxtType {
  // show item details
  showItemDetials: boolean;
  toggleShowItemDetials: () => void;
  // docs
  docs: GetDocsResT | undefined;
  isLoadingDocs: boolean;
  refetchDocs: () => void;
}

// Create the context
const Cxt = createContext<CxtType | undefined>(undefined);

// Provider component
interface PropsT {
  children: ReactNode;
}

export const PublicDocsCxtProvider: React.FC<PropsT> = ({ children }) => {
  // ** declare and define helper variables
  const [showItemDetials, setShowItemDetials] = useState(false);
  const {
    data: docs,
    isLoading: isLoadingDocs,
    refetch: refetchDocs,
  } = useDocsData();

  //  toggle show item details
  const toggleShowItemDetials = () => setShowItemDetials(!showItemDetials);

  // ** return provider
  return (
    <Cxt.Provider
      value={{
        // show item details
        showItemDetials,
        // toggle show item details
        toggleShowItemDetials,
        // docs
        docs,
        isLoadingDocs,
        refetchDocs,
      }}
    >
      {children}
    </Cxt.Provider>
  );
};

// Custom hook to use the context
export const usePublicDocsCxt = () => {
  const context = useContext(Cxt);
  if (context === undefined) {
    throw new Error(
      "usePublicDocsCxt must be used within a PublicDocsCxtProvider"
    );
  }
  return context;
};
