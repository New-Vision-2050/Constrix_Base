import { FormConfig } from '../types/formTypes';

// Example form configuration with dynamic rows field
export const dynamicRowsExampleConfig: FormConfig = {
  formId: 'dynamic-rows-example',
  title: 'Dynamic Rows Example',
  description: 'This form demonstrates the dynamic rows field type',
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