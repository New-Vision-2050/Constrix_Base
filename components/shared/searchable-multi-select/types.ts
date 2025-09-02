/**
 * Option type for the multi-select component
 */
export type MultiSelectOption = {
  label: string;
  value: string;
};

/**
 * Props for the searchable multi-select component
 */
export type SearchableMultiSelectProps = {
  // Array of available options
  options: MultiSelectOption[];
  // Array of selected option values
  selectedValues: string[];
  // Function called when selection changes
  onChange: (values: string[]) => void;
  // Optional placeholder for the search input
  placeholder?: string;
  // Optional disabled state
  disabled?: boolean;
  // Optional class name for custom styling
  className?: string;
};
