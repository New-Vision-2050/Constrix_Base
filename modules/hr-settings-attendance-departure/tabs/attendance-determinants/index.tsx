"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { Pagination } from "../../../../components/shared/Pagination";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

// Container component that uses the context
function AttendanceDeterminantsTabContent() {
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants",
  );
  const formTranslations = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form",
  );
  const dialogTranslations = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog",
  );

  const [editingConstraint, setEditingConstraint] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Using context to access states and functions
  const {
    constraintsData,
    activeConstraint,
    constraintsLoading,
    constraintsError,
    handleConstraintClick,
    branchesData,
    refetchConstraints,
    refetchConstraintsList,
    handleLimitChange,
    handlePageChange,
    page,
    limit,
    // constraints list
    constraintsList,
    constraintsListLoading,
    constraintsListError,
    refetchConstraintsList,
    handleNewDeterminantCreated,
  } = useAttendanceDeterminants();

  // Function to handle editing a determinant
  const handleEditConstraint = (constraint: any) => {
    setEditingConstraint(constraint);
    setIsFormOpen(true);
  };

  // Function to handle form closure
  const handleCloseForm = () => {
    setIsFormOpen(false);
    // Keep a small delay before clearing state to avoid rendering issues
    setTimeout(() => setEditingConstraint(null), 300);
  };

  // Get form config - this needs to be called unconditionally to maintain hooks order
  const formConfig = getDynamicDeterminantFormConfig({
    refetchConstraints,
    refetchConstraintsList,
    onNewDeterminantCreated: handleNewDeterminantCreated,
    branchesData,
    t,
    editConstraint: editingConstraint,
    attendanceDaysDialogTranslations: dialogTranslations,
    formTranslationsFn: (key: string) => formTranslations(key),
  });

  return (
    <Can check={[PERMISSIONS.attendance.settings.view]}>
      <div className="grid grid-cols-1 md:grid-cols-[20%_80%] gap-2 md:gap-6 min-h-[calc(100vh-180px)]">
        {constraintsLoading ? (
          <DeterminantSkeletonGrid count={6} />
        ) : constraintsError ? (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <AlertCircle className="text-red-500" />
            <p className="ml-2 text-red-500">{t("error.loading")}</p>
            <p className="ml-2 text-red-500">{t("error.tryAgain")}</p>
          </div>
        ) : (
          <>
            {/* Sidebar with determinants list */}
            <ContentComponent
              determinants={constraintsData ?? []}
              onDeterminantClick={handleConstraintClick}
            />

            {/* Main content area */}
            <div className="px-4 py-2">
              <TabHeader title="" />
              {constraintsListLoading ? (
                <DeterminantSkeletonGrid count={2} />
              ) : constraintsListError ? (
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <AlertCircle className="text-red-500" />
                  <p className="ml-2 text-red-500">{t("error.loading")}</p>
                  <p className="ml-2 text-red-500">{t("error.tryAgain")}</p>
                </div>
              ) : !Boolean(activeConstraint) ? (
                <>
                  <div className="flex flex-row items-center justify-between flex-wrap">
                    {constraintsList?.payload?.map((determinant) => (
                      <DeterminantDetails
                        key={determinant.id}
                        constraint={determinant}
                        onEdit={handleEditConstraint}
                      />
                    ))}
                  </div>
                  {/* Pagination component */}
                  <div className="mt-8 flex justify-center w-full">
                    <Pagination
                      currentPage={page}
                      totalPages={constraintsList?.pagination?.last_page ?? 1}
                      onPageChange={handlePageChange}
                      currentLimit={limit}
                      limitOptions={[2, 5, 10, 25, 50]}
                      onLimitChange={handleLimitChange}
                    />
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
            config={formConfig}
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
    </Can>
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
