import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/table/components/ui/select';
import DropdownSearch from '@/modules/table/components/table/DropdownSearch';
import PaginatedDropdown from '@/modules/table/components/table/dropdowns/PaginatedDropdown';
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
  // If we have dynamic options with pagination enabled, use PaginatedDropdown
  if (field.dynamicOptions && field.dynamicOptions.paginationEnabled) {
    // Create compatible config by mapping properties
    const paginatedConfig = {
      url: field.dynamicOptions.url,
      valueField: field.dynamicOptions.valueKey,
      labelField: field.dynamicOptions.labelKey,
      searchParam: field.dynamicOptions.searchParamName,
      pageParam: 'page',
      limitParam: 'limit',
      itemsPerPage: field.dynamicOptions.pageSize || 10,
      headers: field.dynamicOptions.headers,
      queryParams: field.dynamicOptions.queryParameters,
      transformResponse: field.dynamicOptions.transformResponse
    };

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
        sectionId={undefined}
      />
    );
  }

  // If we have dynamic options without pagination, use DropdownSearch
  if (field.dynamicOptions) {
    // Create compatible config by mapping properties
    const dynamicConfig = {
      url: field.dynamicOptions.url,
      valueField: field.dynamicOptions.valueKey,
      labelField: field.dynamicOptions.labelKey,
      searchParam: field.dynamicOptions.searchParamName,
      headers: field.dynamicOptions.headers,
      queryParams: field.dynamicOptions.queryParameters,
      transformResponse: field.dynamicOptions.transformResponse
    };

    return (
      <DropdownSearch
        columnKey={field.name}
        label=""  // Empty label as we handle it separately
        value={value || ''}
        onChange={onChange}
        options={field.options}
        dynamicConfig={dynamicConfig}
        dependencies={dependencyValues}
        placeholder={field.placeholder}
      />
    );
  }

  // Otherwise use regular Select
  return (
    <Select
      value={value || ''}
      onValueChange={onChange}
    >
      <SelectTrigger id={field.name} className={cn(field.className, error && touched ? 'border-destructive' : '')}>
        <SelectValue placeholder={field.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {field.options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectField;
