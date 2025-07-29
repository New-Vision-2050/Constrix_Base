import React, { useState, useEffect, useRef } from "react";
import {
  DeterminantDetails,
  AttendanceDeterminantsContent as ContentComponent,
} from "./components";
import TabHeader from "./components/TabHeader";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getDynamicDeterminantFormConfig } from "./components/CreateDeterminant/CreateDeterminantFormConfig";
import {
  useAttendanceDeterminants,
  AttendanceDeterminantsProvider,
} from "./context/AttendanceDeterminantsContext";
import { AlertCircle, Loader2 } from "lucide-react";
import { DeterminantSkeletonGrid } from "./components/DeterminantSkeleton";
import { useTranslations } from "next-intl";

// Container component that uses the context
function AttendanceDeterminantsTabContent() {
  // Using translation function
  const t = useTranslations("HRSettingsAttendanceDepartureModule.attendanceDeterminants");
  
  // State to control the determinant being edited
  const [editingConstraint, setEditingConstraint] = useState<any>(null);
  // State to control form opening
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Using context to access states and functions
  const {
    constraintsData,
    activeConstraint,
    constraintsLoading,
    constraintsError,
    handleConstraintClick,
    branchesData,
    refetchConstraints
  } = useAttendanceDeterminants();
  
  // Function to handle editing a determinant
  const handleEditConstraint = (constraint: any) => {
    console.log('Editing determinant:', constraint);
    setEditingConstraint(constraint);
    setIsFormOpen(true);
  };
  
  // Function to handle form closure
  const handleCloseForm = () => {
    setIsFormOpen(false);
    // Keep a small delay before clearing state to avoid rendering issues
    setTimeout(() => setEditingConstraint(null), 300);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[20%_80%] gap-2 md:gap-6 min-h-[calc(100vh-180px)] p-4">
      {constraintsLoading ? (
        <DeterminantSkeletonGrid count={6} />
      ) : constraintsError ? (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <AlertCircle className="text-red-500" />
          <p className="ml-2 text-red-500">{t('error.loading')}</p>
          <p className="ml-2 text-red-500">{t('error.tryAgain')}</p>
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
            <TabHeader title="" />
            {!Boolean(activeConstraint) ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {constraintsData?.map((determinant) => (
                    <div
                      key={determinant.id}
                      className="cursor-pointer transition-transform hover:scale-[1.02] min-[390px]"
                    >
                      <DeterminantDetails 
                        constraint={determinant} 
                        onEdit={handleEditConstraint}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              activeConstraint && (
                <DeterminantDetails 
                  constraint={activeConstraint} 
                  onEdit={handleEditConstraint}
                />
              )
            )}
          </div>
        </>
      )}
      
      {/* Form for editing determinants */}
      {editingConstraint && (
        <SheetFormBuilder
          config={getDynamicDeterminantFormConfig({ 
            refetchConstraints, 
            branchesData,
            t,
            editConstraint: editingConstraint
          })}
          isOpen={isFormOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseForm();
          }}
          recordId={editingConstraint.id}
          onSuccess={() => {
            handleCloseForm();
            refetchConstraints();
          }}
          onCancel={handleCloseForm}
        />
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
