"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { MedicalInsuranceRow } from "../types";

// Define the type of data in the context
interface InsuranceContextType {
  // All insurances list
  insurances: MedicalInsuranceRow[];
  insurancesLoading: boolean;
  insurancesError: Error | null;
  setInsurances: (insurances: MedicalInsuranceRow[]) => void;

  // Selected insurance for table view
  selectedInsurance: MedicalInsuranceRow | null;
  setSelectedInsurance: (insurance: MedicalInsuranceRow | null) => void;

  // Dialog state
  isAddDialogOpen: boolean;
  setAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setEditDialogOpen: (isOpen: boolean) => void;

  // Functions to open and close dialogs
  openAddDialog: () => void;
  closeAddDialog: () => void;
  openEditDialog: (insurance: MedicalInsuranceRow) => void;
  closeEditDialog: () => void;

  // Refetch function
  refetchInsurances: () => void;
}

// Create the context
export const InsuranceContext = createContext<
  InsuranceContextType | undefined
>(undefined);

// Provider component
interface InsuranceProviderProps {
  children: ReactNode;
}

export const InsuranceProvider: React.FC<InsuranceProviderProps> = ({
  children,
}) => {
  // Insurance data state
  const [insurances, setInsurances] = useState<MedicalInsuranceRow[]>([]);
  const [insurancesLoading, setInsurancesLoading] = useState<boolean>(false);
  const [insurancesError, setInsurancesError] = useState<Error | null>(null);

  // Selected insurance for table view
  const [selectedInsurance, setSelectedInsurance] = useState<MedicalInsuranceRow | null>(null);

  // Dialog states
  const [isAddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  // Refetch function (placeholder - will be implemented with API)
  const refetchInsurances = useCallback(() => {
    // This will be implemented when API is ready
    console.log("Refetching insurances...");
  }, []);

  // Dialog functions
  const openAddDialog = useCallback(() => {
    setAddDialogOpen(true);
  }, []);

  const closeAddDialog = useCallback(() => {
    setAddDialogOpen(false);
  }, []);

  const openEditDialog = useCallback((insurance: MedicalInsuranceRow) => {
    setSelectedInsurance(insurance);
    setEditDialogOpen(true);
  }, []);

  const closeEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setTimeout(() => setSelectedInsurance(null), 300);
  }, []);

  // The value that will be provided to consumers
  const value: InsuranceContextType = {
    // Insurance data
    insurances,
    insurancesLoading,
    insurancesError,
    setInsurances,

    // Selected insurance
    selectedInsurance,
    setSelectedInsurance,

    // Dialog states
    isAddDialogOpen,
    setAddDialogOpen,
    isEditDialogOpen,
    setEditDialogOpen,

    // Dialog functions
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    closeEditDialog,

    // Refetch
    refetchInsurances,
  };

  return (
    <InsuranceContext.Provider value={value}>
      {children}
    </InsuranceContext.Provider>
  );
};

// Custom hook for using the context
export const useInsurance = (): InsuranceContextType => {
  const context = useContext(InsuranceContext);
  if (context === undefined) {
    throw new Error("useInsurance must be used within an InsuranceProvider");
  }
  return context;
};
