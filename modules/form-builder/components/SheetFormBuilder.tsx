"use client";

import React from 'react';
import { useLocale } from 'next-intl';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FormConfig } from '../types/formTypes';
import { useSheetForm } from '../hooks/useSheetForm';
import ExpandableFormSection from './ExpandableFormSection';
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react';

interface SheetFormBuilderProps {
  config: FormConfig;
  trigger?: React.ReactNode;
  onSuccess?: (values: Record<string, any>) => void;
  onCancel?: () => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const SheetFormBuilder: React.FC<SheetFormBuilderProps> = ({
  config,
  trigger,
  onSuccess,
  onCancel,
  side,
  className,
}) => {
  // Get the current locale and determine direction
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Set the default side based on locale direction if not explicitly provided
  const sheetSide = side || (isRtl ? 'left' : 'right');
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
    setValue,
    setTouched,
    handleSubmit,
    handleCancel,
    resetForm,
    // Wizard related properties and methods
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
    validateCurrentStep,
    // Step submission related properties and methods
    submitCurrentStep,
    isSubmittingStep,
    stepResponses,
    getStepResponseData
  } = useSheetForm({
    config,
    onSuccess,
    onCancel,
  });

  return (
    <Sheet open={isOpen} onOpenChange={(open) => open ? openSheet() : closeSheet()}>
      {trigger ? (
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <Button variant="outline">Open Form</Button>
        </SheetTrigger>
      )}
      <SheetContent
        side={sheetSide}
        className={`h-fit max-h-[100vh] overflow-visible ${className || ''}`}
        onInteractOutside={(e) => {
        // Prevent closing the sheet when interacting with dropdown components
        if (e.target &&
          ((e.target as HTMLElement).closest('[role="option"]') ||
           (e.target as HTMLElement).closest('[data-dropdown-id]') ||
           (e.target as HTMLElement).closest('.cmdp-popover'))) {
          e.preventDefault();
        }
      }}>
        <SheetHeader>
          {config.title && <SheetTitle>{config.title}</SheetTitle>}
          {config.description && <SheetDescription>{config.description}</SheetDescription>}
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 py-6"
          onClick={(e) => e.stopPropagation()} // Prevent click events from bubbling up
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
                        ? 'cursor-pointer'
                        : index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                    onClick={() => {
                      if (config.wizardOptions?.allowStepNavigation || index <= currentStep) {
                        goToStep(index);
                      }
                    }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                        index < currentStep
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-200 text-gray-500'
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
                  style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}


          <div className="max-h-[calc(80vh-120px)] overflow-y-auto pr-2
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
            {/* Render form sections based on mode */}
            {isWizard ? (
              // Wizard mode - only show current step
              <ExpandableFormSection
                key={currentStep}
                section={config.sections[currentStep]}
                values={values}
                errors={errors}
                touched={touched}
                defaultOpen={true}
                onChange={(field, value) => setValue(field, value)}
                onBlur={(field) => setTouched(field, true)}
                collapsible={false} // In wizard mode, sections are not collapsible
                stepResponses={stepResponses}
                getStepResponseData={getStepResponseData}
                currentStep={currentStep}
              />
            ) : isAccordion ? (
              // Accordion mode - render all sections but control which one is open
              config.sections.map((section, index) => (
                <ExpandableFormSection
                  key={index}
                  section={section}
                  values={values}
                  errors={errors}
                  touched={touched}
                  defaultOpen={index === currentStep} // Only open the current step
                  onChange={(field, value) => setValue(field, value)}
                  onBlur={(field) => setTouched(field, true)}
                  collapsible={true} // Always collapsible in accordion mode
                  forceDisabled={index !== currentStep} // Only allow expanding the current step
                  stepResponses={stepResponses}
                  getStepResponseData={getStepResponseData}
                  currentStep={currentStep}
                  onToggle={(isOpen) => {
                    // When a section is opened, make it the current step
                    if (isOpen) {
                      goToStep(index);
                    }
                  }}
                />
              ))
            ) : (
              // Regular mode - render all sections
              config.sections.map((section, index) => (
                <ExpandableFormSection
                  key={index}
                  section={section}
                  values={values}
                  errors={errors}
                  touched={touched}
                  defaultOpen={index === 0} // Open first section by default
                  onChange={(field, value) => setValue(field, value)}
                  onBlur={(field) => setTouched(field, true)}
                  collapsible={section.collapsible}
                />
              ))
            )}
          </div>

          {/* Form submission messages */}
          <div className="mb-4 text-sm">
            {/* Form submission error - more subtle styling */}
            {submitError && (
              <div className="text-destructive border border-destructive/20 p-2 rounded">
                <span className="font-medium">Error: </span>{submitError}
              </div>
            )}

            {/* Form submission success */}
            {submitSuccess && (
              <div className="text-green-600 border border-green-200 p-2 rounded">
                <span className="font-medium">Success: </span>Form submitted successfully!
              </div>
            )}
          </div>

          <SheetFooter
            className={(() => {
              // Check if cancel button will be shown
              const showCancel = config.cancelButtonText && (config.showCancelButton !== false);
              
              // Check if reset button will be shown
              const showReset = config.showReset && (!isStepBased || isFirstStep);
              
              // Check if back button will be shown in step-based forms
              const showBack = isStepBased && !isFirstStep && (config.showBackButton !== false);
              
              // If only one button will be visible (the submit/next/finish button), use center alignment
              return !showCancel && !showReset && !showBack ?
                "flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2" :
                undefined;
            })()}
          >
            {/* Cancel button - show if cancelButtonText is provided and showCancelButton is true (or undefined) */}
            {config.cancelButtonText && (config.showCancelButton !== false) && (
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click events from bubbling up
                  handleCancel();
                }}
                variant="ghost"
                disabled={isSubmitting}
              >
                {config.cancelButtonText}
              </Button>
            )}

            {/* Reset button - only show in non-step-based mode or on first step, and if showReset is true */}
            {config.showReset && (!isStepBased || isFirstStep) && (
              <Button
                type="reset"
                variant="outline"
                disabled={isSubmitting}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click events from bubbling up
                  // Manually reset the form
                  resetForm();
                }}
              >
                {config.resetButtonText || 'Reset'}
              </Button>
            )}

            {/* Wizard/Accordion navigation buttons */}
            {isStepBased && (
              <div className="flex items-center space-x-2">
                {/* Previous button - show if not on first step and showBackButton is true (or undefined) */}
                {!isFirstStep && (config.showBackButton !== false) && (
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
                    {config.wizardOptions?.prevButtonText || 'Previous'}
                  </Button>
                )}

                {/* Submit step button - show when submitEachStep is enabled and not on the last step */}
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
                      config.wizardOptions?.submitButtonTextPerStep || 'Submit Step'
                    )}
                  </Button>
                )}

                {/* Next button - only show if not on last step and not in submitEachStep mode */}
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
                    {config.wizardOptions?.nextButtonText || 'Next'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}

                {/* Submit button - only show on last step in wizard mode */}
                {isLastStep && (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={(e) => e.stopPropagation()} // Prevent click events from bubbling up
                  >
                    {isSubmitting && config.showSubmitLoader ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Submitting...
                      </span>
                    ) : (
                      config.wizardOptions?.finishButtonText || config.submitButtonText || 'Submit'
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Regular submit button - only show in non-step-based mode */}
            {!isStepBased && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={(e) => e.stopPropagation()} // Prevent click events from bubbling up
              >
                {isSubmitting && config.showSubmitLoader ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Submitting...
                  </span>
                ) : (
                  config.submitButtonText || 'Submit'
                )}
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default SheetFormBuilder;
