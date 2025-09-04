"use client";

import useUserData from "@/hooks/use-user-data";
import { useBranches } from "@/modules/attendance-departure/hooks/useBranches";
import { CRMSettingsT } from "@/modules/crm-settings/api/get-shared-settings";
import { useCRMSharedSetting } from "@/modules/crm-settings/hooks/useCRMSharedSetting";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

// Define context type
interface CxtType {
  openCreateClient: boolean;
  openCreateClientSheet: () => void;
  closeCreateClientSheet: () => void;
  branchId: string | undefined;
  userId: string | undefined;
  sharedSettings: CRMSettingsT | undefined;
  companyBranchesIds: string[];
}

// Create the context
const Cxt = createContext<CxtType | undefined>(undefined);

// Provider component
interface PropsT {
  children: ReactNode;
}

export const CreateClientCxtProvider: React.FC<PropsT> = ({ children }) => {
  // ** declare and define helper variables
  // control open sheet
  const [openCreateClient, setOpenCreateClient] = useState(false);
  // shared setting
  const { data: sharedSettings } = useCRMSharedSetting();
  const { branches } = useBranches();
  const companyBranchesIds: string[] = useMemo(() => {
    return branches?.map((branch: any) => branch.id.toString());
  }, [branches]);
  // current user data
  const { data: userData } = useUserData();
  const branchId = useMemo(() => {
    return userData?.payload?.branch_id;
  }, [userData]);
  const userId = useMemo(() => {
    return userData?.payload?.id;
  }, [userData]);

  // ** define helper functions

  // control open sheet
  const openCreateClientSheet = () => {
    setOpenCreateClient(true);
  };

  const closeCreateClientSheet = () => {
    setOpenCreateClient(false);
  };

  // ** return provider
  return (
    <Cxt.Provider
      value={{
        // control open sheet
        openCreateClient,
        openCreateClientSheet,
        closeCreateClientSheet,
        // branch id
        branchId,
        // user id
        userId,
        // shared setting
        sharedSettings,
        // company branches ids
        companyBranchesIds,
      }}
    >
      {children}
    </Cxt.Provider>
  );
};

// Custom hook to use the context
export const useCreateClientCxt = () => {
  const context = useContext(Cxt);
  if (context === undefined) {
    throw new Error(
      "useCreateClientCxt must be used within a CreateClientCxtProvider"
    );
  }
  return context;
};
