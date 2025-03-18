import React, { memo } from 'react';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';
import DropdownSearch from '@/modules/table/components/table/DropdownSearch';

interface SearchFieldProps {
  field: FieldConfig;
  value: string | string[];
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: string | string[]) => void;
  onBlur: () => void;
  dependencyValues?: Record<string, any>;
}

const SearchField: React.FC<SearchFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  dependencyValues = {},
}) => {
  return (
    <div className={cn(
      field.className,
      !!error && touched ? 'border-destructive' : '',
      field.width ? field.width : 'w-full'
    )}>
      <DropdownSearch
        columnKey={field.name}
        label={field.label}
        value={value}
        onChange={onChange}
        options={field.options}
        dynamicConfig={field.dynamicOptions}
        dependencies={dependencyValues}
        placeholder={field.placeholder}
        isMulti={field.isMulti}
      />
    </div>
  );
};

export default memo(SearchField);