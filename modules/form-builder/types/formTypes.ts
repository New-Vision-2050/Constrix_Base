import React from 'react';

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any, formValues?: Record<string, any>) => boolean;
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
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'email' | 'password' | 'number' | 'date' | 'search';
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

export interface FormConfig {
  title?: string;
  description?: string;
  className?: string;
  sections: FormSection[];
  showReset?: boolean;
  submitButtonText?: string;
  resetButtonText?: string;
  cancelButtonText?: string;
  showSubmitLoader?: boolean;
  initialValues?: Record<string, any>;
  resetOnSuccess?: boolean;
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
  onCancel?: () => void;
  onValidationError?: (errors: Record<string, string>) => void;
  // Additional search fields for advanced filtering (similar to table config)
  allSearchedFields?: FieldConfig[];
}