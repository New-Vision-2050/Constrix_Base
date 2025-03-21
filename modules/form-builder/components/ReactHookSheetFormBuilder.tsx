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
import { useReactHookForm } from "../hooks/useReactHookForm";
import ReactHookFormBuilder from "./ReactHookFormBuilder";

interface ReactHookSheetFormBuilderProps {
  config: FormConfig;
  trigger?: React.ReactNode;
  onSuccess?: (values: Record<string, any>) => void;
  onCancel?: () => void;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

const ReactHookSheetFormBuilder: React.FC<ReactHookSheetFormBuilderProps> = ({
  config,
  trigger,
  onSuccess,
  onCancel,
  side,
  className,
}) => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const sheetSide = side || (isRtl ? "left" : "right");

  const {
    isOpen,
    openSheet,
    closeSheet,
    values,
    errors,
    touched,
    isSubmitting,
    submitSuccess,
    submitError,
    form,
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
  } = useReactHookForm({
    config,
    onSuccess,
    onCancel,
  });

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => (open ? openSheet() : closeSheet())}
    >
      {trigger ? (
        <SheetTrigger asChild>{trigger}</SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <Button variant="outline">Open Form</Button>
        </SheetTrigger>
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

        <ReactHookFormBuilder
          config={config}
          form={form}
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

        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
};

export default ReactHookSheetFormBuilder;