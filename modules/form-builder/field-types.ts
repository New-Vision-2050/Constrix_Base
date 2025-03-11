
import { FieldConfig } from './types/formTypes';

export interface FieldProps {
  field: FieldConfig;
  value: any;
  error?: string;
  touched?: boolean;
  onChange: (newValue: any) => void;
  onBlur: () => void;
}

export interface CommonFieldProps {
  id: string;
  name: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  className?: string;
  onBlur: () => void;
}
