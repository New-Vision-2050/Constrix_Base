'use client';

import React from 'react';
import { SheetFormBuilder, sheetFormConfig } from '@/modules/form-builder';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function SheetFormExamplePage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Sheet Form Example with Expandable Sections</h1>
      
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Form in Sheet with Expandable Sections</h2>
          <p className="mb-6">
            This example demonstrates a form that opens in a sheet (slide-in panel) with expandable sections.
            Click the button below to open the form.
          </p>
          
          <SheetFormBuilder
            config={sheetFormConfig}
            trigger={<Button>Open Contact Form</Button>}
            onSuccess={(values) => {
              console.log('Form submitted successfully:', values);
              alert('Form submitted successfully!');
            }}
          />
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About This Example</h2>
          <p className="mb-2">
            This example demonstrates a form builder that:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Opens in a sheet (slide-in panel)</li>
            <li>Has multiple expandable sections</li>
            <li>Validates all fields across all sections</li>
            <li>Uses the shared dropdown components</li>
            <li>Prevents closing when interacting with dropdowns</li>
          </ul>
          <p>
            The form is configured using the same structure as the table search configuration,
            making it easy to understand and maintain.
          </p>
        </div>
      </div>
    </div>
  );
}