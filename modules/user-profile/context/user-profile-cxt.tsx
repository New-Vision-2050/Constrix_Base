"use client";

import { useRouter, useSearchParams } from "next/navigation";

// types
import type { ReactNode, SetStateAction } from "react";

// import packages
import { createContext, useContext, useEffect, useState } from "react";
import { UserProfileData } from "../types/user-profile-response";
import useProfileDataStatus from "../hooks/useProfileDataStatus";
import { ProfileDataStatus } from "../types/profile-data-status";
import useProfileWidgetData from "../hooks/useProfileWidgetData";
import { ProfileWidgetData } from "../types/profile-widgets";
import useUserPersonalData from "../components/tabs/user-contract/tabs/PersonalData/hooks/useUserPersonalData";
import { PersonalUserDataSectionT } from "../components/tabs/user-contract/tabs/PersonalData/api/get-personal-data";
import useUserProfileData from "../hooks/useUserProfileData";
import useUserActivitiesData from "../hooks/useUserActivities";
import { UserActivityT } from "../types/user-activity";

// declare context types
type UserProfileCxtType = {
  isLoading: boolean;
  user: UserProfileData | undefined;
  handleRefetchProfileData: () => void;
  handleUpdateImage: (imgUrl: string) => void;

  // data status
  userDataStatus: ProfileDataStatus | undefined;
  handleRefetchDataStatus: () => void;

  // widgets data
  widgetData: ProfileWidgetData | undefined;
  handleRefetchWidgetData: () => void;

  // personal data
  userPersonalData: PersonalUserDataSectionT | undefined;
  handleRefetchUserPersonalData: () => void;

  tab1: string | null;
  tab2: string | null;
  setTab1: React.Dispatch<SetStateAction<string>>;
  setTab2: React.Dispatch<SetStateAction<string>>;
  verticalSection: string | null;

  // company id
  companyId: string | null;

  // user activities
  userActivities: UserActivityT[] | undefined;
  isLoadingUserActivities: boolean;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const companyId = searchParams.get("company_id");
  const [tab1, setTab1] = useState(searchParams.get("tab1") ?? "");
  const [tab2, setTab2] = useState(searchParams.get("tab2") ?? "");
  const verticalSection = searchParams.get("verticalSection");
  const [user, setUser] = useState<UserProfileData>();
  const {
    data: _user,
    isLoading,
    refetch: refetchProfileData,
  } = useUserProfileData(userId !== null ? userId : undefined);
  const { data: userActivities, isLoading: isLoadingUserActivities } =
    useUserActivitiesData(userId !== null ? userId : undefined);
  const { data: userDataStatus, refetch: refetchDataStatus } =
    useProfileDataStatus((userId || _user?.user_id) ?? "");
  const { data: userPersonalData, refetch: refreshUserPersonalData } =
    useUserPersonalData(user?.user_id);
  const { data: widgetData, refetch: refetchWidgetData } = useProfileWidgetData(
    (userId || _user?.user_id) ?? ""
  );

  // ** handle side effects
  useEffect(() => {
    if (_user) setUser(_user);
  }, [_user]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (tab1) {
      params.set("tab1", tab1);
    } else {
      params.delete("tab1");
    }

    if (tab2) {
      params.set("tab2", tab2);
    } else {
      params.delete("tab2");
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [tab1, tab2, router, searchParams]);

  // ** declare and define component helper methods
  const handleRefetchWidgetData = () => {
    refetchWidgetData();
  };

  const handleRefetchProfileData = () => {
    refetchProfileData();
  };

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
        handleRefetchProfileData,

        // user data status
        userDataStatus,
        handleRefetchDataStatus,

        // widgetData
        widgetData,
        handleRefetchWidgetData,

        // personal data
        userPersonalData,
        handleRefetchUserPersonalData,

        // external routes
        tab1,
        tab2,
        setTab1,
        setTab2,
        verticalSection,

        // company id
        companyId,

        // user activities
        userActivities,
        isLoadingUserActivities,
      }}
    >
      {children}
    </UserProfileCxt.Provider>
  );
};
