"use client";

import React from "react";
import { useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Adjust import based on your UI library
import { Button } from "@/components/ui/button";
import { FormConfig } from "../types/formTypes";
import { useSheetForm } from "../hooks/useSheetForm"; // Note: might want to rename this hook
import FormBuilder from "./FormBuilder";

interface DialogFormBuilderProps {
  config: FormConfig;
  trigger?: React.ReactNode;
  onSuccess?: (values: Record<string, any>) => void;
  onCancel?: () => void;
  className?: string;
  isOpen?: boolean; // Control the open state externally
  onOpenChange?: (open: boolean) => void; // Callback when open state changes
}

const DialogFormBuilder: React.FC<DialogFormBuilderProps> = ({
  config,
  trigger,
  onSuccess,
  onCancel,
  className,
  isOpen: controlledIsOpen,
  onOpenChange,

}) => {
  const locale = useLocale();
  const isRtl = locale === "ar";

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
  } = useSheetForm({
    config,
    onSuccess,
    onCancel,
  });

    const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
      if (open) {
        openSheet();
      } else {
        closeSheet();
      }

  };

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : hookIsOpen;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline">Open Form</Button>
        </DialogTrigger>
      )}
      <DialogContent
        className={`max-h-[90vh] overflow-visible ${className || ""} ${
          isRtl ? "rtl" : "ltr"
        }`}
        onInteractOutside={(e) => {
          // Prevent closing the dialog when interacting with dropdown components
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
        <DialogHeader>
          {config.title && <DialogTitle>{config.title}</DialogTitle>}
          {config.description && (
            <DialogDescription>{config.description}</DialogDescription>
          )}
        </DialogHeader>

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
        />
      </DialogContent>
    </Dialog>
  );
};

export default DialogFormBuilder;
