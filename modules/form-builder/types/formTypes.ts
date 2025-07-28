import React from "react";

export interface ValidationRule {
  type:
    | "required"
    | "min"
    | "max"
    | "minLength"
    | "maxLength"
    | "pattern"
    | "email"
    | "phone"
    | "url"
    | "custom"
    | "apiValidation";
  value?: any;
  message: string | React.ReactNode;
  validator?: (value: any, formValues?: Record<string, any>) => boolean;
  apiConfig?: {
    url: string;
    method?: "GET" | "POST" | "PUT";
    debounceMs?: number;
    paramName?: string;
    headers?: Record<string, string>;
    successCondition?: (response: any) => boolean;
  };
}

export interface DropdownOption {
  value: string;
  label: string;
  features?: Array<{
    id: string;
    name: string;
  }>;
}

export interface DynamicRowOptions {
  rowTemplate?: Record<string, any>; // Optional template for new rows (will be auto-generated from rowFields if not provided)
  rowFields?: FieldConfig[]; // Fields to display for each row
  minRows?: number; // Minimum number of rows
  maxRows?: number; // Maximum number of rows
  rowBgColor?: string; // Optional custom background color for rows
  rowHeaderBgColor?: string; // Optional custom background color for row headers
  columns?: number; // Number of columns for all screen sizes
  columnsSmall?: number; // Number of columns on small screens (default: 1)
  columnsMedium?: number; // Number of columns on medium screens (default: 2)
  columnsLarge?: number; // Number of columns on large screens (default: 3)
  enableDrag?: boolean; // Enable drag-and-drop reordering of rows
  enableRemove?: boolean; // Enable row removal (overrides minRows constraint if set to true)
  enableAdd?: boolean; // Enable row addition (overrides maxRows constraint if set to false)
  dragHandlePosition?: "left" | "right"; // Position of the drag handle (default: 'left')
  onDragStart?: (index: number) => void; // Callback when drag starts
  onDragEnd?: (oldIndex: number, newIndex: number) => void; // Callback when drag ends
  deleteUrl?: string;
  onDeleteSuccess?: () => void;
}

export interface DependencyConfig {
  field: string; // The field/column key this dropdown depends on
  method: "replace" | "query"; // Method to add value to URL: replace = replace in URL path, query = add as query parameter
  paramName?: string; // The parameter name to use when method is 'query' (defaults to field name)
}

export interface DynamicDropdownConfig {
  url: string;
  valueField: string;
  labelField: string;
  setFirstAsDefault?: boolean; // Whether to automatically select the first option when no value is selected
  dependsOn?:
    | string
    | DependencyConfig[]
    | Record<string, { method: "replace" | "query"; paramName?: string }>; // The field/column key this dropdown depends on
  // dependsOn can be:
  // 1. A string (for backward compatibility)
  // 2. An array of DependencyConfig objects
  // 3. An object with field names as keys and configuration as values
  filterParam?: string; // The parameter name to filter by in API calls (used when dependsOn is a string, for backward compatibility)
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
  disableReactQuery?: boolean; // Whether to disable React Query caching and use direct API calls
}

export interface SearchTypeConfig {
  type: "text" | "dropdown" | "date" | "number";
  placeholder?: string;
  dropdownOptions?: DropdownOption[]; // Static options
  dynamicDropdown?: DynamicDropdownConfig; // Dynamic options from API
  isMulti?: boolean;
}

export interface minMaxDate {
  formId?: string;
  field?: string;
  value?: string;
  shift?:{
    value: number;
    unit?: 'days' | 'months' | 'years'
  }
}

export interface FieldConfig {
  type:
    | "text"
    | "textarea"
    | "checkbox"
    | "checkboxGroup"
    | "radio"
    | "select"
    | "multiSelect"
    | "email"
    | "password"
    | "number"
    | "date"
    | "search"
    | "phone"
    | "hiddenObject"
    | "dynamicRows"
    | "image"
    | "file"
    | "time";
    
  fieldClassName?: string; // Class name for the field container

  // CheckboxGroup sync properties
  syncWithField?: string; // Name of another checkbox group field to sync with
  syncDirection?: "bidirectional" | "unidirectional"; // Whether the sync is two-way or one-way
  syncOn?: "select" | "unselect" | "both"; // When to trigger the sync
  name: string;
  // Image field specific properties
  imageConfig?: {
    allowedFileTypes?: string[]; // e.g., ['image/jpeg', 'image/png']
    maxFileSize?: number; // in bytes
    maxWidth?: number; // in pixels
    maxHeight?: number; // in pixels
    aspectRatio?: number; // width/height
    previewWidth?: number; // in pixels
    previewHeight?: number; // in pixels
    uploadUrl?: string; // URL to upload the image to
    uploadHeaders?: Record<string, string>; // Custom headers for the upload request
  };

  // File field specific properties
  fileConfig?: {
    allowedFileTypes?: string[]; // e.g., ['application/pdf', 'text/plain']
    maxFileSize?: number; // in bytes
    previewWidth?: number; // in pixels
    previewHeight?: number; // in pixels
    uploadUrl?: string; // URL to upload the file to
    uploadHeaders?: Record<string, string>; // Custom headers for the upload request
    showThumbnails?: boolean; // Whether to show thumbnails for files
  };
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
  gridArea?: number;
  optionsTitle?: string;
  options?: DropdownOption[]; // Using shared DropdownOption type
  validation?: ValidationRule[];
  condition?: (values: Record<string, any>) => boolean;
  onChange?: (newValue: any, values: Record<string, any>) => void;
  onBlur?: (value: any, values: Record<string, any>) => void;
  render?: (
    field: FieldConfig,
    value: any,
    onChange: (newValue: any) => void
  ) => React.ReactNode;
  dynamicOptions?: DynamicDropdownConfig; // Using shared DynamicDropdownConfig type
  searchType?: SearchTypeConfig; // Using shared SearchTypeConfig type
  isMulti?: boolean; // Whether to enable multi-select functionality
  isHijri?: boolean; // Whether to enable Hijri calendar works only with type=date
  postfix?: React.ReactNode; // Text to display after the input field
  defaultValue?: any; // Default value for the field
  dynamicRowOptions?: DynamicRowOptions; // Configuration for dynamic rows field
  minDate?: minMaxDate;
  maxDate?: minMaxDate;
}

export interface FormSection {
  title?: string;
  description?: string;
  className?: string;
  columns?: number;
  fields: FieldConfig[];
  collapsible?: boolean;
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
  onStepChange?: (
    prevStep: number,
    nextStep: number,
    values: Record<string, any>
  ) => void; // Callback when step changes

  // New options for step submission
  submitEachStep?: boolean; // Whether to submit each step individually
  submitButtonTextPerStep?: string; // Text for the submit button on each step

  // API configuration for each step
  stepApiUrls?: Record<number, string>; // API URLs for each step (key is step index)
  stepApiHeaders?: Record<number, Record<string, string>>; // API headers for each step (key is step index)

  onStepSubmit?: (
    step: number,
    values: Record<string, any>,
    formConfig: FormConfig
  ) => Promise<{
    success: boolean;
    message?: string;
    data?: Record<string, any>; // Data that can be used in subsequent steps
    errors?: Record<string, string | string[]>;
  }>;

  // Store responses from each step
  stepResponses?: Record<
    number,
    {
      success: boolean;
      message?: string;
      data?: Record<string, any>;
    }
  >;
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
  apiParams?: Record<string, string | number>;
  apiMethod?: "POST" | "PUT" | "PATCH" | "DELETE"; // HTTP method for form submission in create mode (default: POST)
  apiHeaders?: Record<string, string>; // Custom headers for the API request
  // Edit mode configuration
  isEditMode?: boolean; // Whether the form is in edit mode
  editValues?: Record<string, any>; // Values to use for editing (direct values)
  editApiUrl?: string; // URL to fetch data for editing (can include :id placeholder)
  editApiMethod?: "POST" | "PUT" | "PATCH"; // HTTP method for form submission in edit mode (default: PUT)
  editApiHeaders?: Record<string, string>; // Custom headers for the edit API request
  editDataPath?: string; // Path to the data in the API response (e.g., 'data' or 'data.user')
  editDataTransformer?: (data: any) => Record<string, any>; // Function to transform API response data
  // Laravel validation response support
  laravelValidation?: {
    enabled: boolean;
    errorsPath?: string; // Default is 'errors'
  };
  onSubmit?: (values: Record<string, any>, formConfig: FormConfig) => Promise<{
    success: boolean;
    message?: string;
    errors?: Record<string, string | string[]>;
  }>;
  onSuccess?: (
    values: Record<string, any>,
    result: { success: boolean; message?: string }
  ) => void;
  onError?: (
    values: Record<string, any>,
    error: { message?: string; errors?: Record<string, string | string[]> }
  ) => void;
  onCancel?: () => void;
  onValidationError?: (
    errors: Record<string, string | React.ReactNode>
  ) => void;
  // Additional search fields for advanced filtering (similar to table config)
  allSearchedFields?: FieldConfig[];
  wrapperClassName?: string;
  subWrapperClassName?:string
  subWrapperParentClassName?:string;
}
