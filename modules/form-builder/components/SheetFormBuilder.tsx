"use client";

import React from "react";
import { useLocale } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FormConfig } from "../types/formTypes";
import { useSheetForm } from "../hooks/useSheetForm";
import FormBuilder from "./FormBuilder";

interface SheetFormBuilderProps {
  config: FormConfig;
  trigger?: React.ReactNode;
  onSuccess?: (values: Record<string, any>) => void;
  onCancel?: () => void;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  recordId?: string | number; // Optional record ID for editing
  isOpen?: boolean; // Control the open state externally
  onOpenChange?: (open: boolean) => void; // Callback when open state changes
}

const SheetFormBuilder: React.FC<SheetFormBuilderProps> = ({
  config,
  trigger,
  onSuccess,
  onCancel,
  side,
  className,
  recordId,
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const sheetSide = side || (isRtl ? "left" : "right");

  // Use the hook with recordId for edit mode
  const {
    isOpen: hookIsOpen,
    openSheet,
    closeSheet,
    values,
    errors,
    touched,
    isSubmitting,
    submitSuccess,
    submitError,
    setValue,
    setTouched,
    handleSubmit,
    handleCancel,
    resetForm,
    isWizard,
    isAccordion,
    isStepBased,
    currentStep,
    totalSteps,
    goToNextStep,
    goToPrevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    submitCurrentStep,
    isSubmittingStep,
    stepResponses,
    getStepResponseData,
    clearFiledError,
    isEditMode,
    isLoadingEditData,
    editError,
    loadEditData,
  } = useSheetForm({
    config,
    recordId,
    onSuccess,
    onCancel,
  });

  // Determine if the sheet is open (controlled or uncontrolled)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : hookIsOpen;

  // Handle open state changes
  const handleOpenChange = (open: boolean) => {    
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      if (open) {
        openSheet();
      } else {
        closeSheet();
      }
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      {trigger && (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      )}
      <SheetContent
        side={sheetSide}
        className={`h-fit max-h-[100vh] overflow-visible ${className || ""}`}
        onInteractOutside={(e) => {
          if (
            e.target &&
            ((e.target as HTMLElement).closest('[role="option"]') ||
              (e.target as HTMLElement).closest("[data-dropdown-id]") ||
              (e.target as HTMLElement).closest(".cmdp-popover"))
          ) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader>
          {config.title && <SheetTitle>{config.title}</SheetTitle>}
          {config.description && (
            <SheetDescription>{config.description}</SheetDescription>
          )}
        </SheetHeader>

        <FormBuilder
          config={config}
          values={values}
          errors={errors}
          touched={touched}
          isSubmitting={isSubmitting}
          submitSuccess={submitSuccess}
          submitError={submitError}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          resetForm={resetForm}
          setValue={setValue}
          setTouched={setTouched}
          isWizard={isWizard}
          isAccordion={isAccordion}
          isStepBased={isStepBased}
          currentStep={currentStep}
          totalSteps={totalSteps}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
          goToStep={goToStep}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          submitCurrentStep={submitCurrentStep}
          isSubmittingStep={isSubmittingStep}
          stepResponses={stepResponses}
          getStepResponseData={getStepResponseData}
          clearFiledError={clearFiledError}
          // Edit mode props
          isEditMode={isEditMode}
          isLoadingEditData={isLoadingEditData}
          editError={editError}
        />

        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
};

export default SheetFormBuilder;
