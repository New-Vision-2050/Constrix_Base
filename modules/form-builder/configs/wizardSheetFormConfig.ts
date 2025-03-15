import { SearchTypeConfig } from '@/components/shared/dropdowns/sharedTypes';
import { FormConfig, WizardStep, StepSubmissionResult } from '../types/formTypes';
import { defaultStepSubmitHandler } from "@/modules/form-builder/utils/defaultStepSubmitHandler";

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
  placeholder: 'Select your city',
  dynamicDropdown: {
    url: 'https://core-be-pr16.constrix-nv.com/api/v1/cities',
    valueField: 'id',
    labelField: 'name',
    dependsOn: 'country',
    filterParam: 'country_id',
    paginationEnabled: true,
    itemsPerPage: 10,
    searchParam: 'name',
    pageParam: 'page',
    limitParam: 'per_page',
    totalCountHeader: 'x-total-count',
  }
};

// Define the wizard steps with multiple sections per step
const wizardSteps: WizardStep[] = [
  // Step 1: Location Information (contains multiple sections)
  {
    title: 'Location Information',
    description: 'Tell us where you are located',
    // Step-specific API configuration
    apiUrl: 'https://core-be-pr16.constrix-nv.com/api/v1/locations',
    apiHeaders: {
      'X-Location-API-Key': 'location-api-key',
      'Content-Type': 'application/json'
    },
    // Step-specific handlers
    onSubmit: async (step: number, values: Record<string, any>): Promise<StepSubmissionResult> => {
      console.log(`Submitting location information (step ${step + 1})`);
      console.log('Values:', values);
      
      // Simulate API call
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Location information saved successfully',
            data: {
              locationId: `LOC-${Math.floor(Math.random() * 10000)}`,
              locationName: `${values.city || 'Unknown'}, ${values.country || 'Unknown'}`,
              addressVerified: true
            }
          });
        }, 1000);
      });
    },
    onChange: (prevStep: number, nextStep: number, values: Record<string, any>): void => {
      console.log(`Moving from step ${prevStep + 1} to step ${nextStep + 1} in location section`);
      console.log('Current location values:', values);
    },
    sections: [
      // Section 1: Address Information
      {
        title: 'Address Information',
        description: 'Enter your address details',
        columns: 2,
        fields: [
          {
            name: 'country',
            label: 'Country',
            type: 'select',
            placeholder: 'Select your country',
            required: true,
            searchType: countrySearchConfig,
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
            searchType: citySearchConfig,
            condition: (values: Record<string, any>) => !!values.country,
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
          },
          {
            name: 'street',
            label: 'Street',
            type: 'text',
            placeholder: 'Enter your street',
            required: true,
            validation: [
              {
                type: 'required',
                message: 'Street is required'
              }
            ]
          }
        ]
      },
      // Section 2: Additional Location Details
      {
        title: 'Additional Location Details',
        description: 'Provide more information about your location',
        columns: 2,
        fields: [
          {
            name: 'buildingType',
            label: 'Building Type',
            type: 'select',
            placeholder: 'Select building type',
            options: [
              { value: 'residential', label: 'Residential' },
              { value: 'commercial', label: 'Commercial' },
              { value: 'industrial', label: 'Industrial' },
              { value: 'other', label: 'Other' }
            ]
          },
          {
            name: 'floorNumber',
            label: 'Floor Number',
            type: 'number',
            placeholder: 'Enter floor number'
          },
          {
            name: 'apartmentNumber',
            label: 'Apartment/Suite Number',
            type: 'text',
            placeholder: 'Enter apartment or suite number'
          },
          {
            name: 'locationNotes',
            label: 'Location Notes',
            type: 'textarea',
            placeholder: 'Any additional notes about your location'
          }
        ]
      }
    ]
  },
  
  // Step 2: Personal Information (contains multiple sections)
  {
    title: 'Personal Information',
    description: 'Tell us about yourself',
    // Step-specific API configuration
    apiUrl: 'https://core-be-pr16.constrix-nv.com/api/v1/users',
    apiHeaders: {
      'X-User-API-Key': 'user-api-key',
      'Content-Type': 'application/json'
    },
    // Step-specific handlers
    onSubmit: async (step: number, values: Record<string, any>): Promise<StepSubmissionResult> => {
      console.log(`Submitting personal information (step ${step + 1})`);
      console.log('Values:', values);
      
      // Simulate API call
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Personal information saved successfully',
            data: {
              userId: `USR-${Math.floor(Math.random() * 10000)}`,
              fullName: `${values.firstName || ''} ${values.lastName || ''}`.trim(),
              contactVerified: true
            }
          });
        }, 1000);
      });
    },
    onChange: (prevStep: number, nextStep: number, values: Record<string, any>): void => {
      console.log(`Moving from step ${prevStep + 1} to step ${nextStep + 1} in personal info section`);
      console.log('Current personal values:', values);
    },
    sections: [
      // Section 1: Basic Information
      {
        title: 'Basic Information',
        description: 'Enter your basic personal details',
        columns: 2,
        fields: [
          {
            name: 'firstName',
            label: 'First Name',
            type: 'text',
            placeholder: 'Enter your first name',
            required: true,
            validation: [
              {
                type: 'required',
                message: 'First name is required'
              },
              {
                type: 'minLength',
                value: 2,
                message: 'First name must be at least 2 characters'
              }
            ]
          },
          {
            name: 'lastName',
            label: 'Last Name',
            type: 'text',
            placeholder: 'Enter your last name',
            required: true,
            validation: [
              {
                type: 'required',
                message: 'Last name is required'
              },
              {
                type: 'minLength',
                value: 2,
                message: 'Last name must be at least 2 characters'
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
      // Section 2: Additional Personal Details
      {
        title: 'Additional Personal Details',
        description: 'Provide more information about yourself',
        columns: 2,
        fields: [
          {
            name: 'dateOfBirth',
            label: 'Date of Birth',
            type: 'date',
            placeholder: 'Select your date of birth'
          },
          {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            placeholder: 'Select your gender',
            options: [
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
              { value: 'prefer_not_to_say', label: 'Prefer not to say' }
            ]
          },
          {
            name: 'nationality',
            label: 'Nationality',
            type: 'select',
            placeholder: 'Select your nationality',
            searchType: countrySearchConfig
          },
          {
            name: 'preferredLanguage',
            label: 'Preferred Language',
            type: 'select',
            placeholder: 'Select your preferred language',
            options: [
              { value: 'en', label: 'English' },
              { value: 'fr', label: 'French' },
              { value: 'es', label: 'Spanish' },
              { value: 'de', label: 'German' },
              { value: 'ar', label: 'Arabic' }
            ]
          }
        ]
      }
    ]
  },
  
  // Step 3: Company Information (contains multiple sections)
  {
    title: 'Company Information',
    description: 'Tell us about your company',
    // Step-specific API configuration
    apiUrl: 'https://core-be-pr16.constrix-nv.com/api/v1/companies',
    apiHeaders: {
      'X-Company-API-Key': 'company-api-key',
      'Content-Type': 'application/json'
    },
    // Step-specific handlers
    onSubmit: async (step: number, values: Record<string, any>): Promise<StepSubmissionResult> => {
      console.log(`Submitting company information (step ${step + 1})`);
      console.log('Values:', values);
      
      // Simulate API call
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Company information saved successfully',
            data: {
              companyId: `COM-${Math.floor(Math.random() * 10000)}`,
              companyName: values.companyName || 'Unknown Company',
              registrationVerified: true
            }
          });
        }, 1000);
      });
    },
    onChange: (prevStep: number, nextStep: number, values: Record<string, any>): void => {
      console.log(`Moving from step ${prevStep + 1} to step ${nextStep + 1} in company info section`);
      console.log('Current company values:', values);
    },
    sections: [
      // Section 1: Company Details
      {
        title: 'Company Details',
        description: 'Enter your company information',
        columns: 2,
        fields: [
          {
            name: 'companyName',
            label: 'Company Name',
            type: 'text',
            placeholder: 'Enter your company name',
            required: true,
            validation: [
              {
                type: 'required',
                message: 'Company name is required'
              }
            ]
          },
          {
            name: 'companyRegistrationNumber',
            label: 'Registration Number',
            type: 'text',
            placeholder: 'Enter company registration number'
          },
          {
            name: 'companyType',
            label: 'Company Type',
            type: 'select',
            placeholder: 'Select company type',
            options: [
              { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
              { value: 'partnership', label: 'Partnership' },
              { value: 'llc', label: 'Limited Liability Company (LLC)' },
              { value: 'corporation', label: 'Corporation' },
              { value: 'nonprofit', label: 'Non-profit Organization' }
            ]
          },
          {
            name: 'industry',
            label: 'Industry',
            type: 'select',
            placeholder: 'Select your industry',
            options: [
              { value: 'technology', label: 'Technology' },
              { value: 'healthcare', label: 'Healthcare' },
              { value: 'finance', label: 'Finance' },
              { value: 'education', label: 'Education' },
              { value: 'retail', label: 'Retail' },
              { value: 'manufacturing', label: 'Manufacturing' },
              { value: 'other', label: 'Other' }
            ]
          }
        ]
      },
      // Section 2: Company Contact Information
      {
        title: 'Company Contact Information',
        description: 'Provide contact details for your company',
        columns: 2,
        fields: [
          {
            name: 'companyEmail',
            label: 'Company Email',
            type: 'email',
            placeholder: 'Enter company email',
            validation: [
              {
                type: 'email',
                message: 'Please enter a valid email address'
              }
            ]
          },
          {
            name: 'companyPhone',
            label: 'Company Phone',
            type: 'text',
            placeholder: 'Enter company phone number',
            validation: [
              {
                type: 'pattern',
                value: '^[0-9\\-\\+\\s\\(\\)]+$',
                message: 'Please enter a valid phone number'
              }
            ]
          },
          {
            name: 'companyWebsite',
            label: 'Company Website',
            type: 'text',
            placeholder: 'Enter company website',
            validation: [
              {
                type: 'pattern',
                value: '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$',
                message: 'Please enter a valid website URL'
              }
            ]
          },
          {
            name: 'numberOfEmployees',
            label: 'Number of Employees',
            type: 'select',
            placeholder: 'Select number of employees',
            options: [
              { value: '1-10', label: '1-10' },
              { value: '11-50', label: '11-50' },
              { value: '51-200', label: '51-200' },
              { value: '201-500', label: '201-500' },
              { value: '501-1000', label: '501-1000' },
              { value: '1000+', label: '1000+' }
            ]
          }
        ]
      }
    ]
  }
];

// Define the form configuration
export const wizardSheetFormConfig: FormConfig = {
  title: 'Multi-Section Wizard Form',
  description: 'Complete all steps to submit your information',
  
  // Base sections (used when not in wizard mode)
  sections: [
    {
      title: 'All Information',
      description: 'Enter all your information',
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          placeholder: 'Enter your full name',
          required: true
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'Enter your email',
          required: true
        }
      ]
    }
  ],
  
  // API configuration for the entire form
  apiUrl: "https://core-be-pr16.constrix-nv.com/api/v1/submissions",
  apiHeaders: {
    "X-API-Key": "your-api-key-here",
    "Content-Type": "application/json"
  },
  
  // Laravel validation support
  laravelValidation: {
    enabled: true,
    errorsPath: 'errors'
  },
  
  // Button text
  submitButtonText: 'Submit Form',
  cancelButtonText: 'Cancel',
  showReset: true,
  resetButtonText: 'Clear Form',
  showSubmitLoader: true,
  resetOnSuccess: true,
  
  // Enable wizard mode
  wizard: true,
  
  // Define wizard steps with multiple sections per step
  wizardSteps: wizardSteps,
  
  // Wizard options
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
    submitButtonTextPerStep: 'Save & Continue'
  },
  
  // Form submission handlers
  onSuccess: (values: Record<string, any>, result: { success: boolean; message?: string }) => {
    console.log('Form submitted successfully with values:', values);
    console.log('Result from API:', result);
  },
  
  onError: (values: Record<string, any>, error: { message?: string; errors?: Record<string, string | string[]> }) => {
    console.log('Form submission failed with values:', values);
    console.log('Error details:', error);
  }
};