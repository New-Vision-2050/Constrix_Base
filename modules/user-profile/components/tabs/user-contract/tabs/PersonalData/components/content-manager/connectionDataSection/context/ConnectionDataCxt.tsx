"use client";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext } from "react";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { ResponseSocialDataT } from "../../../../api/get-social-data";
import useUserSocialData from "../../../../hooks/useUserSocialData";
import useUserContactInfoData from "../../../../hooks/useUserAddressData";
import { ResponseContactInfoDataT } from "../../../../api/get-address-data";

// declare context types
type ConnectionDataCxtType = {
  //contact data
  userContactData: ResponseContactInfoDataT | undefined;
  handleRefetchUserContactData: () => void;
  // social data
  userSocialData: ResponseSocialDataT | undefined;
  handleRefetchUserSocialData: () => void;
};

export const ConnectionDataCxt = createContext<ConnectionDataCxtType>(
  {} as ConnectionDataCxtType
);

// ** create a custom hook to use the context
export const useConnectionDataCxt = () => {
  const context = useContext(ConnectionDataCxt);
  if (!context) {
    throw new Error(
      "useConnectionDataCxt must be used within a ConnectionDataCxtProvider"
    );
  }
  return context;
};

export const ConnectionDataCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const { user } = useUserProfileCxt();
  const { data: userSocialData, refetch: refetchUserSocialData } =
    useUserSocialData(user?.user_id ?? "");

  const { data: userContactData, refetch: refetchUserContactData } =
    useUserContactInfoData(user?.user_id ?? "");

  // ** handle side effects

  // ** declare and define component helper methods
  const handleRefetchUserContactData = () => {
    refetchUserContactData();
  };

  const handleRefetchUserSocialData = () => {
    refetchUserSocialData();
  };

  // ** return component ui
  return (
    <ConnectionDataCxt.Provider
      value={{
        // contact data
        userContactData,
        handleRefetchUserContactData,
        // social
        userSocialData,
        handleRefetchUserSocialData,
      }}
    >
      {children}
    </ConnectionDataCxt.Provider>
  );
};
