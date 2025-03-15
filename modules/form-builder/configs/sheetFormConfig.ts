import { SearchTypeConfig } from '@/components/shared/dropdowns/sharedTypes';
import { FormConfig } from '../types/formTypes';

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

          description: 'Tell us about yourself',
          collapsible: false,
          fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          placeholder: 'Enter your name',
          required: true,
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
    },
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
    }
  ],
  submitButtonText: 'Send Message',
  cancelButtonText: 'Cancel',
  showReset: true,
  resetButtonText: 'Clear Form',
  showSubmitLoader: true,
  resetOnSuccess: true,

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
