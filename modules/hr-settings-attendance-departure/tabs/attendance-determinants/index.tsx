import React from "react";
import {
  DeterminantDetails,
  AttendanceDeterminantsContent as ContentComponent,
} from "./components";
import TabHeader from "./components/TabHeader";
import {
  useAttendanceDeterminants,
  AttendanceDeterminantsProvider,
} from "./context/AttendanceDeterminantsContext";
import { AlertCircle, Loader2 } from "lucide-react";

// Componente contenedor que usa el contexto
function AttendanceDeterminantsTabContent() {
  // Usar el contexto para acceder a los estados y funciones
  const {
    constraintsData,
    activeConstraint,
    constraintsLoading,
    constraintsError,
    handleConstraintClick,
  } = useAttendanceDeterminants();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[20%_80%] gap-2 md:gap-6 min-h-[calc(100vh-180px)] p-4">
      {constraintsLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin" />
        </div>
      ) : constraintsError ? (
        <div className="flex items-center justify-center h-full">
          <AlertCircle className="text-red-500" />
          <p className="ml-2 text-red-500">Error al cargar los determinantes</p>
        </div>
      ) : (
        <>
          {/* Sidebar with determinants list */}
          <div className="px-2">
            <ContentComponent
              determinants={constraintsData ?? []}
              onDeterminantClick={handleConstraintClick}
            />
          </div>

          {/* Main content area */}
          <div className="px-4 py-2">
            <TabHeader />
            {!Boolean(activeConstraint) ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {constraintsData?.map((determinant) => (
                    <div
                      key={determinant.id}
                      className="cursor-pointer transition-transform hover:scale-[1.02] min-[390px]"
                      onClick={() => handleConstraintClick(determinant.id)}
                    >
                      <DeterminantDetails constraint={determinant} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              activeConstraint && (
                <DeterminantDetails constraint={activeConstraint} />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Componente principal que provee el contexto
export default function AttendanceDeterminantsTab() {
  return (
    <AttendanceDeterminantsProvider>
      <AttendanceDeterminantsTabContent />
    </AttendanceDeterminantsProvider>
  );
}
