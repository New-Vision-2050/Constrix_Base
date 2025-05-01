"use client";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext } from "react";
import useUserBankingData from "../../../../hooks/useUserBankingData";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { BankAccount } from "@/modules/user-profile/types/bank-account";

// declare context types
type UserBankingDataCxtType = {
  bankAccounts: BankAccount[] | undefined;
  handleRefreshBankingData: () => void;
  bankAccountsLoading: boolean
};

export const UserBankingDataCxt = createContext<UserBankingDataCxtType>(
  {} as UserBankingDataCxtType
);

// ** create a custom hook to use the context
export const useUserBankingDataCxt = () => {
  const context = useContext(UserBankingDataCxt);
  if (!context) {
    throw new Error(
      "useUserBankingDataCxt must be used within a UserBankingDataCxtProvider"
    );
  }
  return context;
};

export const UserBankingDataCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const { user } = useUserProfileCxt();
  const {
    data: bankAccounts,
    isLoading: bankAccountsLoading,
    refetch: refreshBankingData,
  } = useUserBankingData(user?.user_id ?? "");

  // ** handle side effects

  // ** declare and define component helper methods
  const handleRefreshBankingData = () => {
    refreshBankingData();
  };

  // ** return component ui
  return (
    <UserBankingDataCxt.Provider
      value={{ bankAccounts,bankAccountsLoading, handleRefreshBankingData }}
    >
      {children}
    </UserBankingDataCxt.Provider>
  );
};
