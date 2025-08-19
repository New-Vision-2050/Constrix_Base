"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useVacationPolicies } from "../hooks/useVacationPolicies";
import { VacationPolicie } from "../types/VacationPolicie";
import { useBranches } from "@/modules/attendance-departure/hooks/useBranches";
import { SelectOption } from "@/types/select-option";
import { PublicVacation } from "../types/PublicVacation";

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
  handleVPRefresh: () => void;

  // ** Branchies
  branches: SelectOption[];
  selectedBranchId: number | null;
  handleBranchSelect: (branchId: number | null) => void;

  // ** Edit Policy
  editedPolicy: VacationPolicie | undefined;
  handleStoreEditPolicy: (policy: VacationPolicie | undefined) => void;

  // ** Open Edit Form
  openVPForm: boolean;
  handleOpenVPForm: () => void;
  handleCloseVPForm: () => void;

  // ** Edit Public Vacation
  editedPublicVacation: PublicVacation | undefined;
  handleStoreEditPublicVacation: (policy: PublicVacation | undefined) => void;
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
    refetch: refetchVacationsPolicies,
  } = useVacationPolicies({
    limit: VPLimit,
    page: VPPage,
  });
  const [editedPolicy, setEditedPolicy] = useState<VacationPolicie>();

  const [openVPForm, setOpenVPForm] = useState(false);

  const [editedPublicVacation, setEditedPublicVacation] = useState<PublicVacation>();

  // ** Branchies
  const { branches } = useBranches();
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  // TODO: declare and define methods
  const handleVPPageChange = (page: number) => {
    setVPPage(page);
  };

  const handleVPLimitChange = (limit: number) => {
    setVPLimit(limit);
  };

  const handleVPRefresh = () => {
    refetchVacationsPolicies();
  };

  const handleStoreEditPolicy = (policy: VacationPolicie | undefined) => {
    setEditedPolicy(policy);
  };

  const handleStoreEditPublicVacation = (policy: PublicVacation | undefined) => {
    setEditedPublicVacation(policy);
  };

  const handleBranchSelect = (branchId: number | null) => {
    setSelectedBranchId(branchId);
  };

  const handleOpenVPForm = () => {
    setOpenVPForm(true);
  };

  const handleCloseVPForm = () => {
    setOpenVPForm(false);
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
        handleVPRefresh,
        // ** Branchies
        branches,
        selectedBranchId,
        handleBranchSelect,
        // ** Edit Policy
        editedPolicy,
        handleStoreEditPolicy,
        // ** Open Edit Form
        openVPForm,
        handleOpenVPForm,
        handleCloseVPForm,
        // ** Edit Public Vacation
        editedPublicVacation,
        handleStoreEditPublicVacation,
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
