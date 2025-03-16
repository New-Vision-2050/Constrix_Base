import React from 'react';
import { FormConfig } from '../types/formTypes';
import SheetFormBuilder from '../components/SheetFormBuilder';

/**
 * Example component demonstrating API validation with debounce
 */
const ApiValidationExample: React.FC = () => {
  // Form configuration with API validation
  const formConfig: FormConfig = {
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
                  successCondition: (response) => response.available === true,
                },
              },
            ],
          },
        ],
      },
    ],
    submitButtonText: 'Register',
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, message: 'Registration successful!' };
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Validation Demo</h1>
      <SheetFormBuilder config={formConfig} />
    </div>
  );
};

export default ApiValidationExample;