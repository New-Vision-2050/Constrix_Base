import React, { memo, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/table/components/ui/select';
import DropdownSearch from '@/components/shared/dropdowns/DropdownSearch';
import PaginatedDropdown from '@/components/shared/dropdowns/PaginatedDropdown';
import { FieldConfig } from '../types/formTypesShared';
import { cn } from '@/lib/utils';
import { DynamicDropdownConfig } from '@/components/shared/dropdowns/sharedTypes';

interface SelectFieldProps {
  field: FieldConfig;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  dependencyValues: Record<string, any>;
}

const SelectFieldShared: React.FC<SelectFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  dependencyValues
}) => {
  // Check if we have a searchType configuration
  const searchTypeConfig = field.searchType;
  
  // If we have a searchType with a dynamic dropdown and pagination enabled, use PaginatedDropdown
  if (searchTypeConfig?.type === 'dropdown' && searchTypeConfig.dynamicDropdown?.paginationEnabled) {
    // Create compatible config by mapping properties and memoize it
    const paginatedConfig = useMemo<DynamicDropdownConfig>(() => ({
      url: searchTypeConfig.dynamicDropdown!.url,
      valueField: searchTypeConfig.dynamicDropdown!.valueField,
      labelField: searchTypeConfig.dynamicDropdown!.labelField,
      searchParam: searchTypeConfig.dynamicDropdown!.searchParam,
      pageParam: searchTypeConfig.dynamicDropdown!.pageParam || 'page',
      limitParam: searchTypeConfig.dynamicDropdown!.limitParam || 'per_page',
      itemsPerPage: searchTypeConfig.dynamicDropdown!.itemsPerPage || 10,
      headers: searchTypeConfig.dynamicDropdown!.headers,
      queryParameters: searchTypeConfig.dynamicDropdown!.queryParameters,
      totalCountHeader: searchTypeConfig.dynamicDropdown!.totalCountHeader,
      enableServerSearch: searchTypeConfig.dynamicDropdown!.enableServerSearch
    }), [searchTypeConfig.dynamicDropdown]);

    return (
      <PaginatedDropdown
        columnKey={field.name}
        label=""  // Empty label as we handle it separately
        value={value || ''}
        onChange={onChange}
        placeholder={field.placeholder}
        isDisabled={field.disabled}
        dynamicConfig={paginatedConfig}
        dependencies={dependencyValues}
        enableServerSearch={searchTypeConfig.dynamicDropdown?.enableServerSearch}
      />
    );
  }

  // If we have a searchType with a dynamic dropdown without pagination, use DropdownSearch
  if (searchTypeConfig?.type === 'dropdown' && searchTypeConfig.dynamicDropdown) {
    // Create compatible config by mapping properties and memoize it
    const dropdownConfig = useMemo<DynamicDropdownConfig>(() => ({
      url: searchTypeConfig.dynamicDropdown!.url,
      valueField: searchTypeConfig.dynamicDropdown!.valueField,
      labelField: searchTypeConfig.dynamicDropdown!.labelField,
      searchParam: searchTypeConfig.dynamicDropdown!.searchParam,
      headers: searchTypeConfig.dynamicDropdown!.headers,
      queryParameters: searchTypeConfig.dynamicDropdown!.queryParameters,
      enableServerSearch: searchTypeConfig.dynamicDropdown!.enableServerSearch
    }), [searchTypeConfig.dynamicDropdown]);

    return (
      <DropdownSearch
        columnKey={field.name}
        label=""  // Empty label as we handle it separately
        value={value || ''}
        onChange={onChange}
        options={field.options || []}
        dynamicConfig={dropdownConfig}
        dependencies={dependencyValues}
        placeholder={field.placeholder}
      />
    );
  }

  // If we have a searchType with dropdown options, use DropdownSearch with static options
  if (searchTypeConfig?.type === 'dropdown' && searchTypeConfig.dropdownOptions) {
    return (
      <DropdownSearch
        columnKey={field.name}
        label=""  // Empty label as we handle it separately
        value={value || ''}
        onChange={onChange}
        options={searchTypeConfig.dropdownOptions}
        placeholder={field.placeholder}
        dependencies={dependencyValues}
      />
    );
  }

  // Otherwise use regular Select with field options
  const options = useMemo(() => field.options || [], [field.options]);
  
  return (
    <Select
      value={value || ''}
      onValueChange={onChange}
    >
      <SelectTrigger id={field.name} className={cn(field.className, error && touched ? 'border-destructive' : '')}>
        <SelectValue placeholder={field.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Use memo to prevent unnecessary rerenders
export default memo(SelectFieldShared);