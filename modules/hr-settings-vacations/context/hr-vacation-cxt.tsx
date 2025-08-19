"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useVacationPolicies } from "../hooks/useVacationPolicies";
import { VacationPolicie } from "../types/VacationPolicie";

// Define context type
interface HRVacationCxtType {
  // TODO: vacations policies
  VPPage: number;
  VPLimit: number;
  VPLastPage: number;
  vacationsPoliciesLoading: boolean;
  vacationsPolicies: VacationPolicie[];
  handleVPPageChange: (page: number) => void;
  handleVPLimitChange: (limit: number) => void;
}

// Create the context
const HRVacationCxt = createContext<HRVacationCxtType | undefined>(undefined);

// Provider component
interface PropsT {
  children: ReactNode;
}

export const HRVacationCxtProvider: React.FC<PropsT> = ({ children }) => {
  // TODO: declare and define variables
  // TODO: vacations policies
  const [VPLimit, setVPLimit] = useState(2);
  const [VPPage, setVPPage] = useState(1);
  const {
    data: vacationsPoliciesResponse,
    isLoading: vacationsPoliciesLoading,
  } = useVacationPolicies({
    limit: VPLimit,
    page: VPPage,
  });

  // TODO: declare and define methods
  const handleVPPageChange = (page: number) => {
    setVPPage(page);
  };

  const handleVPLimitChange = (limit: number) => {
    setVPLimit(limit);
  };

  return (
    <HRVacationCxt.Provider
      value={{
        // ** vacations policies
        VPPage,
        VPLimit,
        VPLastPage: vacationsPoliciesResponse?.pagination?.last_page ?? 1,
        vacationsPolicies: vacationsPoliciesResponse?.payload ?? [],
        vacationsPoliciesLoading,
        handleVPPageChange,
        handleVPLimitChange,
      }}
    >
      {children}
    </HRVacationCxt.Provider>
  );
};

// Custom hook to use the context
export const useHRVacationCxt = () => {
  const context = useContext(HRVacationCxt);
  if (context === undefined) {
    throw new Error(
      "useHRVacationCxt must be used within a HRVacationCxtProvider"
    );
  }
  return context;
};
