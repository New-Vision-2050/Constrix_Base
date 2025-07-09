import React from "react";
import { AttendanceDeterminantsContent as ContentComponent, DeterminantDetails } from "./components";
import TabHeader from "./components/TabHeader";
import { AttendanceDeterminantsProvider, useAttendanceDeterminants } from "./context/AttendanceDeterminantsContext";

// Componente contenedor que usa el contexto
function AttendanceDeterminantsTabContent() {
    // Usar el contexto para acceder a los estados y funciones
    const { 
        determinants, 
        activeDeterminant, 
        showAllDeterminants, 
        handleDeterminantClick 
    } = useAttendanceDeterminants();

    return (
        <div className="grid grid-cols-1 md:grid-cols-[20%_80%] gap-2 md:gap-6 min-h-[calc(100vh-180px)] p-4">
            {/* Sidebar with determinants list */}
            <div className="px-2">
                <ContentComponent 
                    determinants={determinants} 
                    onDeterminantClick={handleDeterminantClick}
                />
            </div>
            
            {/* Main content area */}
            <div className="px-4 py-2">
                <TabHeader/>
                {showAllDeterminants ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {determinants.map(determinant => (
                                determinant.details && (
                                    <div 
                                        key={determinant.id}
                                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                                        onClick={() => handleDeterminantClick(determinant.id)}
                                    >
                                        <DeterminantDetails {...determinant.details} />
                                    </div>
                                )
                            ))}
                        </div>
                    </>
                ) : activeDeterminant?.details && (
                    <DeterminantDetails {...activeDeterminant.details} />
                )}
            </div>
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