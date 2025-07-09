import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";
import { useConstraintsData } from "@/modules/hr-settings-attendance-departure/hooks/useConstraints";
import { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";

// Define the context interface
interface AttendanceDeterminantsContextType {
  constraintsData: Constraint[] | undefined;
  activeConstraint: Constraint | undefined;
  constraintsLoading: boolean;
  constraintsError: unknown;
  setActiveConstraint: React.Dispatch<React.SetStateAction<Constraint | undefined>>;
  handleConstraintClick: (id: string) => void;
  refetchConstraints: () => void;
}

// Create the context with an initial value
const AttendanceDeterminantsContext = createContext<
  AttendanceDeterminantsContextType | undefined
>(undefined);

// Context provider
export const AttendanceDeterminantsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    data: constraintsData,
    isLoading: constraintsLoading,
    error: constraintsError,
    refetch: refetchConstraints,
  } = useConstraintsData();
  
  // State for active constraint
  const [activeConstraint, setActiveConstraint] = useState<Constraint>();

  // Handle click on a constraint
  const handleConstraintClick = (id: string) => {
    // Special case for "all constraints" (show all when no active constraint)
    if (id === "all-determinants") {
      setActiveConstraint(undefined);
      return;
    }

    // Find and set the selected constraint
    if (constraintsData) {
      const selectedConstraint = constraintsData.find((c) => c.id === id);
      if (selectedConstraint) {
        setActiveConstraint(selectedConstraint);
      }
    }
  };

  // Context value to export
  const contextValue: AttendanceDeterminantsContextType = {
    constraintsData,
    activeConstraint,
    constraintsLoading,
    constraintsError,
    setActiveConstraint,
    handleConstraintClick,
    refetchConstraints,
  };

  return (
    <AttendanceDeterminantsContext.Provider value={contextValue}>
      {children}
    </AttendanceDeterminantsContext.Provider>
  );
};

// Custom hook to use the context
export const useAttendanceDeterminants = (): AttendanceDeterminantsContextType => {
  const context = useContext(AttendanceDeterminantsContext);
  if (context === undefined) {
    throw new Error(
      "useAttendanceDeterminants must be used within an AttendanceDeterminantsProvider"
    );
  }
  return context;
};
