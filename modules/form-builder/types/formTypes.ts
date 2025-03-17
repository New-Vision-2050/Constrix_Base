import React from 'react';

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom' | 'apiValidation';
  value?: any;
  message: string;
  validator?: (value: any, formValues?: Record<string, any>) => boolean;
  apiConfig?: {
    url: string;
    method?: 'GET' | 'POST' | 'PUT';
    debounceMs?: number;
    paramName?: string;
    headers?: Record<string, string>;
    successCondition?: (response: any) => boolean;
  };
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DynamicDropdownConfig {
  url: string;
  valueField: string;
  labelField: string;
  dependsOn?: string; // The field/column key this dropdown depends on
  filterParam?: string; // The parameter name to filter by in API calls
  searchParam?: string; // Parameter name for search query
  paginationEnabled?: boolean; // Whether to use pagination
  pageParam?: string; // Parameter name for page number
  limitParam?: string; // Parameter name for items per page
  itemsPerPage?: number; // Number of items to fetch per page
  totalCountHeader?: string; // Header containing total count information
  headers?: Record<string, string>; // Custom headers for the API request
  queryParameters?: Record<string, string>; // Additional query parameters
  transformResponse?: (data: any) => DropdownOption[]; // Transform API response to dropdown options
  enableServerSearch?: boolean; // Whether to enable server-side search
}

export interface SearchTypeConfig {
  type: 'text' | 'dropdown' | 'date' | 'number';
  placeholder?: string;
  dropdownOptions?: DropdownOption[]; // Static options
  dynamicDropdown?: DynamicDropdownConfig; // Dynamic options from API
}

export interface FieldConfig {
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'multiSelect' | 'email' | 'password' | 'number' | 'date' | 'search' | 'phone' | 'hiddenObject';
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  autoFocus?: boolean;
  className?: string;
  containerClassName?: string; // Class name for the container element
  width?: string;
  gridArea?: string;
  options?: DropdownOption[]; // Using shared DropdownOption type
  validation?: ValidationRule[];
  condition?: (values: Record<string, any>) => boolean;
  onChange?: (newValue: any, values: Record<string, any>) => void;
  onBlur?: (value: any, values: Record<string, any>) => void;
  render?: (field: FieldConfig, value: any, onChange: (newValue: any) => void) => React.ReactNode;
  dynamicOptions?: DynamicDropdownConfig; // Using shared DynamicDropdownConfig type
  searchType?: SearchTypeConfig; // Using shared SearchTypeConfig type
  isMulti?: boolean; // Whether to enable multi-select functionality
  postfix?: string; // Text to display after the input field
  defaultValue?: any; // Default value for the field
}

export interface FormSection {
  title?: string;
  description?: string;
  className?: string;
  columns?: number;
  fields: FieldConfig[];
  collapsible?: boolean
  condition?: (values: Record<string, any>) => boolean;
}

export interface WizardOptions {
  showStepIndicator?: boolean; // Whether to show step indicators
  showStepTitles?: boolean; // Whether to show step titles in the indicator
  validateStepBeforeNext?: boolean; // Whether to validate the current step before proceeding to the next
  allowStepNavigation?: boolean; // Whether to allow navigation to any step (if false, only sequential navigation is allowed)
  nextButtonText?: string; // Text for the next button
  prevButtonText?: string; // Text for the previous button
  finishButtonText?: string; // Text for the finish button on the last step
  onStepChange?: (prevStep: number, nextStep: number, values: Record<string, any>) => void; // Callback when step changes
  
  // New options for step submission
  submitEachStep?: boolean; // Whether to submit each step individually
  submitButtonTextPerStep?: string; // Text for the submit button on each step
  
  // API configuration for each step
  stepApiUrls?: Record<number, string>; // API URLs for each step (key is step index)
  stepApiHeaders?: Record<number, Record<string, string>>; // API headers for each step (key is step index)
  
  onStepSubmit?: (step: number, values: Record<string, any>) => Promise<{
    success: boolean;
    message?: string;
    data?: Record<string, any>; // Data that can be used in subsequent steps
    errors?: Record<string, string | string[]>;
  }>;
  
  // Store responses from each step
  stepResponses?: Record<number, {
    success: boolean;
    message?: string;
    data?: Record<string, any>;
  }>;
}

export interface FormConfig {
  formId?: string; // Unique identifier for the form instance
  title?: string;
  description?: string;
  className?: string;
  sections: FormSection[];
  showReset?: boolean;
  showCancelButton?: boolean; // Whether to show the cancel button
  showBackButton?: boolean; // Whether to show the back button in step-based forms
  submitButtonText?: string;
  resetButtonText?: string;
  cancelButtonText?: string;
  showSubmitLoader?: boolean;
  initialValues?: Record<string, any>;
  resetOnSuccess?: boolean;
  // Form mode configuration
  wizard?: boolean; // Enable wizard mode (multi-step form)
  accordion?: boolean; // Enable accordion mode (collapsible sections with step navigation)
  wizardOptions?: WizardOptions; // Configuration options for wizard/accordion mode
  // Backend API configuration
  apiUrl?: string; // URL to submit the form data to
  apiHeaders?: Record<string, string>; // Custom headers for the API request
  // Laravel validation response support
  laravelValidation?: {
    enabled: boolean;
    errorsPath?: string; // Default is 'errors'
  };
  onSubmit?: (values: Record<string, any>) => Promise<{ success: boolean; message?: string; errors?: Record<string, string | string[]> }>;
  onSuccess?: (values: Record<string, any>, result: { success: boolean; message?: string }) => void;
  onError?: (values: Record<string, any>, error: { message?: string; errors?: Record<string, string | string[]> }) => void;
  onCancel?: () => void;
  onValidationError?: (errors: Record<string, string>) => void;
  // Additional search fields for advanced filtering (similar to table config)
  allSearchedFields?: FieldConfig[];
}