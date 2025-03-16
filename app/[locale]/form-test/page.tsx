'use client';

import React from 'react';
import ApiValidationExample from '@/modules/form-builder/test/ApiValidationExample';

/**
 * Form Test Page
 * 
 * This page demonstrates the form builder with API validation feature
 */
export default function FormTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Form Builder Test</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ApiValidationExample />
      </div>
      
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About API Validation</h2>
        <p className="mb-4">
          This example demonstrates the form builder&apos;s API validation feature with debounce.
          The validation happens after the user stops typing, preventing unnecessary API calls.
        </p>
        <h3 className="text-lg font-medium mt-6 mb-2">How it works:</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Type in the username or email field</li>
          <li>The validation will trigger after the debounce period (500ms for username, 800ms for email)</li>
          <li>A loading indicator will show while validation is in progress</li>
          <li>If validation fails, an error message will be displayed</li>
        </ol>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This example uses mock API endpoints. In a real application, 
            you would connect to your actual API endpoints for validation.
          </p>
        </div>
      </div>
    </div>
  );
}