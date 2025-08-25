"use client";

import useUserData from "@/hooks/use-user-data";
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
  // current user data
  const { data: userData } = useUserData();
  const branchId = useMemo(() => {
    return userData?.payload?.branch_id;
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
