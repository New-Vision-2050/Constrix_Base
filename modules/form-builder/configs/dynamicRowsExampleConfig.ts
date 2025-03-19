import { FormConfig } from '../types/formTypes';
import { baseURL } from '@/config/axios-config';

// Example form configuration with dynamic rows field
export const dynamicRowsExampleConfig: FormConfig = {
  formId: 'dynamic-rows-example',
  title: 'Dynamic Rows Example',
  description: 'This form demonstrates the dynamic rows field type with support for all field types',
  sections: [
    {
      title: 'Basic Information',
      description: 'Enter your basic information',
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          placeholder: 'Enter your full name',
          required: true,
          validation: [
            {
              type: 'required',
              message: 'Full name is required'
            }
          ]
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'Enter your email address',
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
        }
      ]
    },
    {
      title: 'Education History',
      description: 'Add your educational qualifications',
      fields: [
        {
          name: 'education',
          label: 'Education',
          type: 'dynamicRows',
          required: true,
          validation: [
            {
              type: 'required',
              message: 'At least one education entry is required'
            }
          ],
          dynamicRowsConfig: {
            fields: [
              {
                name: 'institution',
                label: 'Institution',
                type: 'text',
                placeholder: 'Enter institution name',
                required: true,
                validation: [
                  {
                    type: 'required',
                    message: 'Institution name is required'
                  }
                ]
              },
              {
                name: 'degree',
                label: 'Degree',
                type: 'select',
                placeholder: 'Select degree',
                required: true,
                options: [
                  { value: 'high_school', label: 'High School' },
                  { value: 'associate', label: 'Associate Degree' },
                  { value: 'bachelor', label: 'Bachelor\'s Degree' },
                  { value: 'master', label: 'Master\'s Degree' },
                  { value: 'doctorate', label: 'Doctorate' },
                  { value: 'other', label: 'Other' }
                ]
              },
              {
                name: 'fieldOfStudy',
                label: 'Field of Study',
                type: 'text',
                placeholder: 'Enter field of study'
              },
              {
                name: 'startDate',
                label: 'Start Date',
                type: 'date',
                placeholder: 'Select start date'
              },
              {
                name: 'endDate',
                label: 'End Date',
                type: 'date',
                placeholder: 'Select end date'
              },
              {
                name: 'current',
                label: 'Currently Studying',
                type: 'checkbox'
              }
            ],
            addRowButtonText: 'Add Education',
            deleteRowButtonText: 'Remove',
            minRows: 1,
            maxRows: 5,
            sortable: true,
            defaultRowValues: {
              current: false
            }
          }
        }
      ]
    },
    {
      title: 'Work Experience',
      description: 'Add your work experience',
      fields: [
        {
          name: 'workExperience',
          label: 'Work Experience',
          type: 'dynamicRows',
          dynamicRowsConfig: {
            fields: [
              {
                name: 'company',
                label: 'Company',
                type: 'text',
                placeholder: 'Enter company name',
                required: true
              },
              {
                name: 'position',
                label: 'Position',
                type: 'text',
                placeholder: 'Enter job title',
                required: true
              },
              {
                name: 'location',
                label: 'Location',
                type: 'text',
                placeholder: 'Enter location'
              },
              {
                name: 'startDate',
                label: 'Start Date',
                type: 'date',
                placeholder: 'Select start date'
              },
              {
                name: 'endDate',
                label: 'End Date',
                type: 'date',
                placeholder: 'Select end date'
              },
              {
                name: 'current',
                label: 'Current Job',
                type: 'checkbox'
              },
              {
                name: 'description',
                label: 'Job Description',
                type: 'textarea',
                placeholder: 'Describe your responsibilities'
              }
            ],
            addRowButtonText: 'Add Work Experience',
            deleteRowButtonText: 'Remove',
            sortable: true
          }
        }
      ]
    },
    {
      title: 'Skills',
      description: 'Add your skills',
      fields: [
        {
          name: 'skills',
          label: 'Skills',
          type: 'dynamicRows',
          dynamicRowsConfig: {
            fields: [
              {
                name: 'skill',
                label: 'Skill',
                type: 'text',
                placeholder: 'Enter skill name',
                required: true
              },
              {
                name: 'proficiency',
                label: 'Proficiency',
                type: 'select',
                placeholder: 'Select proficiency level',
                options: [
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                  { value: 'expert', label: 'Expert' }
                ]
              },
              {
                name: 'yearsOfExperience',
                label: 'Years of Experience',
                type: 'number',
                placeholder: 'Enter years of experience'
              }
            ],
            addRowButtonText: 'Add Skill',
            deleteRowButtonText: 'Remove',
            sortable: true
          }
        }
      ]
    },
    {
      title: 'Simple Field Types Example',
      description: 'This section demonstrates the recommended field types for dynamic rows',
      fields: [
        {
          name: 'simpleFields',
          label: 'Simple Fields',
          type: 'dynamicRows',
          dynamicRowsConfig: {
            fields: [
              // Text field
              {
                name: 'textField',
                label: 'Text Field',
                type: 'text',
                placeholder: 'Enter text',
                required: true,
                helperText: 'This is a simple text field'
              },
              // Number field
              {
                name: 'numberField',
                label: 'Number Field',
                type: 'number',
                placeholder: 'Enter a number',
                helperText: 'This is a number field'
              },
              // Select field with static options
              {
                name: 'category',
                label: 'Category',
                type: 'select',
                placeholder: 'Select a category',
                options: [
                  { value: 'category1', label: 'Category 1' },
                  { value: 'category2', label: 'Category 2' },
                  { value: 'category3', label: 'Category 3' }
                ]
              },
              // Checkbox field
              {
                name: 'isActive',
                label: 'Active',
                type: 'checkbox',
                helperText: 'Check if active'
              },
              // Date field
              {
                name: 'eventDate',
                label: 'Event Date',
                type: 'date',
                placeholder: 'Select a date'
              },
              // Textarea field
              {
                name: 'notes',
                label: 'Notes',
                type: 'textarea',
                placeholder: 'Enter notes',
                helperText: 'Additional information'
              }
            ],
            addRowButtonText: 'Add Simple Row',
            deleteRowButtonText: 'Remove',
            sortable: true
          }
        }
      ]
    },
    {
      title: 'Advanced Field Types (Outside Dynamic Rows)',
      description: 'This section demonstrates advanced field types that should be used outside of dynamic rows',
      fields: [
        // Dynamic dropdown with pagination and search
        {
          name: 'country',
          label: 'Country',
          type: 'select',
          placeholder: 'Select country',
          required: true,
          searchType: {
            type: 'dropdown',
            dynamicDropdown: {
              url: `${baseURL}/countries`,
              valueField: 'id',
              labelField: 'name',
              paginationEnabled: true,
              itemsPerPage: 10,
              searchParam: 'name',
              pageParam: 'page',
              limitParam: 'per_page',
              totalCountHeader: 'x-total-count',
              enableServerSearch: true
            }
          }
        },
        // Dependent dropdown example
        {
          name: 'city',
          label: 'City',
          type: 'select',
          placeholder: 'Select city',
          searchType: {
            type: 'dropdown',
            dynamicDropdown: {
              url: `${baseURL}/cities`,
              valueField: 'id',
              labelField: 'name',
              dependsOn: 'country', // This field depends on the country field
              filterParam: 'country_id', // Parameter name for filtering
              searchParam: 'name',
              enableServerSearch: true
            }
          }
        },
        // Phone field with country code
        {
          name: 'phoneNumber',
          label: 'Phone Number',
          type: 'phone',
          placeholder: 'Enter phone number',
          required: true
        },
        // Multi-select field
        {
          name: 'languages',
          label: 'Languages',
          type: 'multiSelect',
          placeholder: 'Select languages',
          isMulti: true,
          options: [
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'French' },
            { value: 'es', label: 'Spanish' },
            { value: 'de', label: 'German' },
            { value: 'zh', label: 'Chinese' },
            { value: 'ar', label: 'Arabic' }
          ]
        }
      ]
    }
  ],
  submitButtonText: 'Submit',
  resetButtonText: 'Clear Form',
  showReset: true,
  
  // Example submit handler
  onSubmit: async (values) => {
    console.log('Form submitted with values:', values);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Form submitted successfully' });
      }, 1500);
    });
  }
};