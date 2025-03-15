import { SearchTypeConfig } from '@/components/shared/dropdowns/sharedTypes';
import { FormConfig } from '../types/formTypes';
import {defaultStepSubmitHandler} from "@/modules/form-builder/utils/defaultStepSubmitHandler";

// Define search configurations for form fields
const countrySearchConfig: SearchTypeConfig = {
  type: 'dropdown',
  placeholder: 'Select your country',
  dynamicDropdown: {
    url: 'https://core-be-pr16.constrix-nv.com/api/v1/countries',
    valueField: 'id',
    labelField: 'name',
    paginationEnabled: true,
    itemsPerPage: 10,
    searchParam: 'name',
    pageParam: 'page',
    limitParam: 'per_page',
    totalCountHeader: 'x-total-count',
  }
};

// Define the form configuration
export const sheetFormConfig: FormConfig = {
  title: 'Contact Us',
  description: 'Fill out the form below to get in touch with us.',
  apiUrl: "https://core-be-pr16.constrix-nv.com/api/v1/companies",
  apiHeaders: {
    "X-Custom-Header": "Custom value"
  },
  laravelValidation: {
    enabled: true,
    errorsPath: 'errors' // This is the default in Laravel
  },
  sections: [
    {
      title: 'Location Information',
      description: 'Tell us where you are located',
      fields: [
        {
          name: 'country',
          label: 'Country',
          type: 'select',
          placeholder: 'Select your country',
          required: true,
          searchType: countrySearchConfig,
          options: [
            { value: '1', label: 'United States' },
            { value: '2', label: 'Canada' },
            { value: '3', label: 'United Kingdom' },
            { value: '4', label: 'Australia' },
            { value: '5', label: 'Germany' },
            { value: '6', label: 'France' },
            { value: '7', label: 'Japan' },
            { value: '8', label: 'China' },
            { value: '9', label: 'India' },
            { value: '10', label: 'Brazil' },
          ],
          validation: [
            {
              type: 'required',
              message: 'Please select a country'
            }
          ]
        },
        {
            type: 'select',
            name: 'city',
            label: 'City',
            placeholder: 'Select a city',
            required: true,
            dynamicOptions: {
              url: 'https://core-be-pr16.constrix-nv.com/api/v1/countries',
              valueField: 'id',
              labelField: 'name',
              dependsOn: 'country',
              filterParam: 'country_id',
              searchParam: 'name',
              paginationEnabled: true,
              pageParam: 'page',
              limitParam: 'limit',
              itemsPerPage: 10,
              totalCountHeader: 'X-Total-Count',
            },
            validation: [
              {
                type: 'required',
                message: 'City is required',
              },
            ],
          },
        {
          name: 'postalCode',
          label: 'Postal Code',
          type: 'text',
          placeholder: 'Enter your postal code',
          validation: [
            {
              type: 'pattern',
              value: '^[0-9a-zA-Z\\s\\-]+$',
              message: 'Please enter a valid postal code'
            }
          ]
        }
      ]
    },
        {
          title: 'User Info',
          collapsible: false,
          fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          placeholder: 'Enter your name',
          required: true,
          // Example of using a condition based on previous step data
          condition: (values) => {
            // This field will only be shown if the country is not empty
            return !!values.country;
          },
          validation: [
            {
              type: 'required',
              message: 'Name is required'
            },
            {
              type: 'minLength',
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          ]
        },
        {
          name: 'locationId',
          label: 'Location ID (from previous step)',
          type: 'text',
          // This field is read-only and will be populated from the previous step's response
          readOnly: true,
          // This is just a placeholder - the actual value will come from the step response
          placeholder: 'Will be generated after location submission',
          // In a real implementation, you would use the getStepResponseData function
          // from the useSheetForm hook to get the locationId from step 0's response
          helperText: 'This ID is generated from the previous step submission'
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'Enter your email',
          required: true,
          validation: [
            {
              type: 'required',
              message: 'Email is required'
            },
            {
              type: 'email',
              message: 'Please enter a valid email address'
            }
          ]
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'text',
          placeholder: 'Enter your phone number',
          validation: [
            {
              type: 'pattern',
              value: '^[0-9\\-\\+\\s\\(\\)]+$',
              message: 'Please enter a valid phone number'
            }
          ]
        }
      ]
    }
  ],
  submitButtonText: 'Send Message',
  cancelButtonText: 'Cancel',
  showReset: true,
  resetButtonText: 'Clear Form',
  showSubmitLoader: true,
  resetOnSuccess: true,

  // Enable wizard mode
  wizard: true,
  wizardOptions: {
    showStepIndicator: true,
    showStepTitles: true,
    validateStepBeforeNext: true,
    allowStepNavigation: true,
    nextButtonText: 'Continue',
    prevButtonText: 'Back',
    finishButtonText: 'Submit Form',
    // Enable submitting each step individually
    submitEachStep: true,
    submitButtonTextPerStep: 'Save & Continue',

    // API URLs for each step
    stepApiUrls: {
      0: 'https://core-be-pr16.constrix-nv.com/api/v1/locations', // Location step
      1: 'https://core-be-pr16.constrix-nv.com/api/v1/users',     // Personal info step
    },

    // API headers for each step
    stepApiHeaders: {
      0: {
        'X-Location-API-Key': 'location-api-key',
      },
      1: {
        'X-User-API-Key': 'user-api-key',
      }
    },

    // Custom step submission handler (optional - will use defaultStepSubmitHandler if not provided)
    onStepSubmit: async (step, values) => {
     // Option to call default way to handle the step
     // const result =   await defaultStepSubmitHandler(step, values, sheetFormConfig)
      console.log(`Submitting step ${step + 1}`);
      console.log('Values:', values);

      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          // Return success with data that can be used in subsequent steps
          resolve({
            success: true,
            message: `Step ${step + 1} submitted successfully`,
            data: {
              stepId: step,
              timestamp: new Date().toISOString(),
              // For step 0 (location), return a generated ID
              ...(step === 0 && { name: `LOC-${Math.floor(Math.random() * 10000)}` }),
              // For step 1 (personal info), return a generated user ID
              ...(step === 1 && { userId: `USR-${Math.floor(Math.random() * 10000)}` })
            }
          });
        }, 1000);
      });
    },
    // Handle step change
    onStepChange: (prevStep, nextStep, values) => {
      console.log(`Moving from step ${prevStep + 1} to step ${nextStep + 1}`);
      console.log('Current values:', values);

    }
  },

  // Example onSuccess handler
  onSuccess: (values, result) => {
    console.log('Form submitted successfully with values:', values);
    console.log('Result from API:', result);

    // You can perform additional actions here, such as:
    // - Show a custom notification
    // - Navigate to another page
    // - Update application state
    // - Trigger analytics events
    // - etc.
  },

  // Example onError handler
  onError: (values, error) => {
    console.log('Form submission failed with values:', values);
    console.log('Error details:', error);

    // You can perform additional actions here, such as:
    // - Show a custom error notification
    // - Log the error to an analytics service
    // - Attempt to recover from the error
    // - etc.
  }

  // No onSubmit handler needed - will use the default handler
};
