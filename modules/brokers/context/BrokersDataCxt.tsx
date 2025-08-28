"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { useWidgetsData } from "../hooks/useWidgetsData";
import { WidgetT } from "../apis/get-broker-widgets";

// Define context type
interface CxtType {
  // widgets data
  widgetsData: WidgetT[] | undefined;
  // widgets loading
  widgetsLoading: boolean;
}

// Create the context
const Cxt = createContext<CxtType | undefined>(undefined);

// Provider component
interface PropsT {
  children: ReactNode;
}

export const BrokersDataCxtProvider: React.FC<PropsT> = ({ children }) => {
  // ** declare and define helper variables
  const { data: widgetsData, isLoading: widgetsLoading } = useWidgetsData();

  // ** return provider
  return (
    <Cxt.Provider value={{ widgetsData, widgetsLoading }}>
      {children}
    </Cxt.Provider>
  );
};

// Custom hook to use the context
export const useBrokersDataCxt = () => {
  const context = useContext(Cxt);
  if (context === undefined) {
    throw new Error(
      "useBrokersDataCxt must be used within a BrokersDataCxtProvider"
    );
  }
  return context;
};
