'use client';

import React from 'react';
import FormBuilderShared from '@/modules/form-builder/FormBuilderShared';
import { contactFormConfigShared } from '@/modules/form-builder/configs/contactFormConfigShared';
import { useTranslations } from 'next-intl';

export default function FormExamplePage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Form Example with Shared Components</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <FormBuilderShared 
          config={contactFormConfigShared} 
          onSuccess={(values) => {
            console.log('Form submitted successfully:', values);
            alert('Form submitted successfully!');
          }}
        />
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About This Example</h2>
        <p className="mb-2">
          This example demonstrates the use of shared dropdown components between the table and form modules.
        </p>
        <p className="mb-2">
          The form validates all fields across all sections before submission, not just the visible ones.
        </p>
        <p>
          Try submitting the form without filling in required fields to see validation in action.
        </p>
      </div>
    </div>
  );
}