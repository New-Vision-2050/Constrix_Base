"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";

// Define context type
interface CxtType {
  // show item details
  showItemDetials: boolean;
  toggleShowItemDetials: () => void;
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
