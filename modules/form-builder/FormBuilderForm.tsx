"use client";
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/modules/table/components/ui/sheet";
import { Button } from '@/modules/table/components/ui/button';
import { Menu } from 'lucide-react';
import FormBuilder from './FormBuilder';
import { contactFormConfig } from './configs/contactFormConfig';
import { useToast } from "@/modules/table/hooks//use-toast";

interface FormBuilderFormProps {
  onFormSubmit: (values: Record<string, any>) => void;
}

const FormBuilderForm: React.FC<FormBuilderFormProps> = ({ onFormSubmit }) => {
  const [sheetOpen, setSheetOpen] = useState(true);
  const { toast } = useToast();

  // Function to handle validation errors - keeps the form open and displays toast
  const handleValidationError = (errors: Record<string, string>) => {
    console.log('Validation errors in page:', errors);

    // Keep the sheet open when there are validation errors
    setSheetOpen(true);

    // Don't show a toast here - we'll let FormBuilder handle it
  };

  // Function to handle form submission data
  const handleFormSubmission = (values: Record<string, any>) => {
    onFormSubmit(values);
    // Close the sheet after successful submission
    setSheetOpen(false);

    // Show a success toast
    toast({
      title: "Form Submitted",
      description: "Your form has been successfully submitted.",
      variant: "default",
    });
  };

  // Example of Laravel validation format
  const simulateLaravelValidation = (values: Record<string, any>) => {
    const errors: Record<string, string[]> = {};

    // Simulate Laravel validation rules
    if (!values.name || values.name.length < 2) {
      errors.name = ["The name field is required and must be at least 2 characters."];
    }

    if (!values.email) {
      errors.email = ["The email field is required."];
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = ["The email must be a valid email address."];
    }

    if (values.phone && !/^[0-9\-\+\s\(\)]+$/.test(values.phone)) {
      errors.phone = ["The phone number format is invalid."];
    }

    if (!values.subject) {
      errors.subject = ["Please select a subject."];
    }

    if (!values.message || values.message.length < 10) {
      errors.message = ["The message must be at least 10 characters."];
    }

    return Object.keys(errors).length > 0 ? { errors, success: false } : { success: true };
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Menu className="h-4 w-4" />
          Open Form
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full sm:max-w-md max-h-[98vh] overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          // Prevent closing the sheet when interacting with dropdown components
          if (e.target &&
              ((e.target as HTMLElement).closest('[data-radix-popper-content-wrapper]') ||
               (e.target as HTMLElement).closest('[role="combobox"]') ||
               (e.target as HTMLElement).closest('[role="listbox"]') ||
               (e.target as HTMLElement).closest('[role="option"]') ||
               (e.target as HTMLElement).closest('[data-dropdown-id]') ||
               (e.target as HTMLElement).closest('.cmdp-popover'))) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader className="mb-6">
          <SheetTitle>Contact Form with Laravel Validation</SheetTitle>
          <SheetDescription>
            Fill out the form to see Laravel-style validation
          </SheetDescription>
        </SheetHeader>

        {/* Add the form inside the slide menu with an isolated stacking context */}
        <div className="pr-6 relative">
          <FormBuilder
            config={{
              ...contactFormConfig,
              onSubmit: async (values) => {
                console.log('Form submitted with values:', values);

                // Simulate a Laravel validation response
                const validationResult = simulateLaravelValidation(values);

                if (!validationResult.success) {
                  console.log('Laravel validation failed:', validationResult.errors);
                  return validationResult;
                }

                // If validation passes, handle successful submission
                handleFormSubmission(values);
                return { success: true };
              },
              onValidationError: handleValidationError
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FormBuilderForm;
