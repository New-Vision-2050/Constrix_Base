/**
 * Interface for search form data
 */
export interface SearchFormData {
  /** End date filter */
  endDate?: string;
  /** Type filter */
  type?: string;
  /** Document type filter */
  documentType?: string;
  search?: string;
}

/**
 * Interface for dropdown option
 */
export interface DropdownOption {
  /** Option value */
  value: string;
  /** Option label */
  label: string;
}

/**
 * Props for SearchFields component
 */
export interface SearchFieldsProps {
  /** Search form data */
  data: SearchFormData;
  /** Form data change handler */
  onChange: (data: SearchFormData) => void;
  /** Custom className */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
}
