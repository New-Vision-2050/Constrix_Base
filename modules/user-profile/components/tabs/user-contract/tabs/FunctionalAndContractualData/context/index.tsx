"use client";

import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useState } from "react";
import { FunctionalContractualList } from "../constants/FunctionalContractualList";
import useUserJobOffersData from "../hooks/useUserJobOffersData";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { JobOffer } from "@/modules/user-profile/types/job-offer";
import useUserContractData from "../hooks/useUserContractData";
import { Contract } from "@/modules/user-profile/types/Contract";
import useProfessionalData from "../hooks/useUserProfessionalData";
import { ProfessionalT } from "../api/get-professinal-data";

// declare context types
type FunctionalContractualCxtType = {
  activeSection: UserProfileNestedTab | undefined;
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
  // job offers data
  userJobOffersData: JobOffer | undefined;
  handleRefetchJobOffer: () => void;
  // user contract data
  userContractData: Contract | undefined;
  handleRefetchContractData: () => void;
  // professional data
  professionalData: ProfessionalT | undefined;
  handleRefetchProfessionalData: () => void
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
  const { user } = useUserProfileCxt();
  const [activeSection, setActiveSection] = useState<UserProfileNestedTab>(
    FunctionalContractualList[0]
  );
  // user job offers data
  const { data: userJobOffersData, refetch: refetchJobOffer } =
    useUserJobOffersData(user?.user_id ?? "");

  // user contract data
  const { data: userContractData, refetch: refetchContractData } =
    useUserContractData(user?.user_id ?? "");

  const { data: professionalData, refetch: refetchProfessionalData } =
    useProfessionalData(user?.user_id ?? "");

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
        handleRefetchJobOffer,
        // contract data
        userContractData,
        handleRefetchContractData,
        // professional data
        professionalData,
        handleRefetchProfessionalData
      }}
    >
      {children}
    </FunctionalContractualCxt.Provider>
  );
};
