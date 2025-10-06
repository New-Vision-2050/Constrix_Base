"use client";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useMemo, useState } from "react";
import { useActivitiesLogs } from "../hooks/useActivitiesLogs";
import { ActivitiesLogsT } from "../apis/get-activities-logs";
import { useUsersList } from "../hooks/useUsersList";
import useUserData from "@/hooks/use-user-data";

export type SearchUserActivityLogT = {
  type: string;
  user_id: string;
  time_from: string;
  time_to: string;
};

// declare context types
type ActivitiesLogsCxtType = {
  activitiesLogs: ActivitiesLogsT | undefined;
  activitiesLogsLoading: boolean;

  limit: number;
  handleLimitChange: (limit: number) => void;

  usersList: { id: string; name: string }[];

  searchFields: SearchUserActivityLogT;
  handleSearchFieldsChange: (data: SearchUserActivityLogT) => void;

  currentUserId: string;
  isCurrentUserAdmin: boolean;
};

export const ActivitiesLogsCxt = createContext<ActivitiesLogsCxtType>(
  {} as ActivitiesLogsCxtType
);

// ** create a custom hook to use the context
export const useActivitiesLogsCxt = () => {
  const context = useContext(ActivitiesLogsCxt);
  if (!context) {
    throw new Error(
      "useActivitiesLogsCxt must be used within a ActivitiesLogsCxtProvider"
    );
  }
  return context;
};

type PropsT = { children: ReactNode };

export const ActivitiesLogsCxtProvider = ({ children }: PropsT) => {
  // ** declare and define component state and variables
  const [limit, setLimit] = useState(10);
  const [searchFields, setSearchFields] = useState<SearchUserActivityLogT>({
    type: "",
    user_id: "",
    time_from: "",
    time_to: "",
  });
  const { data: activitiesLogs, isLoading: activitiesLogsLoading } =
    useActivitiesLogs(limit, searchFields);

  const { data: usersList } = useUsersList();
  const { data: userData } = useUserData();
  const currentUserId = useMemo(() => {
    return userData?.payload?.id ?? "";
  }, [userData]);
  const isCurrentUserAdmin = useMemo(() => {
    return userData?.payload?.is_super_admin == 1;
  }, [userData]);

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  const handleSearchFieldsChange = (data: SearchUserActivityLogT) => {
    setSearchFields(data);
  };
  // ** return component ui
  return (
    <ActivitiesLogsCxt.Provider
      value={{
        activitiesLogs,
        activitiesLogsLoading,
        limit,
        handleLimitChange,
        searchFields,
        handleSearchFieldsChange,
        usersList: usersList ?? [],
        currentUserId,
        isCurrentUserAdmin,
      }}
    >
      {children}
    </ActivitiesLogsCxt.Provider>
  );
};
