"use client";

import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useMemo, useState } from "react";
import { FunctionalContractualList } from "../constants/FunctionalContractualList";
import useUserJobOffersData from "../hooks/useUserJobOffersData";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { JobOffer } from "@/modules/user-profile/types/job-offer";
import useUserContractData from "../hooks/useUserContractData";
import { Contract } from "@/modules/user-profile/types/Contract";
import useProfessionalData from "../hooks/useUserProfessionalData";
import { ProfessionalT } from "../api/get-professinal-data";
import useTimeUnitsData from "../hooks/useTimeUnitsData";
import { TimeUnit } from "../api/get-time-units";
import { useCurrentCompany } from "@/modules/company-profile/components/shared/company-header";
import { CompanyData } from "@/modules/company-profile/types/company";

// declare context types
type FunctionalContractualCxtType = {
  activeSection: UserProfileNestedTab | undefined;
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
  // job offers data
  userJobOffersDataLoading: boolean;
  userJobOffersData: JobOffer | undefined;
  handleRefetchJobOffer: () => void;
  // user contract data
  userContractDataLoading: boolean;
  userContractData: Contract | undefined;
  handleRefetchContractData: () => void;
  // professional data
  professionalDataLoading: boolean;
  professionalData: ProfessionalT | undefined;
  handleRefetchProfessionalData: () => void;
  // time units
  timeUnits: TimeUnit[] | undefined;
  // company data
  company: CompanyData | undefined;
};

export const FunctionalContractualCxt =
  createContext<FunctionalContractualCxtType>(
    {} as FunctionalContractualCxtType
  );

// ** create a custom hook to use the context
export const useFunctionalContractualCxt = () => {
  const context = useContext(FunctionalContractualCxt);
  if (!context) {
    throw new Error(
      "useFunctionalContractualCxt must be used within a FunctionalContractualCxtProvider"
    );
  }
  return context;
};

export const FunctionalContractualCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const { userId } = useUserProfileCxt();
  const { data: companyData } = useCurrentCompany();
  const company = useMemo(() => companyData?.payload, [companyData]);
  const [activeSection, setActiveSection] = useState<UserProfileNestedTab>(
    FunctionalContractualList()[0]
  );

  // user job offers data
  const {
    data: userJobOffersData,
    isLoading: userJobOffersDataLoading,
    refetch: refetchJobOffer,
  } = useUserJobOffersData(userId ?? "");

  // user contract data
  const {
    data: userContractData,
    isLoading: userContractDataLoading,
    refetch: refetchContractData,
  } = useUserContractData(userId ?? "");

  const {
    data: professionalData,
    isLoading: professionalDataLoading,
    refetch: refetchProfessionalData,
  } = useProfessionalData(userId ?? "");

  const { data: timeUnits } = useTimeUnitsData();

  // ** declare and define component helper methods
  const handleRefetchProfessionalData = () => {
    refetchProfessionalData();
  };
  const handleRefetchContractData = () => {
    refetchContractData();
  };

  const handleRefetchJobOffer = () => {
    refetchJobOffer();
  };

  const handleChangeActiveSection = (section: UserProfileNestedTab) =>
    setActiveSection(section);

  // ** return component ui
  return (
    <FunctionalContractualCxt.Provider
      value={{
        activeSection,
        handleChangeActiveSection,
        // job offer
        userJobOffersData,
        userJobOffersDataLoading,
        handleRefetchJobOffer,
        // contract data
        userContractData,
        userContractDataLoading,
        handleRefetchContractData,
        // professional data
        professionalData,
        professionalDataLoading,
        handleRefetchProfessionalData,
        // time unit
        timeUnits,
        // company data
        company,
      }}
    >
      {children}
    </FunctionalContractualCxt.Provider>
  );
};
