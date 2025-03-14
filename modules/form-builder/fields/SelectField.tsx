import React, { memo, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/table/components/ui/select';
import DropdownSearch from '@/components/shared/dropdowns/DropdownSearch';
import PaginatedDropdown from '@/components/shared/dropdowns/PaginatedDropdown';
import { FieldProps } from '../field-types';
import { cn } from '@/lib/utils';

const SelectField: React.FC<FieldProps & {
  onChange: (value: string) => void,
  onBlur: () => void,
  dependencyValues: Record<string, any>
}> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  dependencyValues
}) => {
  // Memoize the dynamic config to prevent unnecessary rerenders
  const dynamicConfig = useMemo(() => field.dynamicOptions, [field.dynamicOptions]);
  // If we have dynamic options with pagination enabled, use PaginatedDropdown
  if (dynamicConfig && dynamicConfig.paginationEnabled) {
    // Create compatible config by mapping properties and memoize it
    const paginatedConfig = useMemo(() => ({
      url: dynamicConfig.url,
      valueField: dynamicConfig.valueKey,
      labelField: dynamicConfig.labelKey,
      searchParam: dynamicConfig.searchParamName,
      pageParam: 'page',
      limitParam: 'limit',
      itemsPerPage: dynamicConfig.pageSize || 10,
      headers: dynamicConfig.headers,
      queryParams: dynamicConfig.queryParameters,
      transformResponse: dynamicConfig.transformResponse
    }), [dynamicConfig]);

    // Check if server search is disabled in field config
    // Default is true (server search enabled), so we only check for explicit false values
    const enableServerSearch = useMemo(() =>
      field.enableServerSearch !== false &&
      !(dynamicConfig && dynamicConfig.enableServerSearch === false),
    [field.enableServerSearch, dynamicConfig?.enableServerSearch]);

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
        enableServerSearch={enableServerSearch} // Pass the enableServerSearch prop
      />
    );
  }

  // If we have dynamic options without pagination, use DropdownSearch
  if (dynamicConfig) {
    // Create compatible config by mapping properties and memoize it
    const dropdownConfig = useMemo(() => ({
      url: dynamicConfig.url,
      valueField: dynamicConfig.valueKey,
      labelField: dynamicConfig.labelKey,
      searchParam: dynamicConfig.searchParamName,
      headers: dynamicConfig.headers,
      queryParams: dynamicConfig.queryParameters,
      transformResponse: dynamicConfig.transformResponse
    }), [dynamicConfig]);

    // Memoize options to prevent unnecessary rerenders
    const options = useMemo(() => field.options, [field.options]);

    return (
      <DropdownSearch
        columnKey={field.name}
        label=""  // Empty label as we handle it separately
        value={value || ''}
        onChange={onChange}
        options={options}
        dynamicConfig={dropdownConfig}
        dependencies={dependencyValues}
        placeholder={field.placeholder}
      />
    );
  }

  // Otherwise use regular Select
  // Memoize options to prevent unnecessary rerenders
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
export default memo(SelectField);
