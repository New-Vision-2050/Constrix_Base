"use client";

import React from 'react';
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
import { Loader2 } from 'lucide-react';

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
  side = 'right',
  className,
}) => {
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
      <SheetContent side={side} className={className} onInteractOutside={(e) => {
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
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
            {/* Render form sections */}
            {config.sections.map((section, index) => (
              <ExpandableFormSection
                key={index}
                section={section}
                values={values}
                errors={errors}
                touched={touched}
                defaultOpen={index === 0} // Open first section by default
                onChange={(field, value) => setValue(field, value)}
                onBlur={(field) => setTouched(field, true)}
              />
            ))}
          </div>
          
          {/* Form submission error */}
          {submitError && (
            <div className="bg-destructive/10 text-destructive p-3 rounded mb-4">
              {submitError}
            </div>
          )}
          
          {/* Form submission success */}
          {submitSuccess && (
            <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
              Form submitted successfully!
            </div>
          )}
          
          <SheetFooter>
            {config.cancelButtonText && (
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
            
            {config.showReset && (
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
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default SheetFormBuilder;