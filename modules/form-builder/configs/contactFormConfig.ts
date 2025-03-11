
import { FormConfig } from '../types/formTypes';

export const contactFormConfig: FormConfig = {
  title: 'Contact Us',
  description: 'Fill out the form below to get in touch with us.',
  // Enable Laravel validation support
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
      title: 'Message Details',
      fields: [
        {
          name: 'country',
          label: 'Country',
          type: 'select',
          placeholder: 'Select your country',
          required: true,
          dynamicOptions: {
            url: 'https://restcountries.com/v3.1/all',
            valueKey: 'cca2',
            labelKey: 'name.common',
            paginationEnabled: true,
            searchParamName: 'name',
            pageSize: 10
          },
          validation: [
            {
              type: 'required',
              message: 'Please select a country'
            }
          ]
        },
        {
          name: 'city',
          label: 'City',
          type: 'select',
          placeholder: 'Select a city',
          required: true,
          options: [
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
          ],
          validation: [
            {
              type: 'required',
              message: 'Please select a city'
            }
          ]
        },
        {
          name: 'subject',
          label: 'Subject',
          type: 'select',
          placeholder: 'Select a subject',
          required: true,
          options: [
            { value: 'general', label: 'General Inquiry' },
            { value: 'support', label: 'Technical Support' },
            { value: 'billing', label: 'Billing Question' },
            { value: 'feedback', label: 'Product Feedback' },
            { value: 'other', label: 'Other' }
          ],
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
        },
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
