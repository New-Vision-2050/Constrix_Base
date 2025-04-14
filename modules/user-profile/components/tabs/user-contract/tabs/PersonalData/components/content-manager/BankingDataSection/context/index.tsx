"use client";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext } from "react";
import useUserBankingData from "../../../../hooks/useUserBankingData";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

// declare context types
type UserBankingDataCxtType = {};

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
  const { data } = useUserBankingData(user?.user_id ?? "");

  // ** handle side effects

  // ** declare and define component helper methods

  // ** return component ui
  return (
    <UserBankingDataCxt.Provider value={{}}>
      {children}
    </UserBankingDataCxt.Provider>
  );
};
