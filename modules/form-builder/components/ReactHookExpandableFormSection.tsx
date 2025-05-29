"use client";

import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormSection } from "../types/formTypes";
import ReactHookFormField from "./ReactHookFormField";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ReactHookExpandableFormSectionProps {
  section: FormSection;
  form: UseFormReturn<any>;
  values: Record<string, any>;
  errors: Record<string, any>;
  touched: Record<string, boolean>;
  defaultOpen?: boolean;
  onChange: (field: string, value: any) => void;
  onBlur: (field: string) => void;
  collapsible?: boolean;
  forceDisabled?: boolean;
  stepResponses?: Record<number, { success: boolean; message?: string; data?: Record<string, any> }>;
  getStepResponseData?: (step: number, key?: string) => any;
  currentStep?: number;
  onToggle?: (isOpen: boolean) => void;
  clearFiledError: (field: string) => void;
  onDeletedFilesChange?: (field: string, deletedFiles: Array<string | any>) => void;
}

const ReactHookExpandableFormSection: React.FC<ReactHookExpandableFormSectionProps> = ({
  section,
  form,
  values,
  errors,
  touched,
  defaultOpen = false,
  onChange,
  onBlur,
  collapsible = true,
  forceDisabled = false,
  stepResponses,
  getStepResponseData,
  currentStep,
  onToggle,
  clearFiledError,
  onDeletedFilesChange,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Update isOpen when defaultOpen changes
  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  // Check if section should be rendered based on condition
  if (section.condition && !section.condition(values)) {
    return null;
  }

  // If not collapsible, render fields directly
  if (!collapsible) {
    return (
      <div className="mb-6">
        {section.title && (
          <h3 className="text-lg font-medium mb-4">{section.title}</h3>
        )}
        {section.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {section.description}
          </p>
        )}
        <div
          className={`grid gap-4 ${
            section.columns
              ? `grid-cols-1 sm:grid-cols-${Math.min(section.columns, 2)} md:grid-cols-${
                  section.columns
                }`
              : "grid-cols-1"
          } ${section.className || ""}`}
        >
          {section.fields.map((field) => (
            <ReactHookFormField
              key={field.name}
              field={field}
              form={form}
              value={values[field.name]}
              error={errors[field.name]?.message}
              touched={touched[field.name]}
              onChange={onChange}
              onBlur={onBlur}
              values={values}
              disabled={forceDisabled || field.disabled}
              stepResponses={stepResponses}
              getStepResponseData={getStepResponseData}
              currentStep={currentStep}
              clearFiledError={clearFiledError}
              onDeletedFilesChange={onDeletedFilesChange}
            />
          ))}
        </div>
      </div>
    );
  }

  // Render collapsible section
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (onToggle) {
          onToggle(open);
        }
      }}
      className="mb-4 border rounded-md overflow-hidden"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left bg-muted/50 hover:bg-muted transition-colors">
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
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <div
          className={`grid gap-4 ${
            section.columns
              ? `grid-cols-1 sm:grid-cols-${Math.min(section.columns, 2)} md:grid-cols-${
                  section.columns
                }`
              : "grid-cols-1"
          } ${section.className || ""}`}
        >
          {section.fields.map((field) => (
            <ReactHookFormField
              key={field.name}
              field={field}
              form={form}
              value={values[field.name]}
              error={errors[field.name]?.message}
              touched={touched[field.name]}
              onChange={onChange}
              onBlur={onBlur}
              values={values}
              disabled={forceDisabled || field.disabled}
              stepResponses={stepResponses}
              getStepResponseData={getStepResponseData}
              currentStep={currentStep}
              clearFiledError={clearFiledError}
              onDeletedFilesChange={onDeletedFilesChange}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ReactHookExpandableFormSection;
