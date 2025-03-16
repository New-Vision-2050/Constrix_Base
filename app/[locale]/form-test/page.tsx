'use client';

import React from 'react';
import ApiValidationExample from '@/modules/form-builder/test/ApiValidationExample';

/**
 * Form Test Page
 *
 * This page demonstrates the form builder with API validation feature
 * and button visibility options
 */
export default function FormTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Form Builder Test</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ApiValidationExample />
      </div>
      
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Form Builder Features</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Button Visibility Options</h3>
          <p className="mb-4">
            The form builder now supports options to control the visibility of various buttons:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>showCancelButton</strong>: Control whether to show the cancel button</li>
            <li><strong>showBackButton</strong>: Control whether to show the back button in step-based forms</li>
            <li><strong>showReset</strong>: Control whether to show the reset/clear button</li>
          </ul>
          <p className="mt-2">
            Use the toggle buttons at the top of the demo to see how these options affect the forms.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">API Validation</h3>
          <p className="mb-4">
            This example also demonstrates the form builder&apos;s API validation feature with debounce.
            The validation happens after the user stops typing, preventing unnecessary API calls.
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Type in the username or email field</li>
            <li>The validation will trigger after the debounce period (500ms for username, 800ms for email)</li>
            <li>A loading indicator will show while validation is in progress</li>
            <li>If validation fails, an error message will be displayed</li>
          </ol>
        </div>
        
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