import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  PropsWithChildren,
} from "react";
import { DETERMINANTS_LIST } from "../constants/determinants";
import { AttendanceDeterminant } from "../../../types/attendance-departure";
import { useConstraintsData } from "@/modules/hr-settings-attendance-departure/hooks/useConstraints";

// Definir la interfaz del contexto
interface AttendanceDeterminantsContextType {
  determinants: AttendanceDeterminant[];
  activeDeterminant: AttendanceDeterminant | null;
  showAllDeterminants: boolean;
  setActiveDeterminant: (determinant: AttendanceDeterminant | null) => void;
  handleDeterminantClick: (id: string) => void;
  toggleAllDeterminants: () => void;
  updateDeterminant: (updatedDeterminant: AttendanceDeterminant) => void;
}

// Crear el contexto con un valor inicial
const AttendanceDeterminantsContext = createContext<
  AttendanceDeterminantsContextType | undefined
>(undefined);

// Proveedor del contexto
export const AttendanceDeterminantsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  // Estado para los determinantes
  const [determinants, setDeterminants] = useState(DETERMINANTS_LIST);
  const [activeDeterminant, setActiveDeterminant] =
    useState<AttendanceDeterminant | null>(
      determinants.find((d) => d.active) || determinants[0]
    );
  const [showAllDeterminants, setShowAllDeterminants] = useState(false);

  // Constraints
  const {
    data: constraints,
    isLoading: constraintsLoading,
    error: constraintsError,
    refetch: refetchConstraints,
  } = useConstraintsData();

  // Manejar clic en un determinante
  const handleDeterminantClick = (id: string) => {
    // Caso especial para "todos los determinantes"
    if (id === "all-determinants") {
      setShowAllDeterminants(true);
      setActiveDeterminant(null);

      // Actualizar la lista de determinantes sin estado activo
      setDeterminants((prevDeterminants) =>
        prevDeterminants.map((det) => ({
          ...det,
          active: false,
        }))
      );
      return;
    }

    // Encontrar el determinante seleccionado
    const selectedDeterminant = determinants.find((d) => d.id === id);

    if (selectedDeterminant) {
      // Actualizar el determinante activo
      setActiveDeterminant(selectedDeterminant);
      setShowAllDeterminants(false);

      // Actualizar la lista de determinantes con el nuevo estado activo
      setDeterminants((prevDeterminants) =>
        prevDeterminants.map((det) => ({
          ...det,
          active: det.id === id,
        }))
      );
    }
  };

  // Alternar entre mostrar todos los determinantes o el detalle
  const toggleAllDeterminants = () => {
    setShowAllDeterminants((prev) => !prev);
    if (!showAllDeterminants) {
      setActiveDeterminant(null);
    } else if (determinants.length > 0) {
      const activeDet = determinants.find((d) => d.active) || determinants[0];
      setActiveDeterminant(activeDet);
    }
  };

  // Actualizar un determinante específico
  const updateDeterminant = (updatedDeterminant: AttendanceDeterminant) => {
    setDeterminants((prevDeterminants) =>
      prevDeterminants.map((det) =>
        det.id === updatedDeterminant.id ? updatedDeterminant : det
      )
    );

    // Si el determinante actualizado es el activo, actualizar también el estado activeDeterminant
    if (activeDeterminant && activeDeterminant.id === updatedDeterminant.id) {
      setActiveDeterminant(updatedDeterminant);
    }
  };

  // Valor del contexto
  const contextValue: AttendanceDeterminantsContextType = {
    determinants,
    activeDeterminant,
    showAllDeterminants,
    setActiveDeterminant,
    handleDeterminantClick,
    toggleAllDeterminants,
    updateDeterminant,
  };

  return (
    <AttendanceDeterminantsContext.Provider value={contextValue}>
      {children}
    </AttendanceDeterminantsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAttendanceDeterminants =
  (): AttendanceDeterminantsContextType => {
    const context = useContext(AttendanceDeterminantsContext);
    if (context === undefined) {
      throw new Error(
        "useAttendanceDeterminants debe usarse dentro de un AttendanceDeterminantsProvider"
      );
    }
    return context;
  };
