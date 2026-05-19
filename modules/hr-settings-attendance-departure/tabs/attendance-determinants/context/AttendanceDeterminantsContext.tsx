"use client";

import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import { useConstraintsData } from "@/modules/hr-settings-attendance-departure/hooks/useConstraints";
import { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";
import useBranchHierarchiesData from "@/modules/organizational-structure/components/organizational-structure-tabs/organizational-structure-tabs/components/company-structure/hooks/useBranchHierarchiesData";
import { useBranchiesData } from "../hooks/useBranchiesData";
import { useConstraintsList } from "@/modules/hr-settings-attendance-departure/hooks/useConstraintsList";
import { useCitiesData } from "../hooks/useCities";
import { City } from "../api/get-cities";

type constraintsListType = {
  payload: Constraint[];
  pagination: {
    last_page: number;
  };
};

interface AttendanceDeterminantsContextType {
  constraintsData: Constraint[] | undefined;
  activeConstraint: Constraint | undefined;
  constraintsLoading: boolean;
  constraintsError: unknown;
  branchesData: any[] | undefined;
  setActiveConstraint: React.Dispatch<
    React.SetStateAction<Constraint | undefined>
  >;
  handleConstraintClick: (id: string) => void;
  refetchConstraints: () => void;
  handlePageChange: (pageNumber: number) => void;
  handleLimitChange: (limit: number) => void;
  page: number;
  limit: number;
  // constraints list
  constraintsList: constraintsListType | undefined;
  constraintsListLoading: boolean;
  constraintsListError: unknown;
  refetchConstraintsList: () => void;
  // cities data
  citiesData: City[] | undefined;
  // Function to handle newly created determinant
  handleNewDeterminantCreated: (determinant: any) => void;
}

const AttendanceDeterminantsContext = createContext<
  AttendanceDeterminantsContextType | undefined
>(undefined);

export const AttendanceDeterminantsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const {
    data: constraintsData,
    isLoading: constraintsLoading,
    error: constraintsError,
    refetch: refetchConstraints,
  } = useConstraintsData({ limit: 1000 });

  const {
    data: constraintsList,
    isLoading: constraintsListLoading,
    error: constraintsListError,
    refetch: refetchConstraintsList,
  } = useConstraintsList({ limit: limit, page: page });

  const { data: branchesData } = useBranchiesData();

  const { data: citiesData } = useCitiesData();

  console.log("citiesData", citiesData);

  const [activeConstraint, setActiveConstraint] = useState<Constraint>();

  useEffect(() => {
    if (constraintsData && activeConstraint) {
      const updatedConstraint = constraintsData.payload.find(
        (c) => c.id === activeConstraint.id
      );
      if (updatedConstraint) {
        setActiveConstraint(updatedConstraint);
      }
    }
  }, [constraintsData, activeConstraint]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };

  const handleConstraintClick = (id: string) => {
    if (id === "all-determinants") {
      setActiveConstraint(undefined);
      return;
    }

    if (constraintsData) {
      const selectedConstraint = constraintsData.payload.find(
        (c) => c.id === id
      );
      if (selectedConstraint) {
        setActiveConstraint(selectedConstraint);
      }
    }
  };

  const handleNewDeterminantCreated = (determinant: any) => {
    setTimeout(() => {
      if (determinant?.id) {
        setActiveConstraint(determinant);
      }
    }, 500);
  };

  const contextValue: AttendanceDeterminantsContextType = {
    constraintsData: constraintsData?.payload,
    activeConstraint,
    constraintsLoading,
    constraintsError,
    branchesData,
    setActiveConstraint,
    handleConstraintClick,
    refetchConstraints,
    handlePageChange,
    handleLimitChange,
    page,
    limit,
    constraintsList,
    constraintsListLoading,
    constraintsListError,
    refetchConstraintsList,
    citiesData,
    handleNewDeterminantCreated,
  };

  return (
    <AttendanceDeterminantsContext.Provider value={contextValue}>
      {children}
    </AttendanceDeterminantsContext.Provider>
  );
};

export const useAttendanceDeterminants =
  (): AttendanceDeterminantsContextType => {
    const context = useContext(AttendanceDeterminantsContext);
    if (context === undefined) {
      throw new Error(
        "useAttendanceDeterminants must be used within an AttendanceDeterminantsProvider"
      );
    }
    return context;
  };
