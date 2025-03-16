"use client";

import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FormSection } from '../types/formTypes';
import FormField from './FormField';
import { cn } from '@/lib/utils';

interface ExpandableFormSectionProps {
  section: FormSection;
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  defaultOpen?: boolean;
  collapsible?: boolean;
  onChange?: (field: string, value: any) => void;
  onBlur?: (field: string) => void;
  stepResponses?: Record<number, { success: boolean; message?: string; data?: Record<string, any> }>;
  getStepResponseData?: (step: number, key?: string) => any;
  currentStep?: number;
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
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Check if section has any errors
  const hasErrors = section.fields.some(field => errors[field.name] && touched[field.name]);

  // Check if section should be rendered based on condition
  if (section.condition && !section.condition(values)) {
    return null;
  }

  if (!collapsible || !section.title ) {
    return (
      <div className="w-full border rounded-md mb-4 overflow-hidden border-border">
          {section.title && (
        <div className="p-4 bg-muted/50">
          <div className="flex items-center">
            {hasErrors && (
              <div className="w-2 h-2 bg-destructive rounded-full mr-2" />
            )}
            <div>
              {section.title && (
                <h3 className="text-lg font-medium">{section.title}</h3>
              )}
              {section.description && (
                <p className="text-sm text-muted-foreground">{section.description}</p>
              )}
            </div>
          </div>
        </div>)}
        <div className="p-4 bg-background">
          <div className={`grid gap-4 ${section.columns ? `grid-cols-${section.columns}` : 'grid-cols-1'}`}>
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
                  onChange={onChange}
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
      onOpenChange={setIsOpen}
      className={cn(
        "w-full border rounded-md mb-4 overflow-hidden",
        hasErrors ? "border-destructive" : "border-border"
      )}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-muted/50 hover:bg-muted">
        <div className="flex items-center">
          {hasErrors && (
            <div className="w-2 h-2 bg-destructive rounded-full mr-2" />
          )}
          <div>
            {section.title && (
              <h3 className="text-lg font-medium">{section.title}</h3>
            )}
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
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
        <div className={`grid gap-4 ${section.columns ? `grid-cols-${section.columns}` : 'grid-cols-1'}`}>
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
                onChange={onChange}
                onBlur={onBlur}
                values={values}
                stepResponses={stepResponses}
                getStepResponseData={getStepResponseData}
                currentStep={currentStep}
              />
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ExpandableFormSection;
