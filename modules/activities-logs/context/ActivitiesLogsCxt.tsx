"use client";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useState } from "react";
import { useActivitiesLogs } from "../hooks/useActivitiesLogs";
import { ActivitiesLogsT } from "../apis/get-activities-logs";

// declare context types
type ActivitiesLogsCxtType = {
  activitiesLogs: ActivitiesLogsT | undefined;
  activitiesLogsLoading: boolean;

  limit: number;
  handleLimitChange: (limit: number) => void;
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
  const { data: activitiesLogs, isLoading: activitiesLogsLoading } =
    useActivitiesLogs(limit);

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };
  // ** return component ui
  return (
    <ActivitiesLogsCxt.Provider
      value={{
        activitiesLogs,
        activitiesLogsLoading,
        limit,
        handleLimitChange,
      }}
    >
      {children}
    </ActivitiesLogsCxt.Provider>
  );
};
