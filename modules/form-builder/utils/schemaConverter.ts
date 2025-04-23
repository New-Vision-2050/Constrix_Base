import { FormConfig, FieldConfig } from '../types/formTypes';
import { TableConfig, ColumnConfig } from '@/modules/table/types/tableTypes';

interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  nullable: boolean;
  default?: any;
  foreign_key?: {
    references: string;
    on: string;
  };
}

interface SchemaRelation {
  type: string;
  model: string;
  foreign_key: string;
  local_key: string;
}

interface TableSchema {
  name: string;
  columns: SchemaField[];
  relationships: {
    [key: string]: SchemaRelation;
  };
}

const mapColumnTypeToFieldType = (column: SchemaField): FieldConfig['type'] => {
  const type = column.type.toLowerCase();

  if (column.foreign_key) {
    return 'select';
  }

  switch (type) {
    case 'string':
      if (type.includes('email')) return 'email';
      if (type.includes('password')) return 'password';
      if (type.includes('phone')) return 'phone';
      return 'text';
    case 'text':
    case 'longtext':
    case 'mediumtext':
      return 'textarea';
    case 'integer':
    case 'bigint':
    case 'decimal':
    case 'float':
    case 'double':
      return 'number';
    case 'boolean':
      return 'checkbox';
    case 'date':
    case 'datetime':
    case 'timestamp':
      return 'date';
    case 'enum':
      return 'select';
    case 'json':
    case 'jsonb':
      return 'hiddenObject';
    default:
      return 'text';
  }
};

export const generateFormConfig = (schema: TableSchema): FormConfig => {
  const fields: FieldConfig[] = schema.columns.map(column => {
    const baseField: FieldConfig = {
      type: mapColumnTypeToFieldType(column),
      name: column.name,
      label: column.name.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      required: column.required,
      placeholder: `Enter ${column.name}`,
    };

    if (column.foreign_key) {
      return {
        ...baseField,
        type: 'select',
        dynamicOptions: {
          url: `/api/${column.foreign_key.on}`,
          valueField: column.foreign_key.references,
          labelField: 'name', // Assuming a name field exists
        },
      };
    }

    return baseField;
  });

  return {
    title: `${schema.name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')} Form`,
    sections: [{
      fields,
    }],
    apiUrl: `/api/${schema.name}`,
    resetOnSuccess: true,
  };
};

export const generateTableConfig = (schema: TableSchema): TableConfig => {
  const columns: ColumnConfig[] = schema.columns.map(column => {
    const baseColumn: ColumnConfig = {
      key: column.name,
      label: column.name.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      sortable: true,
      searchable: true,
    };

    if (column.foreign_key) {
      return {
        ...baseColumn,
        type: 'relation',
        relation: {
          model: column.foreign_key.on,
          displayField: 'name', // Assuming a name field exists
        },
      };
    }

    return baseColumn;
  });

  return {
    columns,
    apiUrl: `/api/${schema.name}`,
    pagination: {
      enabled: true,
      pageSize: 10,
    },
    search: {
      enabled: true,
    },
    sort: {
      enabled: true,
    },
  };
};