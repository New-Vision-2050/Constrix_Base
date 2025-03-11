
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any, formValues?: Record<string, any>) => boolean;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface DynamicOptionsConfig {
  url: string;
  searchParamName?: string;
  valueKey: string;
  labelKey: string;
  headers?: Record<string, string>;
  queryParameters?: Record<string, string>;
  transformResponse?: (data: any) => FieldOption[];
  paginationEnabled?: boolean;
  pageSize?: number;
}

export interface FieldConfig {
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'email' | 'password' | 'number' | 'date';
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
  options?: FieldOption[];
  validation?: ValidationRule[];
  condition?: (values: Record<string, any>) => boolean;
  onChange?: (newValue: any, values: Record<string, any>) => void;
  onBlur?: (value: any, values: Record<string, any>) => void;
  render?: (field: FieldConfig, value: any, onChange: (newValue: any) => void) => React.ReactNode;
  dynamicOptions?: DynamicOptionsConfig;
}

export interface FormSection {
  title?: string;
  description?: string;
  className?: string;
  columns?: number;
  fields: FieldConfig[];
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
  // Laravel validation response support
  laravelValidation?: {
    enabled: boolean;
    errorsPath?: string; // Default is 'errors'
  };
  onSubmit: (values: Record<string, any>) => Promise<{ success: boolean; message?: string; errors?: Record<string, string | string[]> }>;
  onCancel?: () => void;
  onValidationError?: (errors: Record<string, string>) => void;
}
