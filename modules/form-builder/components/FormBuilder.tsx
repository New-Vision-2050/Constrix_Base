"use client";

import React, { useState, useCallback, useEffect } from "react";
import ExpandableFormSection from "./ExpandableFormSection";
import { Button } from "@/components/ui/button";
import { FormConfig } from "../types/formTypes";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { apiClient } from "@/config/axios-config";
import { useFormStore } from "@/modules/form-builder";
import { useTranslations } from "next-intl";

interface FormBuilderProps {
  config: FormConfig;
  values: Record<string, any>;
  errors: Record<string, string | React.ReactNode>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  handleSubmit: (e: React.FormEvent) => void;
  handleCancel: () => void;
  resetForm: () => void;
  setValue: (field: string, value: any) => void;
  setValues?: (values: Record<string, any>) => void;
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
  isLoadingEditData?: boolean;
  editError?: string | null;
  recordId?: string | number;
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
  setValues,
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
  isLoadingEditData: initialIsLoadingEditData,
  editError: initialEditError,
  recordId,
}) => {
  // Local state for edit mode
  const t = useTranslations();
  const [isEditMode] = useState(config.isEditMode || false);
  const [isLoadingEditData, setIsLoadingEditData] = useState(
    initialIsLoadingEditData || false
  );
  const [editError, setEditError] = useState<string | null>(
    initialEditError || null
  );

  // Function to load data for editing
  const loadEditData = useCallback(
    async (id?: string | number) => {
      // Use provided id or fallback to recordId from props
      const targetId = id || recordId;

      // If no ID is provided, we can't load data
      if (!targetId) {
        //setEditError("No record ID provided for editing");
        return;
      }

      // If editValues are directly provided in the config, use those
      if (config.editValues) {
        if (setValues) {
          setValues(config.editValues);
        } else {
          useFormStore
            .getState()
            .setValues(config.formId || "", config.editValues);
        }
        return;
      }

      // If no editApiUrl is provided, we can't load data
      if (!config.editApiUrl) {
        setEditError("No API URL configured for editing");
        return;
      }

      try {
        setIsLoadingEditData(true);
        setEditError(null);

        // Replace :id placeholder in URL if present
        const url = config.editApiUrl.replace(":id", String(targetId));

        // Make the API request
        const response = await apiClient.get(url, {
          headers: config.editApiHeaders,
        });

        // Extract data from response
        let data = response.data;

        // If a data path is specified, extract the data from that path
        if (config.editDataPath) {
          const paths = config.editDataPath.split(".");
          for (const path of paths) {
            data = data[path];
            if (data === undefined) {
              throw new Error(
                `Data path '${config.editDataPath}' not found in response`
              );
            }
          }
        } else {
          data = data.payload;
        }

        // If a data transformer is provided, transform the data
        if (config.editDataTransformer) {
          data = config.editDataTransformer(data);
        }

        // Set the form values
        if (setValues) {
          setValues(data);
        } else {
          useFormStore.getState().setValues(config.formId || "", data);
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load data";
        setEditError(errorMessage);
      } finally {
        setIsLoadingEditData(false);
      }
    },
    [config, recordId, setValue, setValues]
  );

  // Load edit data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      setValue("id", recordId);
      loadEditData();
    }
  }, [isEditMode]);
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

      {/* Loading state for edit mode */}
      {isLoadingEditData && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <span className="ml-2 text-lg">{t("Main.Loading")}</span>
        </div>
      )}

      {/* Error state for edit mode */}
      {editError && (
        <div className="text-destructive border border-destructive/20 p-4 rounded mb-4">
          <h3 className="font-medium text-lg mb-1">Error Loading Data</h3>
          <p>{editError}</p>
        </div>
      )}

      <div
        className={`max-h-[calc(80vh-120px)] overflow-y-auto pr-2
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
          ${isLoadingEditData ? "hidden" : ""}
          ${config?.wrapperClassName ? config?.wrapperClassName : ""}
          
          `}
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
            clearFiledError={clearFiledError}
            formId={config.formId}
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
              formId={config.formId}
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
              clearFiledError={clearFiledError}
              formId={config.formId}
              subWrapperClassName={config?.subWrapperClassName}
              subWrapperParentClassName={config?.subWrapperParentClassName}
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
        {/* {submitSuccess && (
          <div className="text-green-600 border border-green-200 p-2 rounded">
            <span className="font-medium">Success: </span>Form submitted
            successfully!
          </div>
        )} */}
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
          <div className="flex items-center space-x-2 w-full">
            {!isFirstStep && config.showBackButton !== false && (
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevStep();
                }}
                disabled={isSubmitting}
                className="flex items-center grow"
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
                className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 grow"
              >
                {isSubmittingStep ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    جاري الحفظ
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
                className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 grow"
              >
                {config.wizardOptions?.nextButtonText || "Next"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}

            {isLastStep && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 grow"
                onClick={(e) => e.stopPropagation()}
              >
                {isSubmitting && config.showSubmitLoader ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    جاري الحفظ
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
            disabled={isSubmitting || config.disableSubmitButton}
            className="bg-primary text-primary-foreground hover:bg-primary/90 grow"
            onClick={(e) => e.stopPropagation()}
          >
            {isSubmitting && config.showSubmitLoader ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                جاري الحفظ
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
