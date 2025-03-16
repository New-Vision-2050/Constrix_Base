"use client";

import React from "react";
import ExpandableFormSection from "./ExpandableFormSection";
import { Button } from "@/components/ui/button";
import { FormConfig } from "../types/formTypes";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";

interface FormBuilderProps {
  config: FormConfig;
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  resetForm: () => void;
  setValue: (field: string, value: any) => void;
  setTouched: (field: string, touched: boolean) => void;
  // Wizard/step related props
  isWizard: boolean;
  isAccordion: boolean;
  isStepBased: boolean;
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  submitCurrentStep: () => Promise<boolean>;
  isSubmittingStep: boolean;
  stepResponses: Record<number, any>;
  getStepResponseData: (step: number) => any;
  clearFiledError: (field: string) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  config,
  values,
  errors,
  touched,
  isSubmitting,
  submitSuccess,
  submitError,
  handleSubmit,
  handleCancel,
  resetForm,
  setValue,
  setTouched,
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
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 py-6"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Step indicator for wizard/accordion mode */}
      {isStepBased && config.wizardOptions?.showStepIndicator && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {config.sections.map((section, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  config.wizardOptions?.allowStepNavigation
                    ? "cursor-pointer"
                    : index <= currentStep
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
                onClick={() => {
                  if (
                    config.wizardOptions?.allowStepNavigation ||
                    index <= currentStep
                  ) {
                    goToStep(index);
                  }
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index < currentStep
                      ? "bg-green-500 text-white"
                      : index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                {config.wizardOptions?.showStepTitles && section.title && (
                  <span className="text-xs text-center">{section.title}</span>
                )}
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300"
              style={{
                width: `${(currentStep / (totalSteps - 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      <div
        className="max-h-[calc(80vh-120px)] overflow-y-auto pr-2
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
      >
        {/* Render form sections based on mode */}
        {isWizard ? (
          <ExpandableFormSection
            key={currentStep}
            section={config.sections[currentStep]}
            values={values}
            errors={errors}
            touched={touched}
            defaultOpen={true}
            onChange={(field, value) => setValue(field, value)}
            onBlur={(field) => setTouched(field, true)}
            collapsible={false}
            stepResponses={stepResponses}
            getStepResponseData={getStepResponseData}
            currentStep={currentStep}
          />
        ) : isAccordion ? (
          config.sections.map((section, index) => (
            <ExpandableFormSection
              key={index}
              section={section}
              values={values}
              errors={errors}
              touched={touched}
              defaultOpen={index === currentStep}
              onChange={(field, value) => setValue(field, value)}
              onBlur={(field) => setTouched(field, true)}
              collapsible={true}
              forceDisabled={index !== currentStep}
              stepResponses={stepResponses}
              getStepResponseData={getStepResponseData}
              currentStep={currentStep}
              onToggle={(isOpen) => {
                if (isOpen) {
                  goToStep(index);
                }
              }}
              clearFiledError={clearFiledError}
            />
          ))
        ) : (
          config.sections.map((section, index) => (
            <ExpandableFormSection
              key={index}
              section={section}
              values={values}
              errors={errors}
              touched={touched}
              defaultOpen={index === 0}
              onChange={(field, value) => setValue(field, value)}
              onBlur={(field) => setTouched(field, true)}
              collapsible={section.collapsible}
            />
          ))
        )}
      </div>

      {/* Form submission messages */}
      <div className="mb-4 text-sm">
        {submitError && (
          <div className="text-destructive border border-destructive/20 p-2 rounded">
            <span className="font-medium">Error: </span>
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="text-green-600 border border-green-200 p-2 rounded">
            <span className="font-medium">Success: </span>Form submitted
            successfully!
          </div>
        )}
      </div>

      <div
        className={(() => {
          const showCancel =
            config.cancelButtonText && config.showCancelButton !== false;
          const showReset = config.showReset && (!isStepBased || isFirstStep);
          const showBack =
            isStepBased && !isFirstStep && config.showBackButton !== false;
          return !showCancel && !showReset && !showBack
            ? "flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2"
            : undefined;
        })()}
      >
        {config.cancelButtonText && config.showCancelButton !== false && (
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCancel();
            }}
            variant="ghost"
            disabled={isSubmitting}
          >
            {config.cancelButtonText}
          </Button>
        )}

        {config.showReset && (!isStepBased || isFirstStep) && (
          <Button
            type="reset"
            variant="outline"
            disabled={isSubmitting}
            onClick={(e) => {
              e.stopPropagation();
              resetForm();
            }}
          >
            {config.resetButtonText || "Reset"}
          </Button>
        )}

        {isStepBased && (
          <div className="flex items-center space-x-2">
            {!isFirstStep && config.showBackButton !== false && (
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevStep();
                }}
                disabled={isSubmitting}
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {config.wizardOptions?.prevButtonText || "Previous"}
              </Button>
            )}

            {config.wizardOptions?.submitEachStep && !isLastStep && (
              <Button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  const success = await submitCurrentStep();
                  if (success && !isLastStep) {
                    goToNextStep();
                  }
                }}
                disabled={isSubmitting || isSubmittingStep}
                className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmittingStep ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Submitting...
                  </span>
                ) : (
                  config.wizardOptions?.submitButtonTextPerStep || "Submit Step"
                )}
              </Button>
            )}

            {!isLastStep && !config.wizardOptions?.submitEachStep && (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextStep();
                }}
                disabled={isSubmitting || isSubmittingStep}
                className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {config.wizardOptions?.nextButtonText || "Next"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}

            {isLastStep && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={(e) => e.stopPropagation()}
              >
                {isSubmitting && config.showSubmitLoader ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Submitting...
                  </span>
                ) : (
                  config.wizardOptions?.finishButtonText ||
                  config.submitButtonText ||
                  "Submit"
                )}
              </Button>
            )}
          </div>
        )}

        {!isStepBased && (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={(e) => e.stopPropagation()}
          >
            {isSubmitting && config.showSubmitLoader ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Submitting...
              </span>
            ) : (
              config.submitButtonText || "Submit"
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default FormBuilder;
