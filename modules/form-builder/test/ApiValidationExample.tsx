import React, { useState } from 'react';
import { FormConfig } from '../types/formTypes';
import SheetFormBuilder from '../components/SheetFormBuilder';
import { Button } from '@/components/ui/button';

/**
 * Example component demonstrating API validation with debounce
 */
const ApiValidationExample: React.FC = () => {
  // State to control button visibility options
  const [showCancelButton, setShowCancelButton] = useState(true);
  const [showBackButton, setShowBackButton] = useState(true);
  const [showClearButton, setShowClearButton] = useState(true);

  // Form configuration with API validation
  const apiValidationFormConfig: FormConfig = {
    title: 'API Validation Example',
    description: 'This form demonstrates API validation with debounce',
    sections: [
      {
        title: 'User Information',
        fields: [
          {
            type: 'text',
            name: 'username',
            label: 'Username',
            placeholder: 'Enter a username',
            required: true,
            validation: [
              {
                type: 'required',
                message: 'Username is required',
              },
              {
                type: 'apiValidation',
                message: 'Username is already taken',
                apiConfig: {
                  url: '/api/validate-username',
                  method: 'POST',
                  debounceMs: 500, // Wait 500ms after typing stops before validating
                  paramName: 'username',
                  // This function checks if the API response indicates the username is available
                  successCondition: (response) => response.available === true,
                },
              },
            ],
          },
          {
            type: 'email',
            name: 'email',
            label: 'Email',
            placeholder: 'Enter your email',
            required: true,
            validation: [
              {
                type: 'required',
                message: 'Email is required',
              },
              {
                type: 'email',
                message: 'Please enter a valid email address',
              },
              {
                type: 'apiValidation',
                message: 'Email is already registered',
                apiConfig: {
                  url: '/api/validate-email',
                  method: 'GET',
                  debounceMs: 800, // Wait 800ms after typing stops before validating
                  paramName: 'email',
                  successCondition: (response) => response.available === false,
                },
              },
            ],
          },
          {
            type: 'text',
            name: 'companyName',
            label: 'Company Name',
            placeholder: 'Enter company name to check availability',
            validation: [
              {
                type: 'apiValidation',
                message: 'Company name is already registered',
                apiConfig: {
                  url: '/api/validate-username', // Reusing the same endpoint for demo
                  method: 'POST',
                  debounceMs: 500,
                  paramName: 'username',
                  // No successCondition provided - will use default behavior
                  // The system will check for common response patterns:
                  // - response.available === true
                  // - response.success === true
                  // - response.valid === true
                  // - response.isValid === true
                },
              },
            ],
          },
          {
            type: 'number',
            name: 'price',
            label: 'Price',
            placeholder: 'Enter price',
            postfix: 'USD',
            validation: [
              {
                type: 'min',
                value: 0,
                message: 'Price must be a positive number',
              },
            ],
          },
          {
            type: 'text',
            name: 'weight',
            label: 'Weight',
            placeholder: 'Enter weight',
            postfix: 'kg',
          },
        ],
      },
    ],
    submitButtonText: 'Register',
    cancelButtonText: 'Cancel',
    resetButtonText: 'Clear',
    showReset: showClearButton,
    showCancelButton: showCancelButton,
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, message: 'Registration successful!' };
    },
  };

  // Wizard form configuration to demonstrate back button visibility
  const wizardFormConfig: FormConfig = {
    title: 'Multi-Step Form Example',
    description: 'This form demonstrates button visibility options in a wizard',
    wizard: true,
    sections: [
      {
        title: 'Step 1: Personal Info',
        fields: [
          {
            type: 'text',
            name: 'firstName',
            label: 'First Name',
            required: true,
          },
          {
            type: 'text',
            name: 'lastName',
            label: 'Last Name',
            required: true,
          },
        ],
      },
      {
        title: 'Step 2: Contact Info',
        fields: [
          {
            type: 'email',
            name: 'contactEmail',
            label: 'Email',
            required: true,
          },
          {
            type: 'text',
            name: 'phone',
            label: 'Phone',
          },
        ],
      },
      {
        title: 'Step 3: Review',
        fields: [
          {
            type: 'text',
            name: 'comments',
            label: 'Additional Comments',
          },
        ],
      },
    ],
    submitButtonText: 'Complete',
    cancelButtonText: 'Cancel',
    resetButtonText: 'Clear',
    showReset: showClearButton,
    showCancelButton: showCancelButton,
    showBackButton: showBackButton,
    wizardOptions: {
      showStepIndicator: true,
      showStepTitles: true,
      validateStepBeforeNext: true,
      nextButtonText: 'Next Step',
      prevButtonText: 'Go Back',
      finishButtonText: 'Submit Form',
    },
    onSubmit: async (values) => {
      console.log('Wizard form submitted with values:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, message: 'Form completed successfully!' };
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Form Builder Demo</h1>
      
      {/* Button visibility controls */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Button Visibility Options</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={showCancelButton ? "default" : "outline"}
            onClick={() => setShowCancelButton(!showCancelButton)}
            className="text-sm"
          >
            {showCancelButton ? "Hide Cancel Button" : "Show Cancel Button"}
          </Button>
          
          <Button
            variant={showBackButton ? "default" : "outline"}
            onClick={() => setShowBackButton(!showBackButton)}
            className="text-sm"
          >
            {showBackButton ? "Hide Back Button" : "Show Back Button"}
          </Button>
          
          <Button
            variant={showClearButton ? "default" : "outline"}
            onClick={() => setShowClearButton(!showClearButton)}
            className="text-sm"
          >
            {showClearButton ? "Hide Clear Button" : "Show Clear Button"}
          </Button>
        </div>
      </div>
      
      {/* API Validation Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">API Validation Form</h2>
        <SheetFormBuilder config={apiValidationFormConfig} />
      </div>
      
      {/* Wizard Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Wizard Form</h2>
        <p className="mb-4 text-gray-600">This example demonstrates the back button visibility in a multi-step form.</p>
        <SheetFormBuilder config={wizardFormConfig} />
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">About the Examples</h2>
        <p className="mb-3">
          Use the buttons at the top to toggle the visibility of different form buttons:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Cancel Button:</strong> Controls the visibility of the cancel button in both forms.
          </li>
          <li>
            <strong>Back Button:</strong> Controls the visibility of the back/previous button in the wizard form.
          </li>
          <li>
            <strong>Clear Button:</strong> Controls the visibility of the reset/clear button in both forms.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApiValidationExample;
