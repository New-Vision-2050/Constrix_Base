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
  openCreateBroker: boolean;
  openCreateBrokerSheet: () => void;
  closeCreateBrokerSheet: () => void;
  branchId: string | undefined;
  userId: string | undefined;
  tableId?: string;
}

// Create the context
const Cxt = createContext<CxtType | undefined>(undefined);

// Provider component
interface PropsT {
  children: ReactNode;
  tableId?: string;
}

export const CreateBrokerCxtProvider: React.FC<PropsT> = ({ children, tableId }) => {
  // ** declare and define helper variables
  // control open sheet
  const [openCreateBroker, setOpenCreateBroker] = useState(false);
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
  const openCreateBrokerSheet = () => {
    setOpenCreateBroker(true);
  };

  const closeCreateBrokerSheet = () => {
    setOpenCreateBroker(false);
  };

  // ** return provider
  return (
    <Cxt.Provider
      value={{
        // control open sheet
        openCreateBroker,
        openCreateBrokerSheet,
        closeCreateBrokerSheet,
        // branch id
        branchId,
        // user id
        userId,
        // table id
        tableId,
      }}
    >
      {children}
    </Cxt.Provider>
  );
};

// Custom hook to use the context
export const useCreateBrokerCxt = () => {
  const context = useContext(Cxt);
  if (context === undefined) {
    throw new Error(
      "useCreateBrokerCxt must be used within a CreateBrokerCxtProvider"
    );
  }
  return context;
};
