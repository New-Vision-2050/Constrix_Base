import { FormConfig } from '../types/formTypes';

export const searchFormConfig: FormConfig = {
  formId: 'search-form',
  title: 'Search Form Example',
  description: 'This form demonstrates the use of the search field type',
  sections: [
    {
      title: 'Basic Information',
      description: 'Enter your basic information',
      fields: [
        {
          type: 'text',
          name: 'name',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          validation: [
            {
              type: 'required',
              message: 'Full name is required',
            },
          ],
        },
        {
          type: 'email',
          name: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email address',
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
          ],
        },
      ],
    },
    {
      title: 'Location Information',
      description: 'Select your country and city',
      fields: [
        {
          type: 'search',
          name: 'country',
          label: 'Country',
          placeholder: 'Select a country',
          required: true,
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
              message: 'Country is required',
            },
          ],
        },
        {
          type: 'search',
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
            limitParam: 'per_page',
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
      ],
    },
    {
      title: 'Additional Information',
      description: 'Provide any additional information',
      fields: [
        {
          type: 'textarea',
          name: 'comments',
          label: 'Comments',
          placeholder: 'Enter any additional comments',
        },
      ],
    },
  ],
  submitButtonText: 'Submit',
  resetButtonText: 'Reset',
  cancelButtonText: 'Cancel',
  showSubmitLoader: true,
  resetOnSuccess: true,
  initialValues: {
    name: '',
    email: '',
    country: '',
    city: '',
    comments: '',
  },
  onSubmit: async (values) => {
    // Simulate API call
    console.log('Form values:', values);

    // Simulate successful submission
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Form submitted successfully',
        });
      }, 1000);
    });
  },
};
