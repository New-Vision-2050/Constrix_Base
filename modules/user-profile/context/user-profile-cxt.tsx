"use client";

import { useSearchParams } from "next/navigation";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useEffect, useState } from "react";
import useUserProfileData from "../hooks/useUserProfileData";
import { UserProfileData } from "../types/user-profile-response";
import useProfileDataStatus from "../hooks/useProfileDataStatus";
import { ProfileDataStatus } from "../types/profile-data-status";
import useProfileWidgetData from "../hooks/useProfileWidgetData";
import { ProfileWidgetData } from "../types/profile-widgets";
import useUserPersonalData from "../components/tabs/user-contract/tabs/PersonalData/hooks/useUserPersonalData";
import { PersonalUserDataSectionT } from "../components/tabs/user-contract/tabs/PersonalData/api/get-personal-data";

// declare context types
type UserProfileCxtType = {
  isLoading: boolean;
  user: UserProfileData | undefined;
  handleUpdateImage: (imgUrl: string) => void;

  // data status
  userDataStatus: ProfileDataStatus | undefined;
  handleRefetchDataStatus: () => void;

  // widgets data
  widgetData: ProfileWidgetData | undefined;

  // personal data
  userPersonalData: PersonalUserDataSectionT | undefined;
  handleRefetchUserPersonalData: () => void;
};

export const UserProfileCxt = createContext<UserProfileCxtType>(
  {} as UserProfileCxtType
);
 
// ** create a custom hook to use the context
export const useUserProfileCxt = () => {
  const context = useContext(UserProfileCxt);
  if (!context) {
    throw new Error(
      "useUserProfileCxt must be used within a UserProfileCxtProvider"
    );
  }
  return context;
};

type PropsT = { children: ReactNode };
export const UserProfileCxtProvider = ({ children }: PropsT) => {
  // ** declare and define component state and variables
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [user, setUser] = useState<UserProfileData>();
  const { data: _user, isLoading } = useUserProfileData();
  const { data: userDataStatus, refetch: refetchDataStatus } =
    useProfileDataStatus((userId || _user?.user_id) ?? "");
  const { data: userPersonalData, refetch: refreshUserPersonalData } =
    useUserPersonalData();
  const { data: widgetData } = useProfileWidgetData(
    (userId || _user?.user_id) ?? ""
  );

  // ** handle side effects
  useEffect(() => {
    if (_user) setUser(_user);
  }, [_user]);

  // ** declare and define component helper methods
  const handleRefetchUserPersonalData = () => {
    refreshUserPersonalData();
  };

  const handleRefetchDataStatus = () => {
    refetchDataStatus();
  };

  const handleUpdateImage = (imgUrl: string) => {
    if (user) setUser({ ...user, image_url: imgUrl });
  };

  // ** return component ui
  return (
    <UserProfileCxt.Provider
      value={{
        // user data
        user,
        isLoading,
        handleUpdateImage,

        // user data status
        userDataStatus,
        handleRefetchDataStatus,

        // widgetData
        widgetData,

        // personal data
        userPersonalData,
        handleRefetchUserPersonalData,
      }}
    >
      {children}
    </UserProfileCxt.Provider>
  );
};
