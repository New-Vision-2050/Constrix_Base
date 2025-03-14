"use client";

import React from 'react';
import { SheetFormBuilder, searchFormConfig } from '@/modules/form-builder';
import { Button } from '@/components/ui/button';
import { useToast } from '@/modules/table/hooks/use-toast';

export default function SearchFormExample() {
  const { toast } = useToast();

  const handleSuccess = (values: Record<string, any>) => {
    toast({
      title: "Form Submitted",
      description: "Your form has been submitted successfully!",
    });
    console.log("Form values:", values);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Search Form Example</h1>
          <p className="text-muted-foreground mt-2">
            This example demonstrates the use of the search field type in a form.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <SheetFormBuilder
            config={searchFormConfig}
            trigger={<Button>Open Search Form</Button>}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}