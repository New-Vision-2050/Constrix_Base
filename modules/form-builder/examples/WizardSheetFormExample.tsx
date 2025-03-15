"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import SheetFormBuilder from '../components/SheetFormBuilder';
import { wizardSheetFormConfig } from '../configs/wizardSheetFormConfig';

const WizardSheetFormExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formResult, setFormResult] = useState<any>(null);

  // Handle form submission success
  const handleSuccess = (values: Record<string, any>) => {
    console.log('Form submitted successfully:', values);
    setFormResult({
      success: true,
      values,
      timestamp: new Date().toISOString()
    });
    setIsOpen(false);
  };

  // Handle form cancellation
  const handleCancel = () => {
    console.log('Form cancelled');
    setIsOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Multi-Section Wizard Form Example</h1>
      <p className="mb-6 text-gray-600">
        This example demonstrates a wizard form with multiple sections per step.
        Each step contains multiple sections of related fields, and each step is
        submitted to a different API endpoint.
      </p>

      {/* Form trigger button */}
      <SheetFormBuilder
        config={{
          ...wizardSheetFormConfig,
          // Override the default handlers to use our local state
          onSuccess: handleSuccess,
          onCancel: handleCancel
        }}
        trigger={
          <Button 
            onClick={() => setIsOpen(true)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Open Multi-Section Wizard Form
          </Button>
        }
      />

      {/* Display form result if available */}
      {formResult && (
        <div className="mt-8 p-4 border rounded-md bg-green-50 border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Form Submitted Successfully</h2>
          <p className="text-sm text-gray-600 mb-2">Submitted at: {formResult.timestamp}</p>
          
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Form Values:</h3>
            <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-96">
              {JSON.stringify(formResult.values, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Form structure explanation */}
      <div className="mt-8 p-4 border rounded-md bg-blue-50 border-blue-200">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Form Structure</h2>
        <p className="mb-4 text-gray-700">
          This wizard form consists of 3 steps, each containing multiple sections:
        </p>

        <div className="space-y-4">
          <div className="p-3 bg-white rounded border">
            <h3 className="font-medium text-blue-700">Step 1: Location Information</h3>
            <ul className="list-disc ml-6 mt-2 text-sm">
              <li>Section 1: Address Information (Country, City, Postal Code, Street)</li>
              <li>Section 2: Additional Location Details (Building Type, Floor, Apartment, Notes)</li>
            </ul>
          </div>

          <div className="p-3 bg-white rounded border">
            <h3 className="font-medium text-blue-700">Step 2: Personal Information</h3>
            <ul className="list-disc ml-6 mt-2 text-sm">
              <li>Section 1: Basic Information (First Name, Last Name, Email, Phone)</li>
              <li>Section 2: Additional Personal Details (Date of Birth, Gender, Nationality, Language)</li>
            </ul>
          </div>

          <div className="p-3 bg-white rounded border">
            <h3 className="font-medium text-blue-700">Step 3: Company Information</h3>
            <ul className="list-disc ml-6 mt-2 text-sm">
              <li>Section 1: Company Details (Company Name, Registration Number, Type, Industry)</li>
              <li>Section 2: Company Contact Information (Email, Phone, Website, Employees)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Configuration Explanation */}
      <div className="mt-8 p-4 border rounded-md bg-purple-50 border-purple-200">
        <h2 className="text-xl font-semibold text-purple-800 mb-2">API Configuration</h2>
        <p className="mb-4 text-gray-700">
          Each step in this wizard form submits to a different API endpoint with custom headers:
        </p>

        <div className="space-y-4">
          <div className="p-3 bg-white rounded border">
            <h3 className="font-medium text-purple-700">Step 1: Location API</h3>
            <p className="text-sm text-gray-600 mt-1">Endpoint: <code>https://core-be-pr16.constrix-nv.com/api/v1/locations</code></p>
            <p className="text-sm text-gray-600">Headers: <code>X-Location-API-Key</code></p>
          </div>

          <div className="p-3 bg-white rounded border">
            <h3 className="font-medium text-purple-700">Step 2: Users API</h3>
            <p className="text-sm text-gray-600 mt-1">Endpoint: <code>https://core-be-pr16.constrix-nv.com/api/v1/users</code></p>
            <p className="text-sm text-gray-600">Headers: <code>X-User-API-Key</code></p>
          </div>

          <div className="p-3 bg-white rounded border">
            <h3 className="font-medium text-purple-700">Step 3: Companies API</h3>
            <p className="text-sm text-gray-600 mt-1">Endpoint: <code>https://core-be-pr16.constrix-nv.com/api/v1/companies</code></p>
            <p className="text-sm text-gray-600">Headers: <code>X-Company-API-Key</code></p>
          </div>

          <div className="p-3 bg-white rounded border">
            <h3 className="font-medium text-purple-700">Final Submission</h3>
            <p className="text-sm text-gray-600 mt-1">Endpoint: <code>https://core-be-pr16.constrix-nv.com/api/v1/submissions</code></p>
            <p className="text-sm text-gray-600">Headers: <code>X-API-Key</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardSheetFormExample;