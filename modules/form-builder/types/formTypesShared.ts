import { DropdownOption, DynamicDropdownConfig, SearchTypeConfig } from '@/components/shared/dropdowns/sharedTypes';
import React from 'react';

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any, formValues?: Record<string, any>) => boolean;
}

export interface FieldConfig {
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'email' | 'password' | 'number' | 'date' | 'search' | 'image';
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
    condition?: (values: Record<string, any>) => boolean;
    collapsible?: boolean;
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
  onSubmit: (values: Record<string, any>) => Promise<{ success: boolean; message?: string; errors?: Record<string, string | string[]> }>;
  onCancel?: () => void;
  onValidationError?: (errors: Record<string, string>) => void;
  // Additional search fields for advanced filtering (similar to table config)
  allSearchedFields?: FieldConfig[];
}