import { FormConfig } from '../types/formTypesShared';
import { SearchTypeConfig } from '@/components/shared/dropdowns/sharedTypes';

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

const citySearchConfig: SearchTypeConfig = {
  type: 'dropdown',
  placeholder: 'Select a city',
  dropdownOptions: [
    { value: 'new_york', label: 'New York' },
    { value: 'london', label: 'London' },
    { value: 'paris', label: 'Paris' },
    { value: 'tokyo', label: 'Tokyo' },
    { value: 'sydney', label: 'Sydney' },
    { value: 'berlin', label: 'Berlin' },
    { value: 'madrid', label: 'Madrid' },
    { value: 'rome', label: 'Rome' },
    { value: 'toronto', label: 'Toronto' },
    { value: 'dubai', label: 'Dubai' }
  ]
};

const subjectSearchConfig: SearchTypeConfig = {
  type: 'dropdown',
  placeholder: 'Select a subject',
  dropdownOptions: [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'feedback', label: 'Product Feedback' },
    { value: 'other', label: 'Other' }
  ]
};

// Define the form configuration
export const sheetFormConfig: FormConfig = {
  title: 'Contact Us',
  description: 'Fill out the form below to get in touch with us.',
  apiUrl: "https://your-laravel-api.com/contact",
  apiHeaders: {
    "Authorization": "Bearer your-token-if-needed",
    "X-Custom-Header": "Custom value"
  },
  laravelValidation: {
    enabled: true,
    errorsPath: 'errors' // This is the default in Laravel
  },
  sections: [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself',
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
              url: '/api/cities',
              valueField: 'id',
              labelField: 'name',
              dependsOn: 'country',
              filterParam: 'country_id',
              searchParam: 'query',
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
      title: 'Message Details',
      description: 'Tell us how we can help you',
      fields: [
        {
          name: 'subject',
          label: 'Subject',
          type: 'select',
          placeholder: 'Select a subject',
          required: true,
          searchType: subjectSearchConfig,
          validation: [
            {
              type: 'required',
              message: 'Please select a subject'
            }
          ]
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea',
          placeholder: 'Type your message here',
          required: true,
          validation: [
            {
              type: 'required',
              message: 'Message is required'
            },
            {
              type: 'minLength',
              value: 10,
              message: 'Message must be at least 10 characters'
            }
          ]
        }
      ]
    },
    {
      title: 'Additional Information',
      description: 'Optional information that helps us serve you better',
      fields: [
        {
          name: 'preferredDate',
          label: 'Preferred Contact Date',
          type: 'date',
          placeholder: 'Select a date'
        },
        {
          name: 'subscribe',
          label: 'Subscribe to newsletter',
          type: 'checkbox'
        },
        {
          name: 'howDidYouHear',
          label: 'How did you hear about us?',
          type: 'select',
          placeholder: 'Select an option',
          options: [
            { value: 'search', label: 'Search Engine' },
            { value: 'social', label: 'Social Media' },
            { value: 'friend', label: 'Friend or Colleague' },
            { value: 'ad', label: 'Advertisement' },
            { value: 'other', label: 'Other' }
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

  // Example submit handler
  onSubmit: async (values) => {
    console.log('Form submitted with values:', values);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1500);
    });
  }
};