"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { FormSection } from "../types/formTypes";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

interface ExpandableFormSectionProps {
  section: FormSection;
  values: Record<string, any>;
  errors: Record<string, string | React.ReactNode>;
  touched: Record<string, boolean>;
  defaultOpen?: boolean;
  collapsible?: boolean;
  onChange?: (field: string, value: any) => void;
  onBlur?: (field: string) => void;
  stepResponses?: Record<
    number,
    { success: boolean; message?: string; data?: Record<string, any> }
  >;
  getStepResponseData?: (step: number, key?: string) => any;
  currentStep?: number;
  onToggle?: (isOpen: boolean) => void; // Callback when section is toggled
  forceDisabled?: boolean; // Force disable the collapsible trigger
  clearFiledError?: (field: string) => void; // Function to clear field errors
  formId: string|undefined;
}

const ExpandableFormSection: React.FC<ExpandableFormSectionProps> = ({
  section,
  values,
  errors,
  touched,
  defaultOpen = false,
  onChange,
  onBlur,
  collapsible = true,
  stepResponses,
  getStepResponseData,
  currentStep,
  onToggle,
  forceDisabled = false,
  clearFiledError,
    formId
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Force close if forceDisabled is true (not the active step)
  // Force open if not forceDisabled (is the active step)
  useEffect(() => {
    if (forceDisabled && isOpen) {
      setIsOpen(false);
    } else if (!forceDisabled && !isOpen) {
      setIsOpen(true);
    }
  }, [forceDisabled, isOpen]);

  // Check if section has any errors
  const hasErrors = section.fields.some(field => errors[field.name] && touched[field.name]);

  // Check if section is completed (all required fields filled and no errors)
  const isCompleted = useMemo(() => {
    // If there are errors, the section is not completed
    if (hasErrors) return false;

    // Check if all required fields have values
    const allRequiredFieldsFilled = section.fields.every((field) => {
      // Skip fields that don't meet their condition
      if (field.condition && !field.condition(values)) {
        return true;
      }

      // Skip fields that are hidden or disabled
      if (field.hidden || field.disabled) {
        return true;
      }

      // Check if required field has a value
      if (field.required) {
        const value = values[field.name];
        return value !== undefined && value !== null && value !== "";
      }

      // Non-required fields are considered filled
      return true;
    });

    return allRequiredFieldsFilled;
  }, [section.fields, values, hasErrors, errors, touched]);

  // Check if section should be rendered based on condition
  if (section.condition && !section.condition(values)) {
    return null;
  }

  if (!collapsible || !section.title) {
    return (
      <div className="w-full border rounded-md mb-4 border-border">
        {section.title && (
          <div className="p-4 bg-muted/50">
            <div className="flex items-center">
              {hasErrors && (
                <div className="w-2 h-2 bg-destructive rounded-full mr-2" />
              )}
              {isCompleted && !hasErrors && (
                <div className="mr-2 text-green-500">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <div>
                {section.title && (
                  <h3 className="text-lg font-medium">{section.title}</h3>
                )}
                {section.description && (
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="p-4 bg-background">
          <div
            style={{
              gridTemplateColumns: section.columns
                ? `repeat(${section.columns}, minmax(0, 1fr))`
                : "1fr",
            }}
            className={`grid gap-4 ${
              section.columns ? `grid-cols-${section.columns}` : "grid-cols-1"
            }`}
          >
            {section.fields.map((field) => {
              // Check field condition if provided
              if (field.condition && !field.condition(values)) {
                return null;
              }

              return (
                <FormField
                  formId={formId}
                  key={field.name}
                  field={field}
                  value={values[field.name]}
                  error={errors[field.name]}
                  touched={touched[field.name]}
                  onChange={(filed, value) => {
                    onChange?.(filed, value);
                    clearFiledError?.(field.name);
                  }}
                  onBlur={onBlur}
                  values={values}
                  stepResponses={stepResponses}
                  getStepResponseData={getStepResponseData}
                  currentStep={currentStep}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (onToggle) {
          onToggle(open);
        }
      }}
      className={cn(
        "w-full border rounded-md mb-4 overflow-hidden",
        hasErrors ? "border-destructive" : "border-border"
      )}
    >
      <CollapsibleTrigger
        className={cn(
          "flex items-center justify-between w-full p-4 text-left bg-muted/50",
          forceDisabled ? "cursor-not-allowed opacity-70" : "hover:bg-muted"
        )}
        disabled={forceDisabled}
      >
        <div className="flex items-center">
          {hasErrors && (
            <div className="w-2 h-2 bg-destructive rounded-full mr-2" />
          )}
          {isCompleted && !hasErrors && (
            <div className="mr-2 text-green-500">
              <Check className="h-4 w-4" />
            </div>
          )}
          <div>
            {section.title && (
              <h3 className="text-lg font-medium">{section.title}</h3>
            )}
            {section.description && (
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {isOpen ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 bg-background">
        <div
          style={{
            gridTemplateColumns: section.columns
              ? `repeat(${section.columns}, minmax(0, 1fr))`
              : "1fr",
          }}
          className={`grid gap-4 ${
            section.columns ? `grid-cols-${section.columns}` : "grid-cols-1"
          }`}
        >
          {section.fields.map((field) => {
            // Check field condition if provided
            if (field.condition && !field.condition(values)) {
              return null;
            }

            return (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name]}
                error={errors[field.name]}
                touched={touched[field.name]}
                onChange={(filed, value) => {
                  onChange?.(filed, value);
                  clearFiledError?.(field.name);
                }}
                onBlur={onBlur}
                values={values}
                stepResponses={stepResponses}
                getStepResponseData={getStepResponseData}
                currentStep={currentStep}
                formId={formId}
              />
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ExpandableFormSection;
